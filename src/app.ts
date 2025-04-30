import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors'; 
import globalErrorHandler from './middlewares/globalErrorHandler';

import userRouter from './user/userRouter';

const app = express();
//First Global middleware to parse Request body as json
app.use(express.json());


// Routes
app.get('/', (req : Request, res : Response, next: NextFunction) => {
    const error: HttpError = createHttpError(400, 'Something went wrong.');
    next(error);
});

app.use("/api/users",userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
