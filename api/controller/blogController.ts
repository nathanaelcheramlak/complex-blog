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
    const blog = new Blog({
      title,
      content,
      author: userId,
    });

    await blog.save();

    response.status(201).json(blog);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const updateBlog = async (request: Request, response: Response) => {
  response.status(200).json({});
};

export const deleteBlog = async (request: Request, response: Response) => {
  response.status(200).json({});
};
