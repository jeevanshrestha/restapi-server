import { Express } from "express";
import { Request, Response, NextFunction } from "express";
import Book from "./bookModel";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import fs from "node:fs"; 

export const  createBook =async (req : Request, res: Response, next: NextFunction) => {
    console.log('files', req.files)

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } & { coverImage?: Express.Multer.File[] };

    //Handle Cover Image
    const coverImage = files.coverImage as Express.Multer.File[] | undefined;
    const converImageMimeType = coverImage?.[0]?.mimetype?.split("/").at(-1);
    const coverImage_filename  = coverImage?.[0].filename;
    if (!coverImage_filename) {
        throw new Error("Filename is undefined");
    }
    const coverImage_filepath = path.resolve(__dirname, '../../public/data/uploads', coverImage_filename);
 
        const uploadResult =  await  cloudinary.uploader
        .upload(coverImage_filepath, {
            filename_override: coverImage_filename ,
            folder: 'book-covers',
            format: converImageMimeType,
        })
        .catch((err)=>{ 
            const error = createHttpError(400, "File upload failed.", err )
            return next(error);
        });

        // console.log(uploadResult)
        

    //Handle PDF File
            
    const pdfFile = files.file as Express.Multer.File[] | undefined;
    const pdfFile_mimeType = pdfFile?.[0]?.mimetype?.split("/").at(-1);
    const pdfFile_filename  = pdfFile?.[0].filename;
    if (!pdfFile_filename) {
        throw new Error("Filename is undefined");
    }
    const pdfFile_filepath = path.resolve(__dirname, '../../public/data/uploads', pdfFile_filename);
 
        const fileUploadResult =  await cloudinary.uploader
        .upload(pdfFile_filepath, {
            resource_type:'raw',
            filename_override: pdfFile_filename ,
            folder: 'book-pdfs',
            format: pdfFile_mimeType,
        })
        .catch((err:any)=>{ 
            const error = createHttpError(400, "File upload failed.", err )
            return next(error);
        
        })

        // console.log(fileUploadResult) 

        const newBook = await Book.create({
            'title':req.body.title,
            'author':'6811a6b07909b1dad6eb5654',
            'coverImage':uploadResult?.secure_url,
            'file':fileUploadResult?.secure_url,
             'genre':req.body.genre,
        })

        try{
            await fs.promises.unlink(coverImage_filepath);
            await fs.promises.unlink(pdfFile_filepath);

        }catch(err:any)
        { 
            const error = createHttpError(500, "Temporary file delete failed.", err )
            return next(error);
        }

        res.status(200).json({id:newBook.id})
 

   }

export const getAllBooks = async (req : Request, res: Response, next: NextFunction) => {
 
   try{
    const books =  await  Book.find(); 
    res.status(200).json(books)

   } catch(err:any){
    const error = createHttpError(500, "Error fetching books.", err )
    return next(error);
   }

} 
export const getBookById =async (req : Request, res: Response, next: NextFunction) => {
    const { id } = req.params;;
    try{
        const book =  await  Book.findById(id);
        if(!book){

            const error = createHttpError(404, "Book not found."  );
            return next(error);
        }
        res.status(200).json(book)
    
       } catch(err:any){
        const error = createHttpError(500, "Error fetching book.", err )
        return next(error);
       }


} 
export const updateBook =(req : Request, res: Response, next: NextFunction) => {


} 
export const deleteBook =(req : Request, res: Response, next: NextFunction) => {
    //
    const {} = req.body();

} 