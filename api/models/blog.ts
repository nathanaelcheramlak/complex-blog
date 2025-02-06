import { Schema, model } from 'mongoose';

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const User = model('Blog', blogSchema);

export default User;
