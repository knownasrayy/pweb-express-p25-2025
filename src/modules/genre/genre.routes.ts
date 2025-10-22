// src/modules/genre/genre.routes.ts
import { Router } from 'express';
import * as genreController from './genre.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Endpoint untuk 'Get All' dan 'Get Detail' bisa jadi publik
router.get('/', genreController.getAll);
router.get('/:genre_id', genreController.getById);

// Endpoint untuk Create, Update, Delete harus dilindungi
router.post('/', authMiddleware, genreController.create); // <-- INI YANG ANDA BUTUHKAN
router.patch('/:genre_id', authMiddleware, genreController.update);
router.delete('/:genre_id', authMiddleware, genreController.remove);

export default router;