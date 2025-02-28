import { Request, Response } from 'express';
import Blog from '../models/blog';
import User from '../models/user';
import type { ErrorType, LikeTypeSorted } from '../types/response';
import type { CustomRequest } from '../types/request';
import Like from '../models/like';

export const getLikes = async (
  request: Request<{ blogId: string }>,
  response: Response<{ likes: number } | ErrorType>
) => {
  const { blogId } = request.params;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    const likes = blog.likes.length;

    response.status(200).json({ likes });
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    } else {
      response.status(500).json({ message: 'Something went wrong' });
      return;
    }
  }
};

export const createLike = async (
  request: CustomRequest<{ blogId: string }, {}, {}>,
  response: Response<LikeTypeSorted | ErrorType>
) => {
  const userId = request.user?.id;
  const { blogId } = request.params;

  try {
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    if (blog.likes.includes(user.id)) {
      response
        .status(400)
        .json({ message: 'You have already liked this blog' });
      return;
    }

    const like = await Like.create({ blog: blog.id, user: user.id });
    await like.save();

    blog.likes.push(user.id);
    user.liked_blogs.push(blog.id);

    await blog.save();
    await user.save();

    const likePopulated = (await Like.findById(like.id).populate(
      'user',
      'id username fullname profilePicture'
    )) as unknown as LikeTypeSorted;

    response.status(201).json(likePopulated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    } else {
      response.status(500).json({ message: 'Something went wrong' });
      return;
    }
  }
};

export const deleteLike = async (
  request: CustomRequest<{ blogId: string; id: string }, {}, {}>,
  response: Response<ErrorType>
) => {
  const userId = request.user?.id;
  const { blogId, id } = request.params;

  try {
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    if (!blog.likes.includes(user.id)) {
      response.status(400).json({ message: 'You have not liked this blog' });
      return;
    }

    const like = await Like.findById(id);

    if (!like) {
      response.status(404).json({ message: 'Like not found' });
      return;
    }

    blog.likes = blog.likes.filter((like) => like.toString() !== user.id);
    user.liked_blogs = user.liked_blogs.filter(
      (likedBlog) => likedBlog.toString() !== blog.id
    );

    await blog.save();
    await user.save();

    await like.deleteOne();

    response.status(204);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    } else {
      response.status(500).json({ message: 'Something went wrong' });
      return;
    }
  }
};
