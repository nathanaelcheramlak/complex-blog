import { Schema, model } from 'mongoose';

const bookmarkSchema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Bookmark = model('Bookmark', bookmarkSchema);

export default Bookmark;
