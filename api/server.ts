import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerDocument from './swagger.json';

const app = express();

const options = {
  swaggerDefinition: swaggerDocument,
  apis: ['./server.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

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

// Start the Server
app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
