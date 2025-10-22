// src/modules/book/book.routes.ts
import { Router } from 'express';
import * as bookController from './book.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Endpoint publik
router.get('/', bookController.getAll);
router.get('/genre/:genre_id', bookController.getByGenre);
router.get('/:book_id', bookController.getById);

// Endpoint terproteksi (asumsi hanya user terdaftar/admin)
router.post('/', authMiddleware, bookController.create); // <-- INI YANG ANDA BUTUHKAN
router.patch('/:book_id', authMiddleware, bookController.update);
router.delete('/:book_id', authMiddleware, bookController.remove);

export default router;