// src/modules/genre/genre.service.ts
import prisma from '../../prisma';

// Create
export const createGenre = async (name: string, description: string | undefined) => {
  // 'description' tidak ada di skema Anda, jadi saya hapus.
  // Jika Anda ingin 'description', tambahkan ke schema.prisma
  const genre = await prisma.genre.create({
    data: { name },
  });
  return genre;
};

// Get All
export const getAllGenres = async () => {
  const genres = await prisma.genre.findMany({
    where: { deletedAt: null }, // <-- BARU
  });
  return genres;
};

// Get By Id
export const getGenreById = async (id: string) => {
  const genre = await prisma.genre.findFirst({ // <-- BERUBAH
    where: { id: id, deletedAt: null }, // <-- BARU
  });
  if (!genre) { throw new Error('Genre not found'); }
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
  // 'onDelete: Restrict' di Book akan mencegah ini jika ada buku.
  // Tapi kita bisa coba soft delete.
  try {
    await prisma.genre.update({
      where: { id },
      data: { deletedAt: new Date() }, // <-- Logika soft delete
    });
  } catch (error: any) {
    // Tangani error jika 'Restrict' gagal
    if (error.code === 'P2014' || error.code === 'P2003') { 
      throw new Error('Cannot delete genre: It is still associated with active books.');
    }
    throw error;
  }
};