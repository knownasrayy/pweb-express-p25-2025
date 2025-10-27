import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = err.meta?.target as string[];
      return res.status(409).json({
        status: 'fail',
        message: `Duplicate field value: ${target?.join(', ')} already exists.`,
      });
    }

    if (err.code === 'P2003') {
      const fieldName = err.meta?.field_name as string;
      return res.status(400).json({
        status: 'fail',
        message: `Foreign key constraint failed on field: ${fieldName}. The related record does not exist.`,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'fail',
        message: err.meta?.cause || 'Record not found',
      });
    }
  }

  if (err.message.includes('Invalid email or password') || err.message.includes('User not found')) {
    return res.status(401).json({ status: 'fail', message: err.message });
  }

  if (err.message.toLowerCase().includes('not found')) {
    return res.status(404).json({ status: 'fail', message: err.message });
  }

  if (err.message.toLowerCase().includes('cannot delete')) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }

  if (err.message.includes('stock')) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }


  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};