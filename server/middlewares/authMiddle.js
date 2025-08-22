import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// For JWT/local auth
export const jwtAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Missing token');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// For Google OAuth sessions
export const googleAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Google authentication required' });
};



// Universal middleware (tries both methods)
export const protect = async (req, res, next) => {
  try {
    // 1. Try JWT from cookies or Authorization header
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) throw new Error('User not found');
      return next();
    }

    // 2. Check Passport session
    if (req.isAuthenticated()) {
      req.user = await User.findById(req.user.id).select('-password');
      return next();
    }

    // 3. Check Authorization header for Bearer token (API clients)
    throw new Error('No valid authentication');
  } catch (error) {
    console.error('Auth Error:', error.message);
    res.status(401).json({ 
      message: 'Authentication required',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};