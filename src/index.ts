// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// File-file ini akan kita buat setelah ini
import mainRouter from './modules/routes';
import { globalErrorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to IT Literature Shop API!',
  });
});

// Baris ini akan error sampai kita membuat file './modules/routes'
app.use('/', mainRouter);

// Baris ini akan error sampai kita membuat file './middlewares/error.middleware'
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});