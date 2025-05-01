import { body } from 'express-validator';

export const validateBook = [
  body('title').trim()
    .notEmpty().withMessage('Title is required'),

  body('author').trim()
    .notEmpty().withMessage('Author is required'),

    body('coverImage').trim()
    .notEmpty().withMessage('coverImage is required'),

    body('file').trim()
    .notEmpty().withMessage('File is required') ,

    body('genre').trim()
    .notEmpty().withMessage('Genre is required'),


];

