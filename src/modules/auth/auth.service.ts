import prisma from '../../prisma';
import { hashPassword, comparePassword } from '../../utils/password.utils';
import { generateToken } from '../../utils/jwt.utils';

export const registerUser = async (userData: any) => {

  const hashedPassword = await hashPassword(userData.password);

  const user = await prisma.user.create({
    data: {
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    },
    select: { id: true, username: true, email: true },
  });

  return user;
};

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

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, createdAt: true },
  });
  if (!user) { throw new Error('User not found'); }
  return user;
};