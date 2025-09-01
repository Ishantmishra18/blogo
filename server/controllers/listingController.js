// controllers/listingController.js

import Post from '../models/postSchema.js';
import User from '../models/userSchema.js';

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res) => {
  try {
    const { title, description , cover} = req.body;

    const newListing = await Post.create({
      owner: req.user.id,
      title,
      description,
      cover,
    });

    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create listing' });
  }
};




// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Listing not found' });
    if (post.owner.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Unauthorized' });
    const {title ,  description , cover }=req.body

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
      title,
      cover, 
      description,
    },{
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update listing', error });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: 'Listing not found' });
    if (post.owner.toString() !== req.user.id.toString())
      return res.status(403).json({ message: 'Unauthorized' });

    await post.deleteOne();
    res.status(200).json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete listing', error });
    console.log(error)
  }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getAllListings = async (req, res) => {
  try {
    const listings = await Post.find().sort({ createdAt: -1 }).populate('owner');
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listings', error });
  }
};

// @desc    Get a listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Listing not found' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch listing', error });
  }
};

// @desc    Get listings by a specific user
// @route   GET /api/listings/user/:userId
// @access  Private
export const getUserListings = async (req, res) => {
  try {
    const listings = await Post.find({ owner: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user listings', error });
  }
};

