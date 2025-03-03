import Comment from '../models/comment';
import Blog from '../models/blog';
import User from '../models/user';
import type { Request, Response } from 'express';
import type { CommentTypeSorted, ErrorType } from '../types/response';
import type { SortByQuery } from '../types/query_params';
import type { CustomRequest } from '../types/request';
import type { CreateCommentDto, UpdateCommentDto } from '../dtos';

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

export const getCommentById = async (
  request: Request<{ blogId: string; id: string }>,
  response: Response<CommentTypeSorted | ErrorType>,
) => {
  const { blogId, id } = request.params;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      response.json({ message: 'Blog not found' });
      return;
    }

    const comment = (await Comment.findById(id)
      .populate('user', '_id username fullname profilePicture')
      .lean()) as unknown as CommentTypeSorted | null;

    if (!comment) {
      response.status(404).json({ message: 'Comment not found' });
      return;
    }

    response.status(200).json(comment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const createComment = async (
  request: CustomRequest<{ blogId: string }, {}, CreateCommentDto>,
  response: Response<CommentTypeSorted | ErrorType>,
) => {
  const userId = request.user?.id;
  const { blogId } = request.params;
  const { comment } = request.body;

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (!comment) {
    response.status(400).json({ message: 'Comment is required' });
    return;
  }

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

    if (blog.author.toString() === userId) {
      response
        .status(400)
        .json({ message: 'You cannot comment on your own blog' });
      return;
    }

    const newComment = new Comment({
      comment,
      user: userId,
      blog: blogId,
    });

    await newComment.save();

    blog.comments.push(newComment.id);
    await blog.save();

    user.comments.push(newComment.id);
    await user.save();

    const populatedComment = (await Comment.findById(newComment.id)
      .populate('user', '_id username fullname profilePicture')
      .lean()) as unknown as CommentTypeSorted;

    response.status(201).json(populatedComment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
    } else {
      response.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateComment = async (
  request: CustomRequest<{ blogId: string; id: string }, {}, UpdateCommentDto>,
  response: Response<CommentTypeSorted | ErrorType>,
) => {
  const { blogId, id } = request.params;
  const { comment } = request.body;

  if (!comment) {
    response.status(400).json({ message: 'Comment is required' });
    return;
  }

  try {
    const blog = await Blog.findById(blogId);
    const existingComment = await Comment.findById(id);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (!existingComment) {
      response.status(404).json({ message: 'Comment not found' });
      return;
    }

    existingComment.comment = comment;

    await existingComment.save();

    const updatedComment = (await Comment.findById(id)
      .populate('user', '_id username fullname profilePicture')
      .lean()) as unknown as CommentTypeSorted;

    response.status(200).json(updatedComment);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    } else {
      response.status(500).json({ message: 'An unknown error occurred' });
      return;
    }
  }
};

export const deleteComment = async (
  request: CustomRequest<{ blogId: string; id: string }, {}, {}>,
  response: Response<{ message: string } | ErrorType>,
) => {
  const userId = request.user?.id;
  const { blogId, id } = request.params;

  if (!userId) {
    response.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);
    const existingComment = await Comment.findById(id);

    if (!blog) {
      response.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (!user) {
      response.status(404).json({ message: 'User not found' });
      return;
    }

    if (!existingComment) {
      response.status(404).json({ message: 'Comment not found' });
      return;
    }

    blog.comments = blog.comments.filter(
      (comment) => comment.toString() !== id,
    );
    await blog.save();

    user.comments = user.comments.filter(
      (comment) => comment.toString() !== id,
    );
    await user.save();

    await existingComment.deleteOne({ _id: id });

    response.status(204);
  } catch (error: unknown) {
    if (error instanceof Error) {
      response.status(500).json({ message: error.message });
      return;
    } else {
      response.status(500).json({ message: 'An unknown error occurred' });
      return;
    }
  }
};
