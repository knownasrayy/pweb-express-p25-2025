// src/modules/book/book.service.ts
import prisma from '../../prisma';
import { Prisma } from '@prisma/client';

// Interface untuk filter
interface BookQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  genreId?: string;
}

// Create
export const createBook = async (data: any) => {
  // @unique('title') di schema.prisma akan menangani error duplikat
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
    },
  });
  return book;
};

// Get All (dengan Filter & Pagination)
export const getAllBooks = async (options: BookQueryOptions) => {
  const { page = 1, limit = 10, search, genreId } = options;

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // 1. Buat kondisi 'where'
  const where: Prisma.BookWhereInput = {
    deletedAt: null, // <-- Penting: Hanya ambil yang tidak di-soft-delete
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

  // 2. Ambil data buku
  const books = await prisma.book.findMany({
    where: where,
    skip: skip,
    take: limitNum,
    include: {
      genre: {
        select: { name: true }, // Ambil nama genre
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // 3. Ambil total data
  const totalBooks = await prisma.book.count({ where: where });
  const totalPages = Math.ceil(totalBooks / limitNum);

  return {
    data: books,
    meta: {
      currentPage: pageNum,
      totalPages: totalPages,
      totalItems: totalBooks,
      limit: limitNum,
    },
  };
};

// Get By Id
export const getBookById = async (id: string) => {
  const book = await prisma.book.findFirst({
    where: { id: id, deletedAt: null }, // <-- Penting
    include: {
      genre: true,
    },
  });
  if (!book) {
    throw new Error('Book not found');
  }
  return book;
};

// Update
export const updateBook = async (id: string, data: any) => {
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
    },
  });
  return book;
};

// Delete (Soft Delete)
export const deleteBook = async (id: string) => {
  // Kita update 'deletedAt' daripada benar-benar menghapus
  await prisma.book.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};  