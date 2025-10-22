// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

// Pastikan Anda 'export' fungsi ini
export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log error untuk debugging

  // Handle Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation (e.g., duplicate email or book title)
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'fail',
        message: `Duplicate field value`,
      });
    }
    // Record to update/delete not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: 'Record not found',
      });
    }
  }

  // Handle Error custom dari service (misal: "Stok habis")
  if (err.message.includes('Invalid email or password') || err.message.includes('User not found')) {
    return res.status(401).json({ status: 'fail', message: err.message });
  }

  if (err.message.includes('stock')) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  // Default server error
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};