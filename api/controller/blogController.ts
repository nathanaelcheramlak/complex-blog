import { Request, Response } from 'express';
import Blog from '../models/blog';
import type { BlogType } from '../types/model';
import type { PopulatedBlogType, ErrorType } from '../types/response';
import type { CreateBlogDto } from '../dtos/CreateBlog.dto';

export const getBlogs = async (
  request: Request,
  response: Response<BlogType[] | ErrorType>,
) => {
  try {
    const blogs = await Blog.find();

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
  const { _id } = request.params;
  try {
    const blog = (await Blog.findById(_id)
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

export const createBlog = async (request: Request, response: Response) => {
  response.status(200).json({});
};

export const updateBlog = async (request: Request, response: Response) => {
  response.status(200).json({});
};

export const deleteBlog = async (request: Request, response: Response) => {
  response.status(200).json({});
};
