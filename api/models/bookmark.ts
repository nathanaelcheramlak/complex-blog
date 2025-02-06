import { Schema, model, Document, Types } from 'mongoose';

type BookmarkType = Document & {
  blog: Types.ObjectId;
  user: Types.ObjectId;
};

const bookmarkSchema: Schema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Bookmark = model<BookmarkType>('Bookmark', bookmarkSchema);

export default Bookmark;
