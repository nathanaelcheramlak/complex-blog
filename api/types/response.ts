import { Types, Document } from 'mongoose';
import { LikeType, CommentType } from './model';

export type BlogTypeSorted = {
  title: string;
  content: string;
  user: {
    _id: Types.ObjectId;
    username: string;
    fullname: string;
    profilePicture: string;
  };
  likes: number;
};

export type PopulatedBlogType = Document & {
  title: string;
  content: string;
  user: Types.ObjectId;
  likes: LikeType[];
  comments: CommentType[];
};

export type UserProfile = {
  _id: any;
  username: string;
  email: string;
  dateOfBirth: Date;
  fullname: string;
  bio: string;
  profilePicture: string;
};

export type CommentTypeSorted = Document & {
  _id: Types.ObjectId;
  content: string;
  user: {
    _id: Types.ObjectId;
    username: string;
    fullname: string;
    profilePicture: string;
  };
  blog: Types.ObjectId;
};

export type ErrorType = {
  message: string | string[];
};
