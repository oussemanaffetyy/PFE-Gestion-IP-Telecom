import express from 'express';
import { checkIpController } from '../controllers/ipController.js';

const router = express.Router();

router.post('/check', checkIpController);

export default router;