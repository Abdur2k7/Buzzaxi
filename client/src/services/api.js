// Use the Vite proxy during local development and the deployed API in production.
const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

const getHeaders = () => {
  const token = localStorage.getItem('buzzaxi_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Authentication
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  register: async (username, email, password, name) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  },

  // Master Data
  getRoutes: async () => {
    const res = await fetch(`${API_BASE}/data/routes`);
    if (!res.ok) throw new Error('Failed to fetch Mumbai routes');
    return await res.json();
  },

  getVehicles: async () => {
    const res = await fetch(`${API_BASE}/data/vehicles`);
    if (!res.ok) throw new Error('Failed to fetch vehicles');
    return await res.json();
  },

  getSystemStatus: async () => {
    const res = await fetch(`${API_BASE}/data/system-status`);
    if (!res.ok) throw new Error('Failed to fetch system status');
    return await res.json();
  },

  // Rides & Bookings
  estimateFare: async (routeId, vehicleId) => {
    const res = await fetch(`${API_BASE}/rides/estimate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ routeId, vehicleId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error estimating fare');
    return data;
  },

  updateProfile: async ({ name, phone, profilePic }) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ name, phone, profilePic })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data;
  },

  bookRide: async ({ routeId, vehicleId, acceptVip = false, rejectVip = false, userName, seatNumber }) => {
    const res = await fetch(`${API_BASE}/rides/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ routeId, vehicleId, acceptVip, rejectVip, userName, seatNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to book ride');
    return data;
  },

  confirmSeat: async (rideId, seatNumber) => {
    const res = await fetch(`${API_BASE}/rides/${rideId}/seat`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ seatNumber })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to confirm seat');
    return data;
  },

  updateRideStatus: async (rideId, status) => {
    const res = await fetch(`${API_BASE}/rides/${rideId}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update ride status');
    return data;
  },

  rateRide: async (rideId, rating) => {
    const res = await fetch(`${API_BASE}/rides/${rideId}/rate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ rating })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit rating');
    return data;
  },

  cancelRide: async (rideId) => {
    const res = await fetch(`${API_BASE}/rides/${rideId}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({})
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to cancel ride');
    return data;
  },

  getMyRides: async (userName) => {
    const query = userName ? `?userName=${encodeURIComponent(userName)}` : '';
    const res = await fetch(`${API_BASE}/rides/history${query}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch ride history');
    return await res.json();
  }
};
