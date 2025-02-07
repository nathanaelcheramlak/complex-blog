import { RequestHandler, Request, Response } from 'express';

export const getUser: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {};

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
