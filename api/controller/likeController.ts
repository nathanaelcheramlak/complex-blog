import { Request, Response } from 'express';

export const getLikes = async (request: Request, response: Response) => {
  response.status(200).send([]);
};

export const createLike = async (request: Request, response: Response) => {
  response.status(201).json({});
};

export const deleteLike = async (request: Request, response: Response) => {
  response.status(200).json({});
};
