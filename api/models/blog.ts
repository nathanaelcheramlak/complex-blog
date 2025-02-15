import { Schema, model, Document, Types } from 'mongoose';
import type { BlogType } from '../types/model';

const blogSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

const Blog = model<BlogType>('Blog', blogSchema);

export default Blog;
