import { Router } from 'express';
import authRouter from './auth/auth.routes';
import bookRouter from './book/book.routes';
import genreRouter from './genre/genre.routes';
import transactionRouter from './transaction/transaction.routes';
import statsRouter from './stats/stats.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/books', bookRouter);
router.use('/genre', genreRouter);
router.use('/transactions', transactionRouter);
router.use('/stats', statsRouter);

export default router;