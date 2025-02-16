import express from 'express';
import {
  login,
  register,
  forgotPassword,
  logout,
  me,
  resetPassword,
} from '../controller/authController';
import { authenticateJWT } from '../utils/verifyToken';

const app = express.Router();

app.post('/login', login);
app.post('/register', register);
app.delete('/logout', logout);
app.post('/forgot-password', forgotPassword);
app.post('reset-password', resetPassword);
app.get('/me', authenticateJWT, me);

export default app;
