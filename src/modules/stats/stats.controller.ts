import { Request, Response, NextFunction } from 'express';
import * as statsService from './stats.service';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.status(200).json({ message: 'Stats fetched successfully', data: stats });
  } catch (error) {
    next(error);
  }
};