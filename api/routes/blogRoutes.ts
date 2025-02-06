import express from 'express';

const app = express.Router();

app.get('/', (req, res) => {
  res.json({ message: 'GET Blogs' });
});

export default app;
