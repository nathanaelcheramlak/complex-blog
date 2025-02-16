import { Response } from 'express';
import { generateToken } from './generateToken';
import { UserPayload } from '../types/UserPayloads';

const maxAge = 7 * 24 * 60 * 60 * 1000;
const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as 'strict',
  secure: process.env.NODE_ENV === 'production',
  maxAge,
};

export const setAuthCookie = (res: Response, user: UserPayload): void => {
  const token = generateToken(user);
  res.cookie('auth_token', token, cookieOptions);
};

export const clearAuthToken = (res: Response): void => {
  res.clearCookie('auth_token', { ...cookieOptions, maxAge: 0 });
};
