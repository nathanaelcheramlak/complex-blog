import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/UserPayloads';

// Extend the Request interface to include user data
interface CustomRequest extends Request {
  user?: UserPayload;
}

export const authenticateJWT = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Get the token from the Authorization header (Bearer <token>)
  const token = req.headers.cookie?.split('=')[1];

  // Check if the token exists
  if (!token) {
    res.status(401).json({ message: 'Unauthorized', error: true });
    return;
  }

  try {
    // Verify the token
    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token', error: true });
    return;
  }
};
