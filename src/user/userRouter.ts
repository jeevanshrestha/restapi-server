import express, { Router } from "express";

import { createUser } from "./userController";
import { validateUserRegiistration } from "../middlewares/validateUserRegistration"; 


const userRouter = express.Router();

userRouter.post('/register', validateUserRegiistration, createUser);

export default userRouter;