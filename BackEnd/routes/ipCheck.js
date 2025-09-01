const express = require('express');
const router = express.Router();
const ipController = require('../controllers/ipController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/check', authMiddleware, ipController.checkIP);

module.exports = router;
