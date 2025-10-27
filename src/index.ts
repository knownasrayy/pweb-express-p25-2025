import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import mainRouter from './modules/routes';
import { globalErrorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to IT Literature Shop API!',
  });
});


app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/', mainRouter);


app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});