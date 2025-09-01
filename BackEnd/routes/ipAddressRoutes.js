import express from 'express';
import {
    getAllIpAddresses,
    getIpAddressById,
    createIpAddress,
    updateIpAddress,
    deleteIpAddress
} from '../controllers/ipAddressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getAllIpAddresses)
    .post(protect, createIpAddress);

router.route('/:id')
    .get(protect, getIpAddressById)
    .put(protect, updateIpAddress)
    .delete(protect, deleteIpAddress);

export default router;