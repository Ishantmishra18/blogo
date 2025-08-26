import User from '../models/user.js';
import File from '../models/file.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, authMethod: user.authMethod },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const sendAuthResponse = (res, user) => {
  const token = generateToken(user);
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.json({
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      cover: user.cover,
      authMethod: user.authMethod,
      history: user.history || []
    }
  });
};

// Controller methods
export const register = async (req, res) => {
  console.log("Register endpoint hit");
  try {
    const { username, password } = req.body;
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = await User.create({
      username,
      password,
      authMethod: 'local'
    });

    sendAuthResponse(res, user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : null 
    });
  }
};


export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username })
      .select('+password'); // Include password for verification

    if (!user || user.authMethod !== 'local') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Remove password before sending response
    user.password = undefined;
    sendAuthResponse(res, user);
  } catch (err) {
    res.status(500).json({ 
      message: 'Login failed', 
      error: process.env.NODE_ENV === 'development' ? err.message : null 
    });
  }
};

export const googleAuthSuccess = (req, res) => {
  sendAuthResponse(res, req.user);
};

export const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const deleteAccount = async (req, res) => {
  try {
    await File.deleteMany({ uploadedBy: req.user.id });
    await User.findByIdAndDelete(req.user.id);
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v -email -googleId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      username: user.username,
      name: user.name,
      cover: user.cover,
      history: user.history || [],
      authMethod: user.authMethod,
      createdAt: user.createdAt
    });
    
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

export const getHistory = async (req, res) => {
  try {
    const files = await File.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : null 
    });
  }
};