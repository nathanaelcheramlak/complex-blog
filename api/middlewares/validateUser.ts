import { body } from 'express-validator';

export const validateEditProfile = [
  body('fullname')
    .optional()
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Fullname cannot be more than 50 characters'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Bio must be at most 300 characters'),

  body('profilePicture')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid profile picture URL'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Invalid date of birth'),
];
