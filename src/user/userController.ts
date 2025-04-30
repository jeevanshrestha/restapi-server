
 
import createHttpError from "http-errors"; 
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { error } from "console";
import userModel from "./userModel";
import bcrypt from "bcrypt";

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


  //check if email exist in database
  //call database
  const user = await userModel.findOne({email})

  if(user)
    {
        const error = createHttpError(400, "User already exist with the email.")
        return next(error);
    }
  // TODO: Add your business logic here
  //hash the password
  const hashed_password = await bcrypt.hash(password, 10)

  response.status(200).json({ message: "User Created Successfully." });
};
