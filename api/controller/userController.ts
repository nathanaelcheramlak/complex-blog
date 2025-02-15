import { RequestHandler, Request, Response } from 'express';
import User from '../models/user';

export const getUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = User.findById(id).select(
      '-password -followers -following -blogs -liked_blogs -commented_blogs -bookmarked_blogs',
    );
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User found!', error: false, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const editUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const deleteUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getFollowers: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getFollowing: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const followUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const unFollowUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getBookmarks: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const addBookmark: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const deleteBookmark: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};
