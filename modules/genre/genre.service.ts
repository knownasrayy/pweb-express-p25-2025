// src/modules/genre/genre.service.ts
import prisma from '../../prisma';

// Create
export const createGenre = async (name: string) => {
  // 'name' @unique di Prisma akan menangani error duplikat
  const genre = await prisma.genre.create({
    data: { name },
  });
  return genre;
};

// Get All
export const getAllGenres = async () => {
  const genres = await prisma.genre.findMany({
    where: { deletedAt: null }, // Hanya ambil yang tidak di-soft delete
  });
  return genres;
};

// Get By Id
export const getGenreById = async (id: string) => {
  const genre = await prisma.genre.findFirst({
    where: { id: id, deletedAt: null },
  });
  if (!genre) {
    throw new Error('Genre not found');
  }
  return genre;
};

// Update
export const updateGenre = async (id: string, data: { name?: string }) => {
  const genre = await prisma.genre.update({
    where: { id },
    data: data,
  });
  return genre;
};

// Delete (Soft Delete)
export const deleteGenre = async (id: string) => {
  try {
    // Kita update 'deletedAt' daripada menghapus
    await prisma.genre.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error: any) {
    // 'onDelete: Restrict' di Book akan error jika masih ada buku
    if (error.code === 'P2014' || error.code === 'P2003') {
      throw new Error('Cannot delete genre: It is still associated with active books.');
    }
    throw error;
  }
};