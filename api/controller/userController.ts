import { Request, Response } from 'express';
import User from '../models/user';
import { CustomRequest } from '../types/request'; // Import the extended type
import { UserProfile } from '../types/response';
import { mapUser } from '../dtos/user.dto';
import { matchedData } from 'express-validator';

export const getUser = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found', error: true });
      return;
    }

    res.status(200).json({ user: mapUser(user) });
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

    // Send the user data
    res.status(200).json({ user: mapUser(user) });
  } catch (error) {
    console.log('Error on get user by id controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const editUser = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found', error: true });
      return;
    }

    const { fullname, bio, profilePicture, dateOfBirth } = matchedData(req);

    user.fullname = fullname || user.fullname;
    user.bio = bio || user.bio;
    user.profilePicture = profilePicture || user.profilePicture;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    await user.save();

    res.status(200).json({ user: mapUser(user) });
  } catch (error) {
    console.log('Error on edit user controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found', error: true });
      return;
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log('Error on delete user controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username } = req.query;

    if (!username) {
      res.status(400).json({ message: 'Username is required' });
      return;
    }

    const users = await User.find({
      username: { $regex: username, $options: 'i' },
    }).lean();

    res.status(200).json({ users: users.map(mapUser) });
  } catch (error) {
    console.log('Error on search user controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
