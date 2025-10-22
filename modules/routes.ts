// src/modules/routes.ts
import { Router } from 'express';
import authRouter from './auth/auth.routes';
import bookRouter from './book/book.routes';
import genreRouter from './genre/genre.routes';
import transactionRouter from './transaction/transaction.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/books', bookRouter);
router.use('/genre', genreRouter);
router.use('/transactions', transactionRouter);

export default router;