import mongoose from 'mongoose';
import { env } from './env';

let mongod: any = null;

const startInMemory = async (): Promise<string> => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
};

const connectDB = async (): Promise<void> => {
  const uri = env.MONGODB_URI;
  try {
    if (uri) {
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    }

    if (env.NODE_ENV === 'development' && env.USE_IN_MEMORY_DB) {
      console.log('No MONGODB_URI provided — starting in-memory MongoDB for development...');
      const memUri = await startInMemory();
      const conn = await mongoose.connect(memUri);
      console.log(`MongoDB in-memory started: ${conn.connection.host}`);
      return;
    }

    throw new Error('MONGODB_URI is not defined in environment');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

export default connectDB;
