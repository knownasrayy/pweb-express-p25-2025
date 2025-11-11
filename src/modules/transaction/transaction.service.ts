import prisma from '../../prisma';
import { Prisma } from '@prisma/client';

interface ItemInput {
  bookId: string;
  quantity: number;
}

interface TransactionQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  orderBy?: string;
  userId: string;
}

export const createTransaction = async (userId: string, items: ItemInput[]) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const transactionDetailsData: Prisma.TransactionDetailCreateManyTransactionInput[] = [];

    for (const item of items) {
      const book = await tx.book.findFirst({
        where: { id: item.bookId, deletedAt: null },
        select: { id: true, stockQuantity: true, price: true },
      });

      if (!book) {
        throw new Error(`Book with ID ${item.bookId} not found.`);
      }

      if (book.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for book ID ${item.bookId}. Current stock: ${book.stockQuantity}`);
      }

      const subTotal = book.price * item.quantity;
      totalAmount += subTotal;

      await tx.book.update({
        where: { id: book.id },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      });

      transactionDetailsData.push({
        bookId: book.id,
        quantity: item.quantity,
        priceAtBuy: book.price,
      });
    }

    const transaction = await tx.transaction.create({
      data: {
        userId: userId,
        totalAmount: totalAmount,
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

export const getAllTransactionsByUserId = async (options: TransactionQueryOptions) => {
  const {
    page = 1,
    limit = 10,
    search,
    sortBy = 'createdAt',
    orderBy = 'desc',
    userId,
  } = options;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.TransactionWhereInput = {
    userId: userId,
  };
  if (search) {
    where.id = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const allowedSortFields = ['id', 'totalAmount', 'createdAt'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = orderBy.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const transactions = await prisma.transaction.findMany({
    where: where,
    skip: skip,
    take: limitNum,
    include: {
      user: { select: { username: true } },
      transactionItems: {
        include: { book: { select: { title: true } } },
      },
    },
    orderBy: {
      [sortField]: sortOrder,
    },
  });
  
  const totalTransactions = await prisma.transaction.count({ where: where });
  const totalPages = Math.ceil(totalTransactions / limitNum);

  return {
    data: transactions,
    meta: {
      currentPage: pageNum,
      totalPages: totalPages,
      totalItems: totalTransactions,
      limit: limitNum,
    },
  };
};

export const getTransactionById = async (transactionId: string, userId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId: userId,
    },
    include: {
      transactionItems: {
        include: {
          book: {
            select: { id: true, title: true },
          },
        },
      },
    },
  });

  if (!transaction) {
    throw new Error('Transaction not found or you do not have permission to view it.');
  }

  return transaction;
};

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