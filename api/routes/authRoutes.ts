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
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../middlewares/validateAuth';
import { validateRequest } from '../middlewares/validateRequest';

const app = express.Router();

app.post('/login', validateLogin, validateRequest, login);
app.post('/register', validateRegister, validateRequest, register);
app.delete('/logout', logout);
app.post(
  '/forgot-password',
  validateForgotPassword,
  validateRequest,
  forgotPassword,
);
app.post(
  '/reset-password',
  validateResetPassword,
  validateRequest,
  resetPassword,
);
app.get('/me', authenticateJWT, me);

export default app;
