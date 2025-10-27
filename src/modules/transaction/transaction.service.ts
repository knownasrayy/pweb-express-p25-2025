// src/modules/transaction/transaction.service.ts
import prisma from '../../prisma';

// Import Prisma di service untuk menggunakan transaksi database
import { Prisma } from '@prisma/client';

interface ItemInput {
  bookId: string;
  quantity: number;
}

// Logika Transaksi: Beli Buku
export const createTransaction = async (userId: string, items: ItemInput[]) => {
  // Transaksi Database: Memastikan semua operasi (cek stok, update stok, create order)
  // berhasil atau gagal semua (Atomic)
  const transactionResult = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const transactionDetailsData: Prisma.TransactionDetailCreateManyTransactionInput[] = [];

    for (const item of items) {
      // 1. Cek Ketersediaan Buku
      const book = await tx.book.findFirst({
        where: { id: item.bookId, deletedAt: null },
        select: { id: true, stockQuantity: true, price: true },
      });

      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found.`);
      }

      // 2. Cek Stok (Bug Transaksi: Stok habis)
      if (book.stockQuantity < item.quantity) {
        // Error ini akan ditangkap oleh error.middleware karena mengandung 'stock'
        throw new Error(`Insufficient stock for book ID ${item.bookId}. Current stock: ${book.stockQuantity}`);
      }

      // 3. Hitung Subtotal dan Total
      const subTotal = book.price * item.quantity;
      totalAmount += subTotal;

      // 4. Kurangi Stok Buku
      await tx.book.update({
        where: { id: book.id },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });

      // 5. Siapkan Data Detail Transaksi
      transactionDetailsData.push({
        bookId: book.id,
        quantity: item.quantity,
        priceAtBuy: book.price, // Simpan harga saat ini (WAJIB)
      });
    }

    // 6. Buat Header Transaksi (Order)
    const transaction = await tx.transaction.create({
      data: {
        userId: userId,
        totalAmount: totalAmount, // Simpan total amount (WAJIB)
        transactionItems: {
          createMany: {
            data: transactionDetailsData,
          },
        },
      },
      include: {
        transactionItems: {
          include: { book: { select: { title: true } } },
        },
      },
    });

    return transaction;
  });

  return transactionResult;
};

// Get All (Hanya untuk user yang login)
export const getAllTransactionsByUserId = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId: userId },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { username: true } },
      transactionItems: {
        include: { book: { select: { title: true } } },
      },
    },
  });

  if (transactions.length === 0) {
    throw new Error('No transactions found for this user.');
  }

  return transactions;
};

// Rata-rata Nominal Tiap Transaksi (WAJIB)
export const getAverageTransactionAmount = async () => {
  const result = await prisma.transaction.aggregate({
    _avg: {
      totalAmount: true,
    },
    _sum: {
      totalAmount: true,
    },
    _count: {
      id: true,
    }
  });

  return {
    average: result._avg.totalAmount || 0,
    totalCount: result._count.id,
    totalSum: result._sum.totalAmount || 0,
  };
};