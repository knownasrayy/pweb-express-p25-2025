// src/modules/genre/genre.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as genreService from './genre.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body; // Hanya ambil 'name'
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const genre = await genreService.createGenre(name);
    res.status(201).json({ message: 'Genre created successfully', data: genre });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const genres = await genreService.getAllGenres();
    res.status(200).json({ message: 'Genres fetched successfully', data: genres });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genre_id } = req.params;
    const genre = await genreService.getGenreById(genre_id);
    res.status(200).json({ message: 'Genre fetched successfully', data: genre });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genre_id } = req.params;
    const { name } = req.body;
    const genre = await genreService.updateGenre(genre_id, { name });
    res.status(200).json({ message: 'Genre updated successfully', data: genre });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { genre_id } = req.params;
    await genreService.deleteGenre(genre_id);
    res.status(200).json({ message: 'Genre deleted successfully' });
  } catch (error) {
    next(error);
  }
};