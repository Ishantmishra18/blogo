import express from 'express';
import passport from 'passport';
import {
  register,
  login,
  googleAuthSuccess,
  logout,
  deleteAccount,
  getMe,
  getHistory
} from '../controllers/authCon.js';
import { protect } from '../middlewares/authMiddle.js';

const router = express.Router();

// Local authentication
router.post('/register', register);
router.post('/login', login);

// Google authentication
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/login?error=google_auth_failed',
    successRedirect: process.env.FRONTEND_URL || 'http://localhost:5173', // Redirect to frontend after login
    session: true // Enable sessions (required for persistent auth)
  })
);

// Protected routes
router.post('/logout', protect, logout);
router.delete('/delete', protect, deleteAccount);
router.get('/me', protect, getMe);
router.get('/history', protect, getHistory);

export default router;