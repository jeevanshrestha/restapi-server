import { body } from 'express-validator';

export const validateBookEdit = [
  body('title').trim()
    .notEmpty().withMessage('Title is required'),
    body('genre').trim()
    .notEmpty().withMessage('Genre is required'),


];

