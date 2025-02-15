import { Schema, model } from 'mongoose';
import type { BookmarkType } from '../types/model';

const bookmarkSchema: Schema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Bookmark = model<BookmarkType>('Bookmark', bookmarkSchema);

export default Bookmark;
