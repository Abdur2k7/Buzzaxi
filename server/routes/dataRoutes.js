import express from 'express';
import { dataService } from '../services/dataService.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

// GET /api/data/routes
router.get('/routes', (req, res) => {
  res.json({ routes: dataService.getRoutes() });
});

// GET /api/data/vehicles
router.get('/vehicles', (req, res) => {
  res.json({ vehicles: dataService.getVehicles() });
});

// GET /api/data/drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await dataService.getDrivers();
    res.json({ drivers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
});

// GET /api/data/system-status
router.get('/system-status', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Buzzaxi Mumbai Shared Shuttle MERN API',
    database: getDBStatus(),
    timestamp: new Date()
  });
});

export default router;
