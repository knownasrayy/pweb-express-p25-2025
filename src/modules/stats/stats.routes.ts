import { Router } from 'express';
import * as statsController from './stats.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();


router.get('/', authMiddleware, statsController.getStats);

export default router;