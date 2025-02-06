import { Schema, model } from 'mongoose';

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

const Comment = model('Comment', commentSchema);
export default Comment;
