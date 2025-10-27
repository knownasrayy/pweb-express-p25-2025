import { Request, Response, NextFunction } from 'express';
import * as bookService from './book.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, writer, price, stockQuantity, genreId, publicationYear, publisher } = req.body;
    const errors = [];


    if (!title) errors.push('title is required');
    if (!writer) errors.push('writer is required');
    if (!publisher) errors.push('publisher is required');
    if (!genreId) errors.push('genreId is required');


    if (price === undefined) {
      errors.push('price is required');
    } else if (typeof price !== 'number' || price < 0) {
      errors.push('price must be a non-negative number');
    }


    if (stockQuantity === undefined) {
      errors.push('stockQuantity is required');
    } else if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      errors.push('stockQuantity must be a non-negative integer');
    }


    const currentYear = new Date().getFullYear();
    if (publicationYear === undefined) {
      errors.push('publicationYear is required');
    } else if (!Number.isInteger(publicationYear) || publicationYear < 1000 || publicationYear > currentYear) {
      errors.push(`publicationYear must be a valid integer, not exceeding ${currentYear}`);
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const book = await bookService.createBook(req.body);
    res.status(201).json({ message: 'Book created successfully', data: book });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, search, sortBy, orderBy } = req.query;
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: String(search || ''),
      sortBy: String(sortBy || 'createdAt'),
      orderBy: String(orderBy || 'desc'),
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
    const { page, limit, search, sortBy, orderBy } = req.query;
    const options = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search: String(search || ''),
      sortBy: String(sortBy || 'createdAt'),
      orderBy: String(orderBy || 'desc'),
      genreId: genre_id,
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
    
    const { stockQuantity, price, publicationYear } = req.body;
    const errors = [];

    if (stockQuantity !== undefined) {
      if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
        errors.push('stockQuantity must be a non-negative integer');
      }
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      errors.push('price must be a non-negative number');
    }
    if (publicationYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(publicationYear) || publicationYear < 1000 || publicationYear > currentYear) {
        errors.push(`publicationYear must be a valid integer, not exceeding ${currentYear}`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

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