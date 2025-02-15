import { Request, RequestHandler, Response } from 'express';
import { compare, hash } from 'bcryptjs';
import User from '../models/user';
import { setAuthCookie, clearAuthToken } from '../utils/authCookies';

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
    res.json({ message: 'Login successfully', error: false });
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
    res.json({ message: 'User created successfully', error: false });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: true });
  }
};

export const forgotPassword: RequestHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Forgot Password' });
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
  req: Request,
  res: Response,
): Promise<void> => {
  res.json({ message: 'Me' });
};
