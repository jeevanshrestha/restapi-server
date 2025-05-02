import { Express } from "express";
import { Request, Response, NextFunction } from "express";
import Book from "./bookModel";
import path from "node:path";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import fs from "node:fs"; 
import { AuthRequest } from "../middlewares/authenticate";
import mongoose from "mongoose";
import bookModel from "./bookModel";



export const  createBook =async (req : Request, res: Response, next: NextFunction) => {
 
    const _req = req as AuthRequest;
    console.log('userId', _req.userId);

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
        .catch((err:any)=>{ 
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
            access_mode: "public",
            filename_override: pdfFile_filename ,
            folder: 'book-pdfs',
            format: pdfFile_mimeType,
        })
        .catch((err:any)=>{ 
            const error = createHttpError(400, "File upload failed.", err )
            return next(error);
        
        })

        // console.log(fileUploadResult) 

        try{
            const newBook = await Book.create({
                'title':req.body.title,
                'author': _req.userId,
                'coverImage':uploadResult.secure_url,
                'file':fileUploadResult.secure_url,
                 'genre':req.body.genre,
            })

            await fs.promises.unlink(coverImage_filepath);
            await fs.promises.unlink(pdfFile_filepath);

            
            res.status(200).json({id:newBook.id})

        }catch(err:any)
        { 
            const error = createHttpError(500, "Temporary file delete failed.", err )
            return next(error);
        }

   }


export const getAllBooks = async (req : Request, res: Response, next: NextFunction) => {

 
    const _req = req as AuthRequest;
    console.log('userId', _req.userId);
 
   try{
    //add pagination
    const books =  await  Book.find(); 
    res.status(200).json(books)

   } catch(err:any){
    const error = createHttpError(500, "Error fetching books.", err )
    return next(error);
   }

} 
export const getBookById =async (req : Request, res: Response, next: NextFunction) => {
    const bookId = req.params.id.trim()
    try{
        const book =  await  Book.findOne({_id:bookId});
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
export const updateBook =async (req : Request, res: Response, next: NextFunction) => {

    const _req = req as AuthRequest;
    console.log('userId', _req.userId);
    const bookId = req.params.id.trim()
    let book;
    try{
         book =  await  Book.findOne({_id:bookId});
            if(!book){

                const error = createHttpError(404, "Book not found."  );
                return next(error);
            }

            //check acess
            if(book.author.toString() !== _req.userId) {

                return next(createHttpError(403, "User not authorized to update book."));

            }        
        } catch (err: any) {
          
           return next(createHttpError(500, "Error occurred while updating book.", err));

        }


       let uploadResult ;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } & { coverImage?: Express.Multer.File[] };
        if(files.coverImage){
            //Handle Cover Image
            const coverImage = files.coverImage as Express.Multer.File[] | undefined;
    
            const converImageMimeType = coverImage?.[0]?.mimetype?.split("/").at(-1);
            const coverImage_filename  = coverImage?.[0].filename;
            if (!coverImage_filename) {
                throw new Error("Filename is undefined");
            }
            const coverImage_filepath = path.resolve(__dirname, '../../public/data/uploads', coverImage_filename);
    
                uploadResult =  await  cloudinary.uploader
                .upload(coverImage_filepath, {
                    filename_override: coverImage_filename ,
                    folder: 'book-covers',
                    format: converImageMimeType,
                })
                .catch((err:any)=>{ 
                    const error = createHttpError(400, "File upload failed.", err )
                    return next(error);
                });
    
        }

        let fileUploadResult  ;
        //Handle PDF File
        if( files.file){     
           const pdfFile = files.file as Express.Multer.File[] | undefined;
      
            const pdfFile_mimeType = pdfFile?.[0]?.mimetype?.split("/").at(-1);
            const pdfFile_filename  = pdfFile?.[0].filename;
            if (!pdfFile_filename) {
                throw new Error("Filename is undefined");
            }
            const pdfFile_filepath = path.resolve(__dirname, '../../public/data/uploads', pdfFile_filename);
    
                fileUploadResult =  await cloudinary.uploader
                .upload(pdfFile_filepath, {
                    access_mode: "public",
                    filename_override: pdfFile_filename ,
                    folder: 'book-pdfs',
                    format: pdfFile_mimeType,
                })
                .catch((err:any)=>{ 
                    const error = createHttpError(400, "File upload failed.", err )
                    return next(error);
                
                })
            }

    try {
        const updatedBook = await Book.findOneAndUpdate({ _id: bookId }, {
            title: req.body.title,
            genre: req.body.genre,
            'coverImage': files.coverImage ? uploadResult.secure_url : book.coverImage,
            'file': files.file ? fileUploadResult.secure_url : book.file,
        });

        res.json(updatedBook);
    } catch (err: any) {
        const error = createHttpError(500, "Error occurred while updating book.", err);
        return next(error);
    }

} 
export const deleteBook =async (req : Request, res: Response, next: NextFunction) => {

    const _req = req as AuthRequest;
    const bookId = req.params.id.trim()
    try{
        const book =  await  Book.findOne({_id:bookId});
        if(!book){

            const error = createHttpError(404, "Book not found."  );
            return next(error);
        }

        //check acess
        if(book.author.toString() !== _req.userId) {

            return next(createHttpError(403, "User not authorized to update book."));

        }

        //delete files 

        const coverImageSplits = book.coverImage?.split('/');
        const coverImagePublicId = coverImageSplits?.at(-2)+'/'+ coverImageSplits?.at(-1)?.split('.').at(-2);
        console.log(coverImageSplits.at(-2))

        const bookFileSplits = book.file?.split('/');
        const bookFilePublicId = bookFileSplits?.at(-2)+'/'+ bookFileSplits?.at(-1);
        console.log(bookFilePublicId.at(-2))

        await cloudinary.uploader.destroy(coverImagePublicId);
        await cloudinary.uploader.destroy(bookFilePublicId);

        await bookModel.deleteOne({_id: bookId});

        res.status(204).json({message:"Book deleted"})
       } catch(err:any){
        const error = createHttpError(500, "Error deleting book.", err )
        return next(error);
       }

} 