import express from 'express';
import {
    getAllSites,
    getSiteById,
    createSite,
    updateSite,
    deleteSite
} from '../controllers/siteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for getting all sites and creating a new site
router.route('/')
    .get(protect, getAllSites)
    .post(protect, createSite);

// Routes for getting, updating, and deleting a single site by its ID
router.route('/:id')
    .get(protect, getSiteById)
    .put(protect, updateSite)
    .delete(protect, deleteSite);

export default router;