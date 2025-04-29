import { config } from "../config/config";
import createHttpError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';

const globalErrorHandler =  (err: HttpError, req: Request, res: Response, next: NextFunction) => {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            message: err.message,
            errorStack: config.env === 'development' ? err.stack : '',
        });
    } ;

  
export default globalErrorHandler;