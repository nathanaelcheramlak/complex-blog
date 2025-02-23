import User from '../models/user';

export interface UserProfileDto {
  _id: string;
  username: string;
  email: string;
  dateOfBirth: Date;
  fullname: string;
  bio?: string;
  profilePicture?: string;
}

export const mapUser = (user: any): UserProfileDto => ({
  _id: user._id.toString(),
  username: user.username,
  email: user.email,
  dateOfBirth: user.dateOfBirth,
  fullname: user.fullname,
  bio: user.bio || '',
  profilePicture: user.profilePicture || '',
});
