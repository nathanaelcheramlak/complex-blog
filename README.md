# Complex-Blog

Complex-Blog is a backend for a blog application, designed to be specialized for a specific domain in the future. Built with **Express**, **Node.js**, **MongoDB**, and various other technologies, it provides an API for managing user authentication, blogs, comments, likes, bookmarks, and user profiles.

---

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JWT** (JSON Web Tokens)
- **Joi** (Validation)
- **Nodemailer** (Email handling)
- **Swagger** (API documentation)
- **Jest** (Testing)

---

## Features

- **User Authentication & Authorization**

  - Register, login, logout, forgot/reset password
  - JWT-based authentication
  - Email verification

- **Blog Management**

  - Create, update, delete blogs
  - Fetch blogs by ID, user, or all blogs
  - Like and comment on blogs

- **User Profile Management**

  - Edit profile information
  - Follow/unfollow users
  - Add/remove blogs to/from bookmarks

- **Comments and Likes**
  - Create, update, delete comments
  - Add/remove likes on blogs

---

## Installation

Follow these steps to set up your project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/nathanaelcheramlak/complex-blog.git
cd complex-blog/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
MONGO_DB_URI=<your_mongo_db_uri>
NODE_ENV=development
CORS_ORIGIN=<your_frontend_url>
BACKEND_URL=<your_backend_url>
FRONTEND_URL=<your_frontend_url>
JWT_SECRET=<your_jwt_secret>
EMAIL=<your_email>
EMAIL_PASSWORD=<your_email_password>
```

### 4. Run the Application

Development Mode (with nodemon)

```bash
npm run server
```

Production Mode

```bash
npm start
```

# API Endpoints

## Authentication Routes

- **POST** `/login`: Log in a user (requires email and password)
- **POST** `/register`: Register a new user (requires email, username, and password)
- **POST** `/forgot-password`: Request a password reset email (requires email)
- **POST** `/reset-password`: Reset the password (requires token and new password)
- **GET** `/verify-email`: Verify email address (requires token)
- **GET** `/me`: Get current authenticated user's profile

## Blog Routes

- **GET** `/`: Get all blogs
- **GET** `/:id`: Get a specific blog by ID
- **GET** `/user/:userId`: Get blogs by a specific user
- **GET** `/myblogs`: Get blogs of the authenticated user
- **POST** `/`: Create a new blog (authentication required)
- **PUT** `/:id`: Update a blog (authentication required)
- **DELETE** `/:id`: Delete a blog (authentication required)

## Likes

- **GET** `/:blogId/likes`: Get likes on a specific blog
- **POST** `/:blogId/likes`: Like a blog (authentication required)
- **DELETE** `/:blogId/likes/:id`: Remove like from a blog (authentication required)

## Comments

- **GET** `/:blogId/comments`: Get all comments for a blog
- **GET** `/:blogId/comments/:id`: Get a specific comment by ID
- **POST** `/:blogId/comments`: Add a new comment to a blog (authentication required)
- **PUT** `/:blogId/comments/:id`: Update a comment (authentication required)
- **DELETE** `/:blogId/comments/:id`: Delete a comment (authentication required)

## User Routes

- **GET** `/`: Get all users (authentication required)
- **PUT** `/`: Edit the authenticated user's profile (authentication required)
- **DELETE** `/`: Delete the authenticated user's account (authentication required)
- **GET** `/search`: Search for a user by username

## Follow Routes

- **GET** `/:id/followers`: Get all followers of a user
- **GET** `/:id/following`: Get all users a specific user is following
- **PUT** `/follow/:id`: Follow a user (authentication required)
- **DELETE** `/unfollow/:id`: Unfollow a user (authentication required)

## Bookmark Routes

- **GET** `/:id/bookmarks`: Get a user's bookmarks
- **PUT** `/bookmark/:blogId`: Add a blog to bookmarks (authentication required)
- **DELETE** `/bookmark/:blogId`: Remove a blog from bookmarks (authentication required)

## Contribution

- Nathanael Cheramlak
- Daniel Yohannes

Contributions are welcome! If you'd like to improve or extend this project, feel free to fork the repository and create a pull request.

## License

This project is licensed under the MIT License.
