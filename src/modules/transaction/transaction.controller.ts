// src/modules/transaction/transaction.controller.ts
import { Response, NextFunction } from 'express';
import * as transactionService from './transaction.service';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware'; // Import dari middleware

// Interface untuk body request POST /transactions
interface CreateTransactionBody {
  items: {
    bookId: string;
    quantity: number;
  }[];
}

export const createTransaction = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id; // Diambil dari token
    const { items }: CreateTransactionBody = req.body;

    // Validasi Body
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items list is required and cannot be empty.' });
    }
    for (const item of items) {
      if (!item.bookId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({ message: 'Each item must have a valid bookId and a positive quantity.' });
      }
      if (!Number.isInteger(item.quantity)) {
        return res.status(400).json({ message: 'Quantity must be an integer.' });
      }
    }

    const transaction = await transactionService.createTransaction(userId, items);
    res.status(201).json({ message: 'Transaction created successfully', data: transaction });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Hanya ambil transaksi milik user yang login (sesuai best practice)
    const userId = req.user.id; 
    const transactions = await transactionService.getAllTransactionsByUserId(userId);
    res.status(200).json({ message: 'Transactions fetched successfully', data: transactions });
  } catch (error) {
    next(error);
  }
};

// Endpoint baru untuk menghitung rata-rata nominal tiap transaksi
export const getAverageTransactionAmount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Kita anggap admin yang akses, atau minimal user bisa lihat rata-rata semua transaksi
    const average = await transactionService.getAverageTransactionAmount();
    res.status(200).json({ message: 'Average transaction amount calculated successfully', data: average });
  } catch (error) {
    next(error);
  }
};