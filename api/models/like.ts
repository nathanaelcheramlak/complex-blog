import { Schema, model, Document, Types } from 'mongoose';

type LikeType = Document & {
  blog: Types.ObjectId;
  user: Types.ObjectId;
};

const likeSchema: Schema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Like = model<LikeType>('Like', likeSchema);

export default Like;
