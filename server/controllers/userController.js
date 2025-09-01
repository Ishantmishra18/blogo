import User from '../models/userSchema.js';




export const editUser = async(req, res)=>{
    try {
    const userId = req.user.id; // Use auth middleware to set req.user
    const { 
      name, email, phone, dob, location, gender, language, bio 
    } = req.body;

    const updateFields = {
      name,
      email,
      phone,
      dob,
      location,
      gender,
      language,
      bio,
    }
    if (req.file && req.file.path) {
      updateFields.cover = req.file.path; // from Cloudinary's response (via multer)
    }

    // Update the user in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  }

    catch(error){
      console.error('Error editing user:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
}
export const addBookmark = async (req, res) => {
  const { postID } = req.params;
  const user = await User.findById(req.user.id);

  if (!user.bookmarks.includes(postID)) {
    user.bookmarks.push(postID);
    await user.save();
  }

  res.status(200).json({ message: 'Bookmarked' });
};

export const removeBookmark = async (req, res) => {
  const { postID } = req.params;
  const user = await User.findById(req.user.id);

  user.bookmarks = user.bookmarks.filter(id => id.toString() !== postID);
  await user.save();

  res.status(200).json({ message: 'Bookmark removed' });
};


export const getBookmarks = async (req, res) => {
  const user = await User.findById(req.user.id).populate('bookmarks');
  res.status(200).json(user.bookmarks);
};