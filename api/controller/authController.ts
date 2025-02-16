import { Request, RequestHandler, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import User from '../models/user';
import { setAuthCookie, clearAuthToken } from '../utils/authCookies';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { AuthenticatedRequest } from '../types/request';

export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, username, password } = req.body;

    // Validation
    if (!email && !username) {
      res.status(400).json({ message: 'Email or username is required' });
      return;
    }
    if (!password) {
      res.status(400).json({ message: 'Password is required' });
      return;
    }

    // Check if the user exists by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      res.status(404).json({ message: 'Invalid Credentials.', error: true });
      return;
    }

    // Check if the password is correct
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials', error: true });
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
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const register: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { fullname, email, username, password, dateOfBirth } = req.body;

    // Validation
    if (!fullname || !email || !username || !password || !dateOfBirth) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

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
    const userDTO = {
      id: newUser.id,
      fullname: newUser.fullname,
      email: newUser.email,
      username: newUser.username,
    };
    res.json({
      message: 'User created successfully',
      error: false,
      data: userDTO,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
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

    // Send email with the reset token
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      'Reset Password',
      `Click here to reset your password: ${resetLink}`,
    );

    res.json({ message: 'Reset link sent to your email', error: false });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
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
      res.status(400).json({ error: true, message: 'Password is required' });
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
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const logout: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    clearAuthToken(res);
    res.json({ message: 'Logout successfully', error: false });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const me: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized', error: true });
      return;
    }
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found', error: true });
      return;
    }
    res.json({ message: 'User found', error: false, data: user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};
