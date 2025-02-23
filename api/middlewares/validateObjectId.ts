import { param } from 'express-validator';

export const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid ID'),
];
