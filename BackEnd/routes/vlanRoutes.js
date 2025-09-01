import express from 'express';
import {
    getAllVlans,
    getVlanById,
    createVlan,
    updateVlan,
    deleteVlan
} from '../controllers/vlanController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllVlans)
    .post(protect, createVlan);

router.route('/:id')
    .get(protect, getVlanById)
    .put(protect, updateVlan)
    .delete(protect, deleteVlan);

export default router;