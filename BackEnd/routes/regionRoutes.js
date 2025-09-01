import express from 'express';
import { 
  getAllRegions,
  createRegion,
  updateRegion,
  deleteRegion
} from '../controllers/regionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chaining routes for the same path '/'
router.route('/')
  .get(protect, getAllRegions)   // Get all regions
  .post(protect, createRegion);  // Create a new region

// Chaining routes for the path with an ID
router.route('/:id')
  .put(protect, updateRegion)    // Update a region by ID
  .delete(protect, deleteRegion); // Delete a region by ID
 
export default router;