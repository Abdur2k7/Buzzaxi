import jwt from 'jsonwebtoken';
import { dataService } from '../services/dataService.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'buzzaxi_mumbai_secret_key_2026_jwt');
    const user = await dataService.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User associated with token no longer exists.' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authentication token.' });
  }
};

export const optionalAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'buzzaxi_mumbai_secret_key_2026_jwt');
      const user = await dataService.findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignored for optional auth
    }
  }
  next();
};
