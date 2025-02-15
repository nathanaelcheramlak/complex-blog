import { Schema, model } from 'mongoose';
import type { CommentType } from '../types/model';

const commentSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  },
  { timestamps: true },
);

const Comment = model<CommentType>('Comment', commentSchema);
export default Comment;
