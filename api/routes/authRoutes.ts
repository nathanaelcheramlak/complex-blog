import express from 'express';
import {
  login,
  register,
  forgotPassword,
  logout,
  me,
} from '../controller/authController';

const app = express.Router();

app.post('/login', login);
app.post('/register', register);
app.post('/forgot-password', forgotPassword);
app.delete('/logout', logout);
app.get('/me', me);

export default app;
