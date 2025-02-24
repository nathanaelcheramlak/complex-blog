import express from 'express';
import {
  getUsers,
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

const app = express.Router();

// User Routes
app.get('/', authenticateJWT, getUsers);
app.put('/', authenticateJWT, validateEditProfile, validateRequest, editUser);
app.delete('/', authenticateJWT, deleteUser);
app.get('/search', searchUser);

// Follow Routes
app.get('/:id/followers', validateObjectId, getFollowers);
app.get('/:id/following', validateObjectId, getFollowing);
app.put('/follow/:id', authenticateJWT, validateObjectId, followUser);
app.delete('/unfollow/:id', authenticateJWT, validateObjectId, unFollowUser);

// Bookmark Routes
app.get('/:id/bookmarks', getBookmarks);
app.put('/bookmark/:blogId', authenticateJWT, addBookmark);
app.delete('/bookmark/:blogId', authenticateJWT, deleteBookmark);

app.get('/:id', validateObjectId, validateRequest, getUserById);

export default app;
