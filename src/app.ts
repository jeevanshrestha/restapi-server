import express, { NextFunction, Request, Response } from 'express';
import createHttpError, { HttpError } from 'http-errors'; 
import globalErrorHandler from './middlewares/globalErrorHandler';
import morgan from "morgan";
  
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
import fs from 'fs';
import path from 'path';

    const app = express();
    //First Global middleware to parse Request body as json
    app.use(express.json());

    app.use(morgan('dev', {
            skip: function (req : Request, res : Response) { return res.statusCode < 400 }
        }))
        
        // log all requests to access.log
        app.use(morgan('common', {
            stream: fs.createWriteStream(path.join( 'logs','access.log'), { flags: 'a' })
        }))

    // Routes
    app.get('/', (req : Request, res : Response, next: NextFunction) => {
            const error: HttpError = createHttpError(400, 'Something went wrong.');
            next(error);
        next(error);
    });

    app.use("/api/users",userRouter);
    app.use("/api/books", bookRouter);

    // Global error handler
    app.use(globalErrorHandler);

    export default app;
