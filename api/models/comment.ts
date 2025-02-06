import { Schema, model, Document, Types } from 'mongoose';

type CommentType = Document & {
  comment: string;
  user: Types.ObjectId;
  blog: Types.ObjectId;
};

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
