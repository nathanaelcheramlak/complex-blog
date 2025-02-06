import { Schema, model, Document, Types } from 'mongoose';

type BlogType = Document & {
  title: String;
  content: String;
  user: Types.ObjectId;
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
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Blog = model<BlogType>('Blog', blogSchema);

export default Blog;
