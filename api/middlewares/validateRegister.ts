import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { CreateUserDTO } from '../dtos/CreateUser.dto';

export const registerValidateMiddleware = async (
  req: Request<{}, {}, CreateUserDTO>,
  res: Response,
  next: NextFunction,
) => {
  // Validation
  body('fullname').notEmpty().withMessage('Fullname is required');
  body('email').trim().isEmail().withMessage('Invalid email');
  body('username').notEmpty().withMessage('Username is required');
  body('password')
    .isLength({ min: 6 })
    .isStrongPassword()
    .withMessage('Password must be 6 characters or more');
  body('dateOfBirth').isDate().withMessage('Invalid date of birth');

  next();
};
