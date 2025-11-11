import prisma from '../../prisma';

export const getDashboardStats = async () => {
  const totalBooks = await prisma.book.count({
    where: { deletedAt: null },
  });

  const totalGenres = await prisma.genre.count({
    where: { deletedAt: null },
  });

  const totalTransactions = await prisma.transaction.count();

  return { totalBooks, totalGenres, totalTransactions };
};