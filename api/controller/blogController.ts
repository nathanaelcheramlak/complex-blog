import { Request, RequestHandler, Response } from 'express';

export const getBlogs = (request: Request, response: Response) => {
  response.status(200).send([]);
};

export const getBlogById = (request: Request, response: Response) => {
  response.status(200).json({});
};

export const createBlog = (request: Request, response: Response) => {
  response.status(200).json({});
};

export const updateBlog = (request: Request, response: Response) => {
  response.status(200).json({});
};

export const deleteBlog = (request: Request, response: Response) => {
  response.status(200).json({});
};
