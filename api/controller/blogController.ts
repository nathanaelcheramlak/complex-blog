import { Request, Response } from 'express';

export const getBlogs = async (request: Request, response: Response) => {
  response.status(200).send([]);
};

export const getBlogById = async (request: Request, response: Response) => {
  response.status(200).json({});
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
