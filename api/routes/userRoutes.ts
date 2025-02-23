import express from 'express';
import {
  getUser,
  getUserById,
  editUser,
  deleteUser,
  getFollowers,
  getFollowing,
  followUser,
  unFollowUser,
  addBookmark,
  deleteBookmark,
  getBookmarks,
  searchUser,
} from '../controller/userController';
import { authenticateJWT } from '../utils/verifyToken';
import { validateObjectId } from '../middlewares/validateObjectId';
import { validateRequest } from '../middlewares/validateRequest';
import { validateEditProfile } from '../middlewares/validateUser';
import { validateLogin } from '../middlewares/validateAuth';

const app = express.Router();

// User Routes
app.get('/', authenticateJWT, getUser);
app.put('/', authenticateJWT, validateEditProfile, validateRequest, editUser);
app.delete('/', authenticateJWT, deleteUser);
app.get('/search', searchUser);

// Follow Routes
app.get('/:id/followers', validateObjectId, getFollowers);
app.get('/:id/following', validateObjectId, getFollowing);
app.put('/follow/:id', validateObjectId, followUser);
app.delete('/unfollow/:id', validateObjectId, unFollowUser);

// Bookmark Routes
app.get('/bookmark', getBookmarks);
app.put('/bookmark/:blogId', addBookmark);
app.delete('/bookmark/:blogId', deleteBookmark);

app.get('/:id', validateObjectId, validateRequest, getUserById);

export default app;
