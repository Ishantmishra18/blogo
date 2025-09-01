// routes/listingRoutes.js

import express from 'express';
import {
  createListing,
  updateListing,
  deleteListing,
  getListingById,
  getAllListings,
  getUserListings,
} from '../controllers/listingController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Create a new listing
router.post('/add', protect,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ]),
  createListing
);


// Update an existing listing
router.put('/:id', protect,
  upload.fields([
    {name:'cover' , maxCount :1},
    {name: 'images' , maxCount :3 }
  ]), updateListing);

// Delete a listing
router.delete('/:id', protect, deleteListing);

// Get all listings
router.get('/get', getAllListings);

// Get a single listing by ID
router.get('/:id', getListingById);

// Get all listings by a specific user (e.g. "My Listings")
router.get('/mypost/:userId', protect, getUserListings);


export default router;