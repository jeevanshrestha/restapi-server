
import { NextFunction, Request, Response } from "express";


const createUser = async (request : Request, response: Response, next: NextFunction) => {

    response.status(200).json({message:"User Created Successfully."})

};

export {createUser}