import User from '../models/user.js';
import File from '../models/file.js';
import asyncHandler from 'express-async-handler';

export const getData = asyncHandler(async (req, res) => {
  try {
    // 1. Get all users (excluding sensitive data)
    const users = await User.find({})
      .select('-password -refreshToken -__v')
      .lean();

    // 2. Get all files with user references populated
    const files = await File.find({})
      .populate('uploadedBy', 'username') // Only include needed user fields
      .select('-__v')
      .lean();

    // 3. Structure the data as requested
    const result = {
      users: users.map(user => ({
        _id: user._id,
        username: user.username,
        createdAt: user.createdAt
      })),
      files: files.map(file => ({
        _id: file._id,
        title: file.title,
        fileType: file.fileType,
        size: file.size,
        createdAt: file.createdAt,
        uploadedBy: file.uploadedBy // This will contain populated user data
      }))
    };

    res.status(200).json({
      success: true,
      data: result,
      totalUsers: users.length,
      totalFiles: files.length
    });

  } catch (err) {
    console.error("Admin data fetch failed:", err);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: err.message 
    });
  }
});


export const deleteUser = async (req, res) => {
  try {

    const userId = req.params.id; 
    const user = await User.findByIdAndDelete(userId); 
    const files = await File.deleteMany({ uploadedBy: userId });}
  catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: 'Server error' });
  } 
} 