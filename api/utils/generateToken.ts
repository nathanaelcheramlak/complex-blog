import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserPayload } from '../types/UserPayloads';

dotenv.config();

// Handles only token generation
export const generateToken = (user: UserPayload): string => {
  return jwt.sign(user, process.env.JWT_SECRET as string, {
    expiresIn: '7d',
  });
};
