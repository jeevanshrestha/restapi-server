import express, { Router } from "express";

import { createUser, loginUser } from "./userController";
import { validateUserRegiistration } from "../middlewares/validateUserRegistration"; 
import { validateLogin } from "../middlewares/validateLogin";

const userRouter = express.Router();

userRouter.post('/register', validateUserRegiistration, createUser);

userRouter.post('/login', validateLogin, loginUser);
export default userRouter;