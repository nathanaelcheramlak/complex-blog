import { CallbackError, Schema, model } from 'mongoose';
import crypto from 'crypto';
import type { UserType } from '../types/model';
import Blog from './blog';
import Comment from './comment';
import Like from './like';
import Bookmark from './bookmark';

const userSchema: Schema = new Schema(
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
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
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
        ref: 'Like',
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bookmark',
      },
    ],
  },
  { timestamps: true },
);

// Pre Hooks
userSchema.pre('findOneAndDelete', async function (next: any) {
  const user = this.getQuery();
  const session = await User.startSession();

  // Start transaction
  session.startTransaction();

  try {
    // Delete all blogs created by the user
    await Blog.deleteMany({ author: user._id }).session(session);

    // Remove user from other users' followers & following lists
    await User.updateMany(
      { followers: user._id },
      { $pull: { followers: user._id } },
      { session },
    );

    await User.updateMany(
      { following: user._id },
      { $pull: { following: user._id } },
      { session },
    );

    // Remove user from liked, commented, and bookmarked blogs
    await Like.deleteMany({ user: user._id }).session(session);
    await Comment.deleteMany({ user: user._id }).session(session);
    await Bookmark.deleteMany({ user: user._id }).session(session);

    // Commit the transaction if everything is successful
    await session.commitTransaction();

    next();
  } catch (error: unknown) {
    // If any error occurs, abort the transaction to rollback changes
    console.error('Error during pre-delete in user model: ', error);
    await session.abortTransaction();
    next(error as CallbackError);
  } finally {
    // End the session after the transaction is complete (committed or aborted)
    session.endSession();
  }
});

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  return token;
};

const User = model<UserType>('User', userSchema);
export default User;
