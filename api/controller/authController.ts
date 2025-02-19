import { Request, RequestHandler, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import User from '../models/user';
import { setAuthCookie, clearAuthToken } from '../utils/authCookies';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { AuthenticatedRequest } from '../types/request';
import { ErrorType, UserProfile } from '../types/response';
import { matchedData, validationResult } from 'express-validator';

export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(400)
        .json({ message: result.array().map((error) => error.msg) });
      return;
    }
    const { email, username, password } = matchedData(req);
    console.log(email, username, password);

    // Check if the user exists by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      res.status(404).json({ message: 'Invalid Credentials.(NO)' });
      return;
    }

    // Check if the password is correct
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Set the auth token
    setAuthCookie(res, { id: user.id, username: user.username });
    const userDTO = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      username: user.username,
    };
    res.json({ message: 'Login successfully', error: false, data: userDTO });
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
      return;
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
      return;
    }
  }
};

export const register: RequestHandler = async (
  req: Request,
  res: Response<UserProfile | ErrorType>,
): Promise<void> => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res
        .status(400)
        .json({ message: result.array().map((error) => error.msg) });
      return;
    }

    const { fullname, email, username, password, dateOfBirth } =
      matchedData(req);

    // Check if the user exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = 10;
    const hashedPassword = await hash(password, salt);

    // Create the user
    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword,
      dateOfBirth,
    });

    await newUser.save();
    setAuthCookie(res, { id: newUser.id, username: newUser.username });
    const userProfile: UserProfile = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      dateOfBirth: newUser.dateOfBirth,
      fullname: newUser.fullname,
      bio: newUser.bio,
      profilePicture: newUser.profilePicture,
    };

    res.json(userProfile);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = req.body;
    // Validate email
    if (!email) {
      res.status(400).json({ error: true, message: 'Email is required' });
      return;
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: true, message: 'User not found' });
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Set the reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();
    console.log(user);

    // Send email with the reset token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      'Reset Password',
      `Click here to reset your password: ${resetLink}`,
    );

    res.json({ message: 'Reset link sent to your email', error: false });
  } catch (error) {
    console.log('Error from forgot password controller.', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const resetPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token, password } = req.body;

    // Validate password
    if (!password) {
      res
        .status(400)
        .json({ error: true, message: 'new password is required' });
      return;
    }
    if (!token) {
      res.status(400).json({ error: true, message: 'Token is required' });
      return;
    }

    // Check if the user exists
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res
        .status(400)
        .json({ error: true, message: 'Invalid or expired token' });
      return;
    }

    // Hash the new password
    const salt = 10;
    const hashedPassword = await hash(password, salt);

    // Update the password
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    res.json({ message: 'Password reset successfully', error: false });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout: RequestHandler = async (
  req: Request,
  res: Response<{ message: string } | ErrorType>,
): Promise<void> => {
  try {
    clearAuthToken(res);
    res.status(204).json({ message: 'Logout successfully' });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const me: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response<UserProfile | ErrorType>,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userProfile: UserProfile = {
      _id: user._id,
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      fullname: user.fullname,
      bio: user.bio,
      profilePicture: user.profilePicture,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
