import express from 'express';

const app = express.Router();

app.get('/', (req, res) => {
  res.json({ message: 'GET LIkes' });
});

export default app;
