import express from 'express';
import { scanAndSaveAnomalies, getAnomalies, acknowledgeAnomaly } from '../controllers/anomalyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAnomalies); // Get history
router.post('/scan', protect, scanAndSaveAnomalies); // Run a new scan
router.put('/:id/acknowledge', protect, acknowledgeAnomaly); // Acknowledge an anomaly

export default router;