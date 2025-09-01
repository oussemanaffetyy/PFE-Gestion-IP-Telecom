import express from 'express';
import { loginController } from '../controllers/authController.js';

const routerAuth = express.Router();

routerAuth.post('/login', loginController);

export default routerAuth;