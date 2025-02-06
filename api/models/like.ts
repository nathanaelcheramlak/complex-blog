import { Schema, model } from 'mongoose';

const likeSchema = new Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    isLiked: { type: Boolean, required: true },
  },
  { timestamps: true },
);

const Like = model('Like', likeSchema);

export default Like;
