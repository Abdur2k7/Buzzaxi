import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  vehicle: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['auto', 'economy', 'suv', 'luxury', 'ferrari', 'vip']
  },
  photo: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 4.8
  },
  isVip: {
    type: Boolean,
    default: false
  }
});

export const Driver = mongoose.model('Driver', driverSchema);
