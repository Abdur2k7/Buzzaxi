import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userName: {
    type: String,
    required: true
  },
  route: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String },
    distance: { type: Number, required: true }
  },
  vehicle: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    pricePerKm: { type: Number, required: true },
    capacity: { type: Number, required: true }
  },
  fare: {
    type: Number,
    required: true
  },
  driver: {
    name: { type: String, required: true },
    vehicle: { type: String, required: true },
    photo: { type: String, required: true },
    isVip: { type: Boolean, default: false }
  },
  seatNumber: {
    type: Number,
    default: null
  },
  occupiedSeats: {
    type: [Number],
    default: []
  },
  totalPassengers: {
    type: Number,
    default: 0
  },
  availableSeats: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['booked', 'driver_assigned', 'in_progress', 'arrived', 'completed', 'cancelled'],
    default: 'booked'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Ride = mongoose.model('Ride', rideSchema);
