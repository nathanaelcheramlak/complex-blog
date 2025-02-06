import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: Date,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    liked_blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    commented_blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
    bookmarked_blogs: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
      },
    ],
  },
  { timestamps: true },
);

const User = model('User', userSchema);
export default User;
