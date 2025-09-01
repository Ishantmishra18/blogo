import Post from '../models/postSchema.js';
import User from '../models/userSchema.js';

export const getData = async (req, res) => {
  const users = await User.find().select('-password'); // Exclude passwords
  const posts = await Post.find().populate('owner', 'name email'); // Populate owner details
  
    if (!post) {    
        return res.status(404).json({ message: 'Post not found' });
    } 
    res.status(200).json({ users, posts });
 }