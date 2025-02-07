import { Schema, model, Document, Types } from 'mongoose';

type BlogType = Document & {
  title: String;
  content: String;
  user: Types.ObjectId;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
};

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
