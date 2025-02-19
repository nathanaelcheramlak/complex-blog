import { Request } from 'express';
import { UserPayload } from './UserPayloads';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export interface CustomRequest<T, U, V> extends Request<T, U, V> {
  user?: UserPayload;
}
