import express from 'express';
import { 
    getMyProfile, updateMyProfile, changeMyPassword, 
    forgotPassword, resetPassword,
    getAllAdmins, createAdmin, updateAdmin, deleteAdmin 
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Routes pour le profil perso de l'admin connecté
router.route('/profile').get(protect, getMyProfile).put(protect, upload, updateMyProfile);
router.put('/profile/change-password', protect, changeMyPassword);

// Routes publiques pour le mot de passe oublié
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Routes protégées pour la gestion de TOUS les admins
router.route('/').get(protect, getAllAdmins).post(protect, upload, createAdmin);
router.route('/:id').put(protect, updateAdmin).delete(protect, deleteAdmin);

export default router;