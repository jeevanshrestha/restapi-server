import express, { Router } from "express";

import { create, index, show,   edit, update, remove } from "./bookController";
import { validateUserRegiistration } from "../middlewares/validateUserRegistration"; 
import { validateLogin } from "../middlewares/validateLogin";

const bookRouter = express.Router();

bookRouter.post('/create', validateBook, create);
bookRouter.post('/update', validateBook, update);
export default bookRouter;