import { body } from 'express-validator';

export const validateRegister = [
  // Validation
  body('fullname').notEmpty().withMessage('Fullname is required'),
  body('email').trim().isEmail().withMessage('Invalid email'),
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  body('dateOfBirth').isDate().withMessage('Invalid date of birth'),
];

export const validateLogin = [
  // Custom validation for email or username (at least one must be provided)
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format')
    .custom((value, { req }) => {
      // If neither email nor username is provided, throw an error
      if (!value && !req.body.username) {
        throw new Error('Email or username is required');
      }
      return true;
    }),

  body('username')
    .optional()
    .notEmpty()
    .withMessage('Username cannot be empty')
    .custom((value, { req }) => {
      // If neither username nor email is provided, throw an error
      if (!value && !req.body.email) {
        throw new Error('Email or username is required');
      }
      return true;
    }),

  // Validate password (must be provided)
  body('password').notEmpty().withMessage('Password is required'),
];

export const validateForgotPassword = [
  body('email').isEmail().withMessage('Invalid email'),
];

export const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more'),
  body('token').notEmpty().withMessage('Token is required'),
];
