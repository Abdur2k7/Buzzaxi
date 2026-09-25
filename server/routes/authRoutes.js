import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dataService } from '../services/dataService.js';
import { authMiddleware } from '../middleware/auth.js';
import { getDBStatus } from '../config/db.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'buzzaxi_mumbai_secret_key_2026_jwt',
    { expiresIn: '7d' }
  );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    if (!getDBStatus().isConnected) {
      return res.status(503).json({ message: 'MongoDB is not connected, so your account cannot be saved yet. Start MongoDB and try again.' });
    }
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const name = String(req.body.name || '').trim();

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existingUser = await dataService.findUserByUsernameOrEmail(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already in use.' });
    }

    const existingEmail = await dataService.findUserByUsernameOrEmail(email);
    if (existingEmail) return res.status(400).json({ message: 'Email already registered.' });

    const newUser = await dataService.createUser({ username, email, password, name });
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'Account created successfully! Welcome to Buzzaxi Mumbai.',
      user: newUser,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    const duplicate = error?.code === 11000;
    res.status(duplicate ? 409 : 500).json({
      message: duplicate ? 'That username or email is already registered.' : 'Could not create your account. Check that MongoDB is connected and try again.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    if (!getDBStatus().isConnected) {
      return res.status(503).json({ message: 'MongoDB is not connected. Start MongoDB before signing in.' });
    }
    const username = String(req.body.username || req.body.email || '').trim();
    const password = String(req.body.password || '');

    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide both username and password.' });
    }

    const user = await dataService.findUserByUsernameOrEmail(username);
    if (!user) {
      return res.status(401).json({ message: 'No account found for that username or email. Register first, then sign in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id);
    const { password: _, ...userSafe } = user.toObject ? user.toObject() : user;

    res.json({
      message: 'Login successful. Welcome back to Buzzaxi Mumbai!',
      user: userSafe,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

const withRideCount = async (user) => {
  if (!user) return user;
  const raw = user.toObject ? user.toObject() : { ...user };
  delete raw.password;
  const rides = await dataService.getUserRides(raw._id, raw.username);
  return { ...raw, rideCount: rides.length };
};

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: await withRideCount(req.user) });
});

// PUT /api/auth/profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, profilePic } = req.body;

    if (profilePic && profilePic.length > 350000) {
      return res.status(400).json({ message: 'Profile photo is too large. Use an image under 250 KB.' });
    }

    const updated = await dataService.updateUser(req.user._id, { name, phone, profilePic });
    if (!updated) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      message: 'Profile updated.',
      user: await withRideCount(updated)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
});

export default router;
