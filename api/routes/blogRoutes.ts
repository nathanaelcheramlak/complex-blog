import express from 'express';
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from '../controller/blogController';
import { createLike, deleteLike, getLikes } from '../controller/likeController';

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
app.get('/', getBlogs);

app.get('/:id', getBlogById);

app.post('/', createBlog);

app.put('/:id', updateBlog);

app.delete('/:id', deleteBlog);

// Likes

app.get('/:blogId/likes', getLikes);

app.post('/:blogId/likes', createLike);

app.delete('/:blogId/likes/:id', deleteLike);

export default app;
