
 
import createHttpError from "http-errors"; 
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { User } from "./userTypes";
import { sign } from "jsonwebtoken";
import { config } from "../config/config"; 

export const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {

     const error = createHttpError(400,  errors )
     return next(error);
  }
  const { name, email, password } = request.body;


  //check if email exist in database
  //call database
try {
      const user = await userModel.findOne({email}) as User

      if(user)
        {
            const error = createHttpError(400, "User already exist with the email.")
            return next(error);
        }

} catch (error:any) {
     
    
    return next(createHttpError(500, "Error which checking user email."));
} 

    // TODO: Add your business logic here
    //hash the password
    const hashed_password = await bcrypt.hash(password, 10)
    let newUser : User;
    try {
            newUser=  await userModel.create({
                name,
                email,
                password:hashed_password
            })
            
    } catch (error:any) {
        return next(createHttpError(500, "Error while creating user."));
    }
            
    // Token generation
        
    const token = sign(
            { sub: newUser._id },
            config.jwtSecret as string,
            { expiresIn: '7d' }
        );
    response.json({accessToken:token})
};


export const loginUser = async (request: Request ,response: Response, next : NextFunction) => {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
  
       const error = createHttpError(400,  JSON.stringify(errors.array()) )
       return next(error);
    }
    const {  email, password } = request.body; 

    let user : User;
    try {
        user = await userModel.findOne({ email }) as User;

        if (!user) {
            const error = createHttpError(404, "User not found.");
            return next(error);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            const error = createHttpError(401, "Username or password incorrect.");
            return next(error);
        }

    } catch (error) {
        return next(createHttpError(500, "Error while user login."));
    }
    //Token Generation
      const token = sign(
        { sub: user._id },
        config.jwtSecret as string,
        { expiresIn: '7d' }
      );
      

    response.json({accessToken:token})

}