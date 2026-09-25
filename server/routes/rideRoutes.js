import express from 'express';
import { dataService } from '../services/dataService.js';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper to look up route & vehicle objects
const findRouteAndVehicle = (routeId, vehicleId) => {
  let foundRoute = null;
  for (const group of dataService.getRoutes()) {
    const r = group.items.find(item => item.id === routeId);
    if (r) {
      foundRoute = { ...r, category: group.category };
      break;
    }
  }

  let foundVehicle = null;
  for (const group of dataService.getVehicles()) {
    const v = group.items.find(item => item.id === vehicleId);
    if (v) {
      foundVehicle = { ...v, categoryGroup: group.category };
      break;
    }
  }

  return { foundRoute, foundVehicle };
};

// POST /api/rides/estimate
router.post('/estimate', (req, res) => {
  const { routeId, vehicleId } = req.body;
  if (!routeId || !vehicleId) {
    return res.status(400).json({ message: 'Both routeId and vehicleId are required.' });
  }

  const { foundRoute, foundVehicle } = findRouteAndVehicle(routeId, vehicleId);
  if (!foundRoute || !foundVehicle) {
    return res.status(404).json({ message: 'Selected route or vehicle not found.' });
  }

  const distance = foundRoute.distance;
  const pricePerKm = foundVehicle.pricePerKm;
  const fare = distance * pricePerKm;

  res.json({
    route: foundRoute,
    vehicle: foundVehicle,
    distance,
    pricePerKm,
    fare,
    currency: '₹'
  });
});

// POST /api/rides/book
router.post('/book', optionalAuthMiddleware, async (req, res) => {
  try {
    const { routeId, vehicleId, acceptVip = false, rejectVip = false } = req.body;

    const { foundRoute, foundVehicle } = findRouteAndVehicle(routeId, vehicleId);
    if (!foundRoute || !foundVehicle) {
      return res.status(404).json({ message: 'Selected route or vehicle not found.' });
    }

    const fare = foundRoute.distance * foundVehicle.pricePerKm;

    // Check if VIP vehicle was selected
    const isVipVehicle = foundVehicle.id === 'vip-maybach';

    // If VIP vehicle is chosen and not explicitly accepted or rejected yet, return VIP prompt
    if (isVipVehicle && !acceptVip && !rejectVip) {
      const vipDriver = await dataService.getDriverForVehicle('vip', true);
      return res.json({
        vipRequired: true,
        message: 'VIP Driver available for this Maybach trip!',
        vipDriver: {
          name: vipDriver.name,
          vehicle: vipDriver.vehicle,
          photo: vipDriver.photo,
          rating: vipDriver.rating
        }
      });
    }

    // Driver selection
    let driver;
    if (isVipVehicle && acceptVip) {
      driver = await dataService.getDriverForVehicle('vip', true);
    } else if (isVipVehicle && rejectVip) {
      driver = await dataService.getDriverForVehicle('economy', false);
    } else {
      let cat = 'economy';
      if (foundVehicle.id.startsWith('auto-')) cat = 'auto';
      else if (foundVehicle.id.startsWith('suv-')) cat = 'suv';
      else if (foundVehicle.id.startsWith('luxury-')) cat = 'luxury';
      else if (foundVehicle.id === 'ferrari-sf90') cat = 'ferrari';
      driver = await dataService.getDriverForVehicle(cat, false);
    }

    const passengerCapacity = foundVehicle.passengerCapacity || 3;
    const requestedSeat = Number(req.body.seatNumber) || null;
    if (requestedSeat && (requestedSeat < 1 || requestedSeat > passengerCapacity)) {
      return res.status(400).json({ message: 'Selected seat is not valid for this vehicle.' });
    }

    const allSeats = Array.from({ length: passengerCapacity }, (_, i) => i + 1);
    const occupyCount = Math.min(
      passengerCapacity - 1,
      Math.floor(Math.random() * passengerCapacity)
    );
    const shuffled = [...allSeats].sort(() => Math.random() - 0.5);
    const occupiedSeats = [];
    for (const seat of shuffled) {
      if (occupiedSeats.length >= occupyCount) break;
      if (seat === requestedSeat) continue;
      occupiedSeats.push(seat);
    }

    const currentPassengers = occupiedSeats.length;
    const availableSeats = passengerCapacity - currentPassengers;

    const userName = req.user ? req.user.username : (req.body.userName || 'Mumbaikar Guest');
    const userId = req.user ? req.user._id : null;

    const newRide = await dataService.createRide({
      userId,
      userName,
      route: {
        id: foundRoute.id,
        name: foundRoute.name,
        category: foundRoute.category,
        distance: foundRoute.distance
      },
      vehicle: {
        id: foundVehicle.id,
        name: foundVehicle.name,
        category: foundVehicle.categoryGroup,
        pricePerKm: foundVehicle.pricePerKm,
        capacity: passengerCapacity
      },
      fare,
      driver: {
        name: driver.name,
        vehicle: driver.vehicle,
        photo: driver.photo,
        isVip: driver.isVip || false
      },
      seatNumber: requestedSeat,
      occupiedSeats,
      totalPassengers: currentPassengers,
      availableSeats,
      status: requestedSeat ? 'in_progress' : 'driver_assigned'
    });

    res.status(201).json({
      message: 'Ride booked successfully!',
      ride: newRide
    });
  } catch (error) {
    console.error('Book ride error:', error);
    res.status(500).json({ message: 'Error booking ride.', error: error.message });
  }
});

const sendRideHistory = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : req.query.userId;
    const userName = req.user ? req.user.username : (req.query.userName || 'Mumbaikar Guest');
    const rides = await dataService.getUserRides(userId, userName);
    res.json({ rides });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ride history.', error: error.message });
  }
};

router.get('/my-rides', optionalAuthMiddleware, sendRideHistory);
router.get('/history', optionalAuthMiddleware, sendRideHistory);

// GET /api/rides/:id
router.get('/:id', async (req, res) => {
  try {
    const ride = await dataService.getRideById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found.' });
    res.json({ ride });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving ride.', error: error.message });
  }
});

// PUT /api/rides/:id/seat
router.put('/:id/seat', async (req, res) => {
  try {
    const { seatNumber } = req.body;
    const updated = await dataService.updateRide(req.params.id, {
      seatNumber: Number(seatNumber),
      status: 'in_progress'
    });
    if (!updated) return res.status(404).json({ message: 'Ride not found.' });
    res.json({ message: `Seat ${seatNumber} confirmed! Trip started.`, ride: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error confirming seat.', error: error.message });
  }
});

// PUT /api/rides/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await dataService.updateRide(req.params.id, { status });
    if (!updated) return res.status(404).json({ message: 'Ride not found.' });
    res.json({ message: `Ride status updated to ${status}.`, ride: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating ride status.', error: error.message });
  }
});

const submitRating = async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a number from 1 to 5.' });
    }
    const updated = await dataService.updateRide(req.params.id, {
      rating,
      status: 'completed'
    });
    if (!updated) return res.status(404).json({ message: 'Ride not found.' });
    res.json({ message: 'Thank you for rating your ride!', ride: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting rating.', error: error.message });
  }
};

router.put('/:id/rate', submitRating);
router.post('/:id/rate', submitRating);

// PUT /api/rides/:id/cancel
router.put('/:id/cancel', async (req, res) => {
  try {
    const updated = await dataService.updateRide(req.params.id, {
      status: 'cancelled'
    });
    if (!updated) return res.status(404).json({ message: 'Ride not found.' });
    res.json({ message: 'Ride has been cancelled.', ride: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling ride.', error: error.message });
  }
});

export default router;
