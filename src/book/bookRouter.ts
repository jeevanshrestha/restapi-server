import express, { Router } from "express";

import { createBook, getAllBooks , getBookById , updateBook, deleteBook} from "./bookController";
import { validateUserRegiistration } from "../middlewares/validations/validateUserRegistration"; 
import { validateBook } from "../middlewares/validations/validateBook";
import multer from "multer";
import path from "node:path";


const upload = multer({
    dest: path.resolve(__dirname, '../../public/data/uploads'),
    limits:{fileSize: 1e7} // 10mb 30 * 1024 * 1024
});

const bookRouter = express.Router();

bookRouter.post('/', validateBook ,upload.fields([
    {name:'coverImage', maxCount:1},
    {name:'file', maxCount:1},
]),createBook);

bookRouter.get('/',validateBook, getAllBooks);

bookRouter.get('/:id', getBookById);

bookRouter.put('/:id', upload.fields([
    {name:'coverImage', maxCount:1},
    {name:'file', maxCount:1},
]),updateBook);

bookRouter.delete('/:id', deleteBook);

export default bookRouter;