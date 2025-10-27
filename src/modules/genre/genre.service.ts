import prisma from '../../prisma';

export const createGenre = async (name: string) => {
  const genre = await prisma.genre.create({
    data: { name },
  });
  return genre;
};

export const getAllGenres = async () => {
  const genres = await prisma.genre.findMany({
    where: { deletedAt: null },
  });
  return genres;
};

export const getGenreById = async (id: string) => {
  const genre = await prisma.genre.findFirst({
    where: { id: id, deletedAt: null },
  });
  if (!genre) {
    throw new Error('Genre not found');
  }
  return genre;
};

export const updateGenre = async (id: string, data: { name?: string }) => {
  const existingGenre = await prisma.genre.findFirst({
    where: { id: id, deletedAt: null },
  });

  if (!existingGenre) {
    throw new Error('Genre not found');
  }

  const genre = await prisma.genre.update({
    where: { id },
    data: data,
  });
  return genre;
};

export const deleteGenre = async (id: string) => {
  const existingGenre = await prisma.genre.findFirst({
    where: { id: id, deletedAt: null },
  });

  if (!existingGenre) {
    throw new Error('Genre not found or already deleted');
  }


  try {

    await prisma.genre.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  } catch (error: any) {

    if (error.code === 'P2014' || error.code === 'P2003') {
      throw new Error('Cannot delete genre: It is still associated with active books.');
    }
    throw error;
  }
};