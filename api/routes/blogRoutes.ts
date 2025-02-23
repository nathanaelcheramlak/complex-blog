import express from 'express';
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from '../controller/blogController';
import { createLike, deleteLike, getLikes } from '../controller/likeController';
import {
  createComment,
  deleteComment,
  getCommentById,
  getComments,
  updateComment,
} from '../controller/commentController';
import { authenticateJWT } from '../utils/verifyToken';

const app = express.Router();

app.get('/', getBlogs);

app.get('/:id', getBlogById);

app.post('/', authenticateJWT, createBlog);

app.put('/:id', authenticateJWT, updateBlog);

app.delete('/:id', authenticateJWT, deleteBlog);

// Likes

app.get('/:blogId/likes', getLikes);

app.post('/:blogId/likes', createLike);

app.delete('/:blogId/likes/:id', deleteLike);

// comments
app.get('/:blogId/comments', getComments);

app.get('/:blogId/comments/:id', getCommentById);

app.post('/:blogId/comments', authenticateJWT, createComment);

app.put('/:blogId/comments/:id', updateComment);

app.delete('/:blogId/comments/:id', deleteComment);

export default app;
