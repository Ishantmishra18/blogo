// routes/listingRoutes.js

import express from 'express';
import {
  createListing,
  updateListing,
  deleteListing,
  getListingById,
  getAllListings,
  getUserListings,
  getPostComments,
  addComment,
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new listing
router.post('/add', protect, createListing);


// Update an existing listing
router.put('/:id', protect, updateListing);

// Delete a listing
router.delete('/:id', protect, deleteListing);

// Get all listings
router.get('/get', getAllListings);

// Get a single listing by ID
router.get('/:id', getListingById);

// Get all listings by a specific user (e.g. "My Listings")
router.get('/mypost/:userId', protect, getUserListings);

// Get all comments for a specific listing
router.get('/:id/comments', protect, getPostComments);

router.post('/:id/comment', protect, addComment); 


export default router;