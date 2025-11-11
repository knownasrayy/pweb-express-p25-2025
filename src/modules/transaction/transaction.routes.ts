import { Router } from 'express';
import * as transactionController from './transaction.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/average', transactionController.getAverageTransactionAmount);

router.get('/:id', transactionController.getById);

export default router;