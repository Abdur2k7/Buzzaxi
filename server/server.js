import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import dataRoutes from './routes/dataRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with automatic resilient fallback
await connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    app: 'Buzzaxi Mumbai Shared Shuttle Service',
    stack: 'MERN (MongoDB, Express, React, Node.js)',
    status: 'online',
    database: getDBStatus(),
    endpoints: {
      auth: '/api/auth',
      rides: '/api/rides',
      data: '/api/data'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/data', dataRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Buzzaxi Server Error]:', err.stack);
  res.status(500).json({
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚕 Buzzaxi Express Server running at http://localhost:${PORT}`);
  console.log(`📦 Database Driver in use: ${getDBStatus().driver}`);
});
