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

export const createLike = async (request: Request, response: Response) => {
  response.status(201).json({});
};

export const deleteLike = async (request: Request, response: Response) => {
  response.status(200).json({});
};
