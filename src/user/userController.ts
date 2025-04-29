
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";


const createUser = async (request : Request, response: Response, next: NextFunction) => {

    //Retrieve data
    const {name, email, password} = request.body;
    //validation

    if(!name || !email || !password){

        const error = createHttpError(400, "All fields are required")
        return next(error);
    }


    //Process - business logic

    //Response
    response.status(200).json({message:"User Created Successfully."})

};

export {createUser}