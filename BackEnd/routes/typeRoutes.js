import express from 'express';
import { 
    getAllTypes,
    createType,
    updateType,
    deleteType
} from '../controllers/typeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chain routes for better organization
router.route('/')
    .get(protect, getAllTypes)
    .post(protect, createType);

router.route('/:id')
    .put(protect, updateType)
    .delete(protect, deleteType);

export default router;