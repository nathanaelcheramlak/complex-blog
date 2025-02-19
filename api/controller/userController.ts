import { Request, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from '../types/request'; // Import the extended type
import { UserProfile } from '../types/response';

export const getUser = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
) => {
  try {
    if (!req?.user) {
      res.status(401).json({ message: 'Unauthorized', error: true });
      return;
    }

    const userId = req.user?.id;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found', error: true });
      return;
    }

    const userProfile: UserProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      fullname: user.fullname,
      bio: user.bio,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ data: userProfile });
  } catch (error) {
    console.error('Error in get user controller: ', error);
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).lean();

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userProfile: UserProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      fullname: user.fullname,
      bio: user.bio,
      profilePicture: user.profilePicture,
    };

    // Send the user data
    res.status(200).json({ data: userProfile });
  } catch (error) {
    console.log('Error on get user by id controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editUser = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const deleteUser = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getFollowers = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getFollowing = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const followUser = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const unFollowUser = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const getBookmarks = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const addBookmark = async (
  req: Request,
  res: Response,
): Promise<void> => {};

export const deleteBookmark = async (
  req: Request,
  res: Response,
): Promise<void> => {};
