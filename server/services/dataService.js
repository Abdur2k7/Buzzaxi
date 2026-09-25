import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Driver } from '../models/Driver.js';
import { Ride } from '../models/Ride.js';
import { initialRoutes, initialVehicles, initialDrivers } from '../data/initialData.js';
import { getDBStatus } from '../config/db.js';

// In-Memory fallback store
const inMemoryStore = {
  users: [],
  drivers: [...initialDrivers.map((d, index) => ({ _id: `driver_${index + 1}`, ...d }))],
  rides: [],
  routes: initialRoutes,
  vehicles: initialVehicles
};

const toSafeUser = (user) => {
  if (!user) return null;
  const raw = user.toObject ? user.toObject() : { ...user };
  const { password, ...rest } = raw;
  if (rest._id) rest._id = rest._id.toString();
  return rest;
};

export const dataService = {
  // Routes & Vehicles
  getRoutes: () => initialRoutes,
  getVehicles: () => initialVehicles,

  // Drivers
  getDrivers: async () => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        const drivers = await Driver.find();
        if (drivers && drivers.length > 0) return drivers;
      } catch (e) {
        // Fallback on error
      }
    }
    return inMemoryStore.drivers;
  },

  getDriverForVehicle: async (vehicleCategory, isVipSelected = false) => {
    const drivers = await dataService.getDrivers();
    if (isVipSelected) {
      const vip = drivers.find(d => d.isVip);
      if (vip) return vip;
    }
    const matched = drivers.filter(d => !d.isVip && (d.category === vehicleCategory || vehicleCategory.startsWith(d.category)));
    if (matched.length > 0) {
      return matched[Math.floor(Math.random() * matched.length)];
    }
    // Return any non-vip driver
    const nonVip = drivers.filter(d => !d.isVip);
    return nonVip[Math.floor(Math.random() * nonVip.length)];
  },

  // User Management
  findUserByUsernameOrEmail: async (identifier) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        return await User.findOne({
          $or: [{ username: identifier }, { email: identifier.toLowerCase() }]
        });
      } catch (e) {
        console.error('Mongo findUser error:', e.message);
      }
    }
    return inMemoryStore.users.find(
      u => u.username.toLowerCase() === identifier.toLowerCase() || 
           u.email.toLowerCase() === identifier.toLowerCase()
    );
  },

  findUserById: async (id) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        return await User.findById(id).select('-password');
      } catch (e) {
        console.error('Mongo findUserById error:', e.message);
      }
    }
    const u = inMemoryStore.users.find(u => u._id === id);
    if (!u) return null;
    const { password, ...rest } = u;
    return rest;
  },

  createUser: async ({ username, email, password, name }) => {
    const { isInMemoryFallback } = getDBStatus();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!isInMemoryFallback) {
      try {
        const newUser = await User.create({
          username,
          email: email.toLowerCase(),
          password: hashedPassword,
          name: name || username,
          phone: '',
          profilePic: ''
        });
        return toSafeUser(newUser);
      } catch (e) {
        console.error('Mongo createUser error:', e.message);
        throw e;
      }
    }

    const newUser = {
      _id: `user_${Date.now()}`,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      name: name || username,
      phone: '',
      profilePic: '',
      createdAt: new Date()
    };
    inMemoryStore.users.push(newUser);
    return toSafeUser(newUser);
  },

  updateUser: async (id, fields) => {
    const allowed = {};
    if (typeof fields.name === 'string') allowed.name = fields.name.trim();
    if (typeof fields.phone === 'string') allowed.phone = fields.phone.trim();
    if (typeof fields.profilePic === 'string') allowed.profilePic = fields.profilePic;

    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        const updated = await User.findByIdAndUpdate(id, allowed, { new: true }).select('-password');
        if (updated) return toSafeUser(updated);
      } catch (e) {
        console.error('Mongo updateUser error:', e.message);
      }
    }

    const user = inMemoryStore.users.find((u) => u._id === id || u._id?.toString() === String(id));
    if (!user) return null;
    Object.assign(user, allowed);
    return toSafeUser(user);
  },

  // Rides Management
  createRide: async (rideData) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        const ride = await Ride.create(rideData);
        return ride;
      } catch (e) {
        console.error('Mongo createRide error:', e.message);
      }
    }

    const newRide = {
      _id: `ride_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      ...rideData,
      status: rideData.status || 'driver_assigned',
      createdAt: new Date()
    };
    inMemoryStore.rides.unshift(newRide);
    return newRide;
  },

  getUserRides: async (userId, userName) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        const query = userId ? { userId } : { userName };
        return await Ride.find(query).sort({ createdAt: -1 });
      } catch (e) {
        console.error('Mongo getUserRides error:', e.message);
      }
    }
    return inMemoryStore.rides
      .filter(r => (userId && r.userId === userId) || (userName && r.userName === userName))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getRideById: async (id) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        return await Ride.findById(id);
      } catch (e) {
        console.error('Mongo getRideById error:', e.message);
      }
    }
    return inMemoryStore.rides.find(r => r._id === id);
  },

  updateRide: async (id, updateData) => {
    const { isInMemoryFallback } = getDBStatus();
    if (!isInMemoryFallback) {
      try {
        const updated = await Ride.findByIdAndUpdate(id, updateData, { new: true });
        if (updated) return updated;
      } catch (e) {
        console.error('Mongo updateRide error:', e.message);
      }
    }

    const rideIndex = inMemoryStore.rides.findIndex(r => r._id === id);
    if (rideIndex !== -1) {
      inMemoryStore.rides[rideIndex] = {
        ...inMemoryStore.rides[rideIndex],
        ...updateData,
        updatedAt: new Date()
      };
      return inMemoryStore.rides[rideIndex];
    }
    return null;
  }
};
