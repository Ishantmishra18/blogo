import jwt from 'jsonwebtoken';

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
    // Try JWT first
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = { id: decoded.id };
      return next();
    }
    
    // Fallback to Passport session
    if (req.isAuthenticated()) return next();
    
    throw new Error('No valid authentication');
  } catch (error) {
    res.status(401).json({ message: 'Authentication required' });
  }
};