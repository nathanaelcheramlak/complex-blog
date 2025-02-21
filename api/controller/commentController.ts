import { Request, Response } from 'express';
import type { CommentTypeSorted, ErrorType } from '../types/response';
import Comment from '../models/comment';
import Blog from '../models/blog';
import { SortByQuery } from '../types/query_params';

export const getComments = async (
  request: Request<{ blogId: string }, {}, {}, SortByQuery>,
  response: Response<CommentTypeSorted[] | ErrorType>,
) => {
  const { blogId } = request.params;
  const { sortBy, order } = request.query;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    let comments: CommentTypeSorted[] = [];

    if (sortBy === 'date') {
      comments = (await Comment.find({ blog: blogId })
        .sort({
          createdAt: order === 'asc' ? 1 : -1,
        })
        .populate('user', '_id username fullname profilePicture')
        .lean()) as unknown as CommentTypeSorted[];
    } else {
      comments = (await Comment.find({ blog: blogId })
        .populate('user', '_id username fullname profilePicture')
        .lean()) as unknown as CommentTypeSorted[];
    }

    response.status(200).json(comments);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred.' });
    }
  }
};

export const getCommentById = async (request: Request, response: Response) => {
  response.status(200).json({});
};

export const createComment = async (request: Request, response: Response) => {
  response.status(201).json({});
};

export const updateComment = async (request: Request, response: Response) => {
  response.status(200).json({});
};

export const deleteComment = async (request: Request, response: Response) => {
  response.status(200).json({});
};
