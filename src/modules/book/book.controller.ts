// src/modules/book/book.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as bookService from './book.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validasi dasar
    const { title, writer, price, stockQuantity, genreId } = req.body;
    if (!title || !writer || !price || stockQuantity === undefined || !genreId) {
      return res.status(400).json({ message: 'Title, writer, price, stockQuantity, and genreId are required' });
    }
    const book = await bookService.createBook(req.body);
    res.status(201).json({ message: 'Book created successfully', data: book });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search } = req.query;
    const options = {
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
      search: String(search || ''),
    };
    const result = await bookService.getAllBooks(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params;
    const book = await bookService.getBookById(book_id);
    res.status(200).json({ message: 'Book fetched successfully', data: book });
  } catch (error) {
    next(error);
  }
};

export const getByGenre = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genre_id } = req.params;
    const { page, limit, search } = req.query;
    const options = {
      page: Number(page) || undefined,
      limit: Number(limit) || undefined,
      search: String(search || ''),
      genreId: genre_id, // <-- Ini pembedanya
    };
    const result = await bookService.getAllBooks(options);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params;
    const book = await bookService.updateBook(book_id, req.body);
    res.status(200).json({ message: 'Book updated successfully', data: book });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { book_id } = req.params;
    await bookService.deleteBook(book_id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};