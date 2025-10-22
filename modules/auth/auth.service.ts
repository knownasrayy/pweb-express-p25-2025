// src/modules/auth/auth.service.ts
import prisma from '../../prisma';
import { hashPassword, comparePassword } from '../../utils/password.utils';
import { generateToken } from '../../utils/jwt.utils';

// Logika untuk Register
export const registerUser = async (userData: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      username: userData.username, // <-- BERUBAH
      email: userData.email,
      password: hashedPassword,
    },
    select: { id: true, username: true, email: true }, // <-- BERUBAH
  });

  return user;
};

// Logika untuk Login
export const loginUser = async (loginData: any) => {
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
  });
  if (!user) { throw new Error('Invalid email or password'); }

  const isPasswordValid = await comparePassword(loginData.password, user.password);
  if (!isPasswordValid) { throw new Error('Invalid email or password'); }

  const token = generateToken({ id: user.id, email: user.email });
  return { token };
};

// Logika untuk Get Me
export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, createdAt: true }, // <-- BERUBAH
  });
  if (!user) { throw new Error('User not found'); }
  return user;
};