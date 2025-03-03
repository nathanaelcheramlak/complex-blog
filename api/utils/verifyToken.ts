import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/UserPayloads';
import { CustomRequest } from '../types/request';

export const authenticateJWT = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.auth_token;

    if (!token) {
      res.status(401).json({ message: 'Unauthorized', error: true });
      return;
    }

    const user = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as UserPayload;

    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token', error: true });
  }
};
