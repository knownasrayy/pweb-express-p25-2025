import prisma from '../../prisma';
import { Prisma } from '@prisma/client';


interface BookQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  genreId?: string;
  sortBy?: string;
  orderBy?: string;
  condition?: string;
}

export const createBook = async (data: any) => {
  const book = await prisma.book.create({
    data: {
      title: data.title,
      writer: data.writer,
      publisher: data.publisher,
      publicationYear: Number(data.publicationYear),
      description: data.description,
      stockQuantity: Number(data.stockQuantity) || 0,
      price: parseFloat(data.price) || 0,
      genreId: data.genreId,
      isbn: data.isbn,
      condition: data.condition,
      image_url: data.image_url,
    },
  });
  return book;
};

export const getAllBooks = async (options: BookQueryOptions) => {
  const {
    page = 1,
    limit = 10,
    search,
    genreId,
    sortBy = 'createdAt',
    orderBy = 'desc',
    condition,
  } = options;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: Prisma.BookWhereInput = {
    deletedAt: null,
  };
  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }
  if (genreId) {
    where.genreId = genreId;
  }
  if (condition) {
    where.condition = condition;
  }

  const allowedSortFields = ['title', 'publicationYear', 'price', 'createdAt', 'writer'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = orderBy.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const books = await prisma.book.findMany({
    where: where,
    skip: skip,
    take: limitNum,
    include: {
      genre: {
        select: { name: true },
      },
    },

    orderBy: {
      [sortField]: sortOrder,
    },

  });

  const totalBooks = await prisma.book.count({ where: where });
  const totalPages = Math.ceil(totalBooks / limitNum);

  return {
    message: 'Books fetched successfully', // <-- Tambahan
    data: books,
    meta: {
      currentPage: pageNum,
      totalPages: totalPages,
      totalItems: totalBooks,
      limit: limitNum,
    },
  };
};

export const getBookById = async (id: string) => {
  const book = await prisma.book.findFirst({
    where: { id: id, deletedAt: null },
    include: {
      genre: true,
    },
  });
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
};

export const updateBook = async (id: string, data: any) => {
  const existingBook = await prisma.book.findFirst({
    where: { id: id, deletedAt: null },
  });

  if (!existingBook) {
    throw new Error('Book not found');
  }


  const book = await prisma.book.update({
    where: { id },
    data: {
      title: data.title,
      writer: data.writer,
      publisher: data.publisher,
      publicationYear: data.publicationYear ? Number(data.publicationYear) : undefined,
      description: data.description,
      stockQuantity: data.stockQuantity !== undefined ? Number(data.stockQuantity) : undefined,
      price: data.price !== undefined ? parseFloat(data.price) : undefined,
      genreId: data.genreId,
      isbn: data.isbn,
      condition: data.condition,
      image_url: data.image_url,
    },
  });
  return book;
};


export const deleteBook = async (id: string) => {

  const existingBook = await prisma.book.findFirst({
    where: { id: id, deletedAt: null },
  });

  if (!existingBook) {
    throw new Error('Book not found or already deleted');
  }

  await prisma.book.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};