import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import mongoose, { mongo } from 'mongoose';
import User from '../models/user';
import Blog from '../models/blog';
import { CustomRequest } from '../types/request';
import { mapUser } from '../dtos/user.dto';

export const getUsers = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response,
) => {
  try {
    const users = await User.find().lean();

    res.status(200).json({ users: users.map(mapUser) });
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
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('followers').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ followers: user.followers.map(mapUser) });
  } catch (error) {
    console.log('Error on get followers controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFollowing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.params.id;
  const user = await User.findById(userId).populate('following').lean();
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  res.status(200).json({ following: user.following.map(mapUser) });
};

export const followUser = async (
  req: CustomRequest<{ id: string }, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);
    const id = new mongoose.Types.ObjectId(req.params.id);

    if (userId.equals(id)) {
      res.status(400).json({ message: 'Cannot follow yourself' });
      return;
    }

    const user = await User.findById(userId);
    const userToFollow = await User.findById(id);

    if (!user || !userToFollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (user.following.includes(id)) {
      res.status(400).json({ message: 'Already following user' });
      return;
    }

    user.following.push(id);
    userToFollow.followers.push(userId);

    await user.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.log('Error on follow user controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const unFollowUser = async (
  req: CustomRequest<{ id: string }, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user?.id);
    const id = new mongoose.Types.ObjectId(req.params.id);

    if (userId.equals(id)) {
      res.status(400).json({ message: 'Cannot unfollow yourself' });
      return;
    }

    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(id);

    if (!user || !userToUnfollow) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user.following.includes(id)) {
      res.status(400).json({ message: 'Not following user' });
      return;
    }

    user.following = user.following.filter((followId) => !followId.equals(id));
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (followerId) => !followerId.equals(userId),
    );

    await user.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    console.log('Error on unfollow user controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getBookmarks = async (
  req: CustomRequest<{ id: string }, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate('bookmarks').lean();
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.log('Error on get bookmarks controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addBookmark = async (
  req: CustomRequest<{ blogId: string }, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const blogId = new mongoose.Types.ObjectId(req.params.blogId);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const blog = Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (user.bookmarks.includes(blogId)) {
      res.status(400).json({ message: 'Blog already bookmarked' });
      return;
    }

    user.bookmarks.push(blogId);
    await user.save();

    res.status(200).json({ message: 'Blog bookmarked successfully' });
  } catch (error) {
    console.log('Error on add bookmark controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteBookmark = async (
  req: CustomRequest<{ blogId: string }, {}, {}>,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const blogId = new mongoose.Types.ObjectId(req.params.blogId);

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const blog = Blog.findById(blogId);
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (!user.bookmarks.includes(blogId)) {
      res.status(400).json({ message: 'Blog is not bookmarked' });
      return;
    }

    user.bookmarks = user.bookmarks.filter(
      (bookmarkId) => !bookmarkId.equals(blogId),
    );
    await user.save();

    res.status(200).json({ message: 'Bookmark deleted successfully' });
  } catch (error) {
    console.log('Error on delete bookmark controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
