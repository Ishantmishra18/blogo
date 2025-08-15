import User from '../models/user.js';
import File from '../models/file.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    // Check if user exists by username or email
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username 
          ? 'Username already exists' 
          : 'Email already registered' 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ 
      username, 
      email,
      password: hashedPassword,
      authMethod: 'local'
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("User creation failed:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Password incorrect' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });


  res.cookie('token', token, {
      httpOnly: true,
      secure: true,           // Required for HTTPS
      sameSite: 'None',       // Required for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const { password: _, ...userData } = user.toObject(); // remove password

    res.status(200).json({
      message: 'Login successful',
      user: userData,
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const logout = (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Logged out successfully' }); 
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findByIdAndDelete(userId); 
    const files = await File.deleteMany({ uploadedBy: userId });}
  catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Server error' });
  } 
} 


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getHistory = async ( req , res)=>{
  try{
    const files = await File.find({ uploadedBy: req.user.id });
    res.status(200).json(files);
  } catch (error){
    res.status(500).json({error})
  }
}