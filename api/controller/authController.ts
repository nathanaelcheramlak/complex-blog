import { Request, RequestHandler, Response } from 'express';

export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Login' });
};

export const register: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Register' });
};

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Forgot Password' });
};

export const logout: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Logout' });
};

export const me: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Me' });
};
