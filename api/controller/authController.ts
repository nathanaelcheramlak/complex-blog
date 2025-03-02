import { Request, RequestHandler, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import User from '../models/user';
import { setAuthCookie, clearAuthToken } from '../utils/authCookies';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail';
import { CustomRequest } from '../types/request';
import { ErrorType } from '../types/response';
import { matchedData } from 'express-validator';
import { mapUser, UserProfileDto } from '../dtos/user.dto';

export const login: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, username, password } = matchedData(req);

    // Check if the user exists by email or username
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      res.status(404).json({ message: 'Invalid Credentials.(NO)' });
      return;
    }

    if (!user.emailVerified) {
      res.status(400).json({ message: 'Please verify your email' });
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

    res.json({
      message: 'Login successfully',
      error: false,
      user: mapUser(user),
    });
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
  res: Response<UserProfileDto | ErrorType>,
): Promise<void> => {
  try {
    const { fullname, email, username, password, dateOfBirth } =
      matchedData(req);

    // Check if the email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      if (existingEmail.emailVerified) {
        res.status(400).json({
          message: 'Email is already registered. Login with your credentials.',
        });
        return;
      } else {
        res
          .status(400)
          .json({ message: 'Already registered. Please verify your email' });
        return;
      }
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ message: 'Username is already taken' });
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

    const token = newUser.generateEmailVerificationToken();
    await newUser.save();

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;
    await sendEmail(
      newUser.email,
      'Email Verification',
      'verifyEmail',
      verificationLink,
    );

    res.json({
      message: 'User registered successfully. Please verify your email',
    });
    return;
  } catch (error) {
    console.log('Error in register controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyEmail: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { token } = req.query;
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Verify email
    user.emailVerified = true;
    user.emailVerificationToken = null; // Remove token after verification
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
    return;
  } catch (error) {
    console.log('Error in verify email controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email } = matchedData(req);

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
    const resetLink = `${process.env.BACKEND_URL}/api/auth/reset-password?token=${resetToken}`;
    await sendEmail(user.email, 'Reset Password', 'passwordReset', resetLink);

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
    const { token, password } = matchedData(req);

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
    res.json({
      message: 'Password reset successfully',
      error: false,
      user: mapUser(user),
    });
  } catch (error) {
    console.log('Error in reset password controller: ', error);
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
    console.log('Error in logout controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const me: RequestHandler = async (
  req: CustomRequest<{}, {}, {}>,
  res: Response<UserProfileDto | ErrorType>,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(mapUser(user));
  } catch (error) {
    console.log('Error in get user (me) controller: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
