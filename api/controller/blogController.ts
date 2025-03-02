import { Request, Response } from 'express';
import Blog from '../models/blog';
import type { BlogType } from '../types/model';
import type {
  BlogTypeSorted,
  PopulatedBlogType,
  ErrorType,
} from '../types/response';
import type { CreateBlogDto, UpdateBlogDto } from '../dtos';
import { SortByQuery } from '../types/query_params';
import { CustomRequest } from '../types/request';
import User from '../models/user';
import mongoose from 'mongoose';

export const getBlogs = async (
  request: Request<{}, {}, {}, SortByQuery>,
  response: Response<BlogTypeSorted[] | ErrorType>,
) => {
  try {
    const { sortBy, order } = request.query;

    let blogs: BlogTypeSorted[] = [];

    if (sortBy === 'date') {
      blogs = (await Blog.find()
        .sort({ createdAt: order === 'asc' ? 1 : -1 })
        .populate('author', '_id username fullname profilePicture')
        .lean()) as unknown as BlogTypeSorted[];
    } else if (sortBy === 'likes') {
      blogs = (await Blog.find()
        .sort({ likes: order === 'asc' ? 1 : -1 })
        .populate('author', '_id username fullname profilePicture')
        .lean()) as unknown as BlogTypeSorted[];
    } else {
      blogs = (await Blog.find()
        .populate('author', '_id username fullname profilePicture')
        .lean()) as unknown as BlogTypeSorted[];
    }

    response.status(200).json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const getMyBlogs = async (
  request: CustomRequest<{}, {}, {}>,
  response: Response,
) => {
  const userId = new mongoose.Types.ObjectId(request.user?.id);

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const blogs = (await Blog.find({ author: userId })
      .populate('author', '_id username fullname profilePicture')
      .lean()) as unknown as BlogTypeSorted[];

    response.status(200).json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const getUserBlogs = async (
  request: Request<{ userId: string }, {}, {}, {}>,
  response: Response<BlogTypeSorted[] | ErrorType>,
) => {
  const { userId } = request.params;

  try {
    const blogs = (await Blog.find({ author: userId })
      .populate('author', '_id username fullname profilePicture')
      .lean()) as unknown as BlogTypeSorted[];

    response.status(200).json(blogs);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const getBlogById = async (
  request: Request,
  response: Response<PopulatedBlogType | ErrorType>,
) => {
  const { id } = request.params;
  try {
    const blog = (await Blog.findById(id)
      .populate('likes')
      .populate('comments')
      .lean()) as PopulatedBlogType | null;

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    response.status(200).json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const createBlog = async (
  request: CustomRequest<{}, {}, CreateBlogDto>,
  response: Response<BlogType | ErrorType>,
) => {
  const userId = request.user?.id;
  const { title, content } = request.body;

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!title || !content) {
    response.status(400).json({ message: 'Title and content are required' });
    return;
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    const blog = new Blog({
      title,
      content,
      author: userId,
    });

    await blog.save();

    user.blogs.push(blog.id);
    await user.save();

    response.status(201).json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const updateBlog = async (
  request: CustomRequest<{ id: string }, {}, UpdateBlogDto>,
  response: Response<BlogType | ErrorType>,
) => {
  const userId = request.user?.id;
  const { id } = request.params;
  const { title, content } = request.body;

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!title && !content) {
    response.status(400).json({ message: 'Title or content are required' });
    return;
  }

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (blog.author.toString() !== userId) {
      response.status(403).json({ message: 'You are not authorized' });
      return;
    }

    if (title) {
      blog.title = title;
    }

    if (content) {
      blog.content = content;
    }

    await blog.save();

    response.status(200).json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const deleteBlog = async (
  request: CustomRequest<{ id: string }, {}, {}>,
  response: Response<{ message: string } | ErrorType>,
) => {
  const userId = request.user?.id;
  const { id } = request.params;

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const blog = await Blog.findById(id);
    const user = await User.findById(userId);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (blog.author.toString() !== userId) {
      response.status(403).json({ message: 'You are not authorized' });
      return;
    }

    if (user) {
      user.blogs = user.blogs.filter((blogId) => blogId.toString() !== id);
      await user.save();
    }

    await blog.deleteOne({ _id: id });

    response.status(204);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};
