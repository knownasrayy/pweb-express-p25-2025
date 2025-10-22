// src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

// extend Request type untuk menyertakan 'user' dari middleware
interface AuthenticatedRequest extends Request {
  user?: any;
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validasi body (bisa ditambah library seperti Zod/Joi)
    // --- REVISI DI BAWAH INI ---
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
    // --- REVISI DI ATAS INI ---
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await authService.registerUser(req.body);
    res.status(201).json({ message: 'User registered successfully', data: user });
  } catch (error) {
    next(error); // Lempar error ke global error handler
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { token } = await authService.loginUser(req.body);
    res.status(200).json({ message: 'Login successful', accessToken: token });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // req.user didapat dari authMiddleware
    const userId = req.user.id;
    const user = await authService.getProfile(userId);
    res.status(200).json({ message: 'Profile fetched successfully', data: user });
  } catch (error) {
    next(error);
  }
};