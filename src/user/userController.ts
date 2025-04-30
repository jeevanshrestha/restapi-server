
 
import createHttpError from "http-errors"; 
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { error } from "console";

export const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {

     const error = createHttpError(400,  JSON.stringify(errors.array()))
     return next(error);
  }

  const { name, email, password } = request.body;

  // TODO: Add your business logic here

  response.status(200).json({ message: "User Created Successfully." });
};
