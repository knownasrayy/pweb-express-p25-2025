// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils'; // Import helper JWT Anda

// Tambahkan interface untuk request yang sudah terotentikasi
export interface AuthenticatedRequest extends Request {
  user?: any; // Objek payload dari JWT
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }

  req.user = decoded; // Lampirkan payload (misal: { id: '...' }) ke object request
  next();
};