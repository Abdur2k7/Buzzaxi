import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import dataRoutes from './routes/dataRoutes.js';
import { dataService } from './services/dataService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (.env in server directory, then root if present)
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with automatic resilient in-memory fallback
await connectDB();
await dataService.seedDemoData();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check API Route (Used by Render Health Check and Monitoring)
const healthHandler = (req, res) => {
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
};

app.get('/api/health', healthHandler);
app.get('/api/status', healthHandler);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/data', dataRoutes);

// Static client assets (for Render production fullstack deployment)
const clientDistPath = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(clientDistPath)) {
  console.log(`[Buzzaxi Production] Serving static frontend from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Catch-all route to serve React index.html for client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Fallback for standalone API development mode when client is not built
  app.get('/', healthHandler);
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Buzzaxi Server Error]:', err.stack);
  res.status(500).json({
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(PORT, () => {
  console.log(`🚕 Buzzaxi Express Server running on port ${PORT}`);
  console.log(`📦 Database Driver in use: ${getDBStatus().driver}`);
});
