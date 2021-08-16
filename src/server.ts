import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import { router as userRouter } from './routes';

const app = express();
const PORT = 8080;

// MIDDLEWARES
app.use(express.json());

// Adding our custom routes to the app
app.use(userRouter);

// Last middleware to capture internal errors
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    return response.json({
      status: 500,
      message: 'Internal Server error',
    });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
