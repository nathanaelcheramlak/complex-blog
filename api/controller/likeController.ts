import { Request, Response } from 'express';

export const getLikes = (request: Request, response: Response) => {
  response.status(200).send([]);
};

export const createLike = (request: Request, response: Response) => {
  response.status(201).json({});
};

export const deleteLike = (request: Request, response: Response) => {
  response.status(200).json({});
};
