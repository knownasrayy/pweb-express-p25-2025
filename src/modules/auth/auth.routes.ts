// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe); // <-- Endpoint ini dilindungi

export default router;