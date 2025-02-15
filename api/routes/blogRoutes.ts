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

/**
 * @swagger
 * /blogs:
 *  get:
 *   summary: Get all blogs
 *  responses:
 *   200:
 *    description: Returns all blogs
 *    content:
 *      application/json:
 *        schema:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Blog'
 *
 */
app.get('/', authenticateJWT, getBlogs);

app.get('/:id', authenticateJWT, getBlogById);

app.post('/', authenticateJWT, createBlog);

app.put('/:id', authenticateJWT, updateBlog);

app.delete('/:id', authenticateJWT, deleteBlog);

// Likes

app.get('/:blogId/likes', authenticateJWT, getLikes);

app.post('/:blogId/likes', authenticateJWT, createLike);

app.delete('/:blogId/likes/:id', authenticateJWT, deleteLike);

// comments
app.get('/:blogId/comments', authenticateJWT, getComments);

app.get('/:blogId/comments/:id', authenticateJWT, getCommentById);

app.post('/:blogId/comments', authenticateJWT, createComment);

app.put('/:blogId/comments/:id', authenticateJWT, updateComment);

app.delete('/:blogId/comments/:id', authenticateJWT, deleteComment);

export default app;
