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
  validteRegister,
  validateLogin,
} from '../middlewares/validateRegister';

const app = express.Router();

app.post('/login', validateLogin, login);
app.post('/register', validteRegister, register);
app.delete('/logout', logout);
app.post('/forgot-password', forgotPassword);
app.post('/reset-password', resetPassword);
app.get('/me', authenticateJWT, me);

export default app;
