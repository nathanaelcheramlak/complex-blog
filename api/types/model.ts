import { Types, Document } from 'mongoose';

export type UserType = Document & {
  fullname: string;
  email: string;
  username: string;
  password: string;
  bio: string;
  dateOfBirth: Date;
  profilePicture: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  blogs: Types.ObjectId[];
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  liked_blogs: Types.ObjectId[];
  commented_blogs: Types.ObjectId[];
  bookmarked_blogs: Types.ObjectId[];
};

export type BlogType = Document & {
  title: String;
  content: String;
  author: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
};

export type CommentType = Document & {
  comment: string;
  user: Types.ObjectId;
  blog: Types.ObjectId;
};

export type BookmarkType = Document & {
  blog: Types.ObjectId;
  user: Types.ObjectId;
};

export type LikeType = Document & {
  blog: Types.ObjectId;
  user: Types.ObjectId;
};
