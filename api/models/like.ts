import { Schema, model } from 'mongoose';
import type { LikeType } from '../types/model';

const likeSchema: Schema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

const Like = model<LikeType>('Like', likeSchema);

export default Like;
