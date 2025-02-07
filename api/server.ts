import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.json';

import connectDB from './config/db';
import {
  authRoutes,
  userRoutes,
  blogRoutes,
  bookmarkRoutes,
  commentRoutes,
  likeRoutes,
} from './routes/routes';

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// CORS Config
app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }),
);
app.options('*', cors()); // Handle preflight requests

// Config
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Swagger Config
const options = {
  swaggerDefinition: swaggerDocument,
  apis: ['./server.ts', './routes/*.ts'], // Path to the API docs
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', cors(), swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     responses:
 *       200:
 *         description: Returns a welcome message.
 */
app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/comments', commentRoutes);
app.use('/likes', likeRoutes);

// Start the Server
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
