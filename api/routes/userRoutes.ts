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
} from '../controller/userController';

const app = express.Router();

// User Routes
app.get('/', getUser);
app.get('/:id', getUserById);
app.put('/', editUser);
app.delete('/', deleteUser);

// Follow Routes
app.get('/:id/followers', getFollowers);
app.get('/:id/following', getFollowing);
app.put('/follow/:id', followUser);
app.delete('/unfollow/:id', unFollowUser);

// Bookmark Routes
app.get('/bookmark', getBookmarks);
app.put('/bookmark/:blogId', addBookmark);
app.delete('/bookmark/:blogId', deleteBookmark);

export default app;
