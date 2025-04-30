import { config } from "../config/config";
import createHttpError, { HttpError } from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import { errorlogger } from "../config/logger";


const globalErrorHandler =  (err: HttpError, req: Request, res: Response, next: NextFunction) => {
    let message =""
     try{
        message = JSON.parse(err.message)
     }
     catch(e)
     {
        message = err.message;
     }
    errorlogger.error(err.message, { stack: err.stack });
    const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            message: message ,
            errorStack: config.env === 'development' ? err.stack : '',
        });
    } ;
  
export default globalErrorHandler;