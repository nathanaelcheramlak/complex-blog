import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../models/user';
import '../models/blog';
import '../models/comment';
import '../models/like';
import '../models/bookmark';

dotenv.config();

const connectDB = async () => {
  const DB_URI = process.env.MONGO_DB_URI || '';
  try {
    await mongoose.connect(DB_URI as string);
    console.log('Database connected successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error(`An unknown error occurred.`);
    }
    process.exit(1);
  }
};

export default connectDB;
