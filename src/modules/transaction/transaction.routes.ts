// src/modules/transaction/transaction.routes.ts
import { Router } from 'express';
import * as transactionController from './transaction.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Endpoint untuk membuat transaksi (WAJIB otentikasi)
router.post('/', authMiddleware, transactionController.createTransaction);

// Endpoint untuk melihat transaksi (WAJIB otentikasi)
router.get('/', authMiddleware, transactionController.getAllTransactions);

// Endpoint untuk menghitung rata-rata nominal
router.get('/average', authMiddleware, transactionController.getAverageTransactionAmount);

export default router;