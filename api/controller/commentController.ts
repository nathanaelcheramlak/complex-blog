import { Request, Response } from 'express';

export const getComments = async (request: Request, response: Response) => {
  response.status(200).send([]);
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
