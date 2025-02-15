import { Types } from 'mongoose';

export type BlogType = Document & {
  title: String;
  content: String;
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
};

export type ErrorType = {
  message: string;
};
