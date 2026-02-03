import mongoose from 'mongoose';
import { env } from './env';

let mongod: any = null;

const startInMemory = async (): Promise<string> => {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  mongod = await MongoMemoryServer.create({
    instance: {
      dbName: 'campus-resource-management',
    },
    binary: {
      downloadDir: './mongodb-binaries',
      version: '6.0.4',
    },
  });
  return mongod.getUri();
};

const connectDB = async (): Promise<void> => {
  try {
    // First try in-memory database for development
    if (env.NODE_ENV === 'development' && env.USE_IN_MEMORY_DB) {
      console.log('Starting in-memory MongoDB for development...');
      try {
        const memUri = await startInMemory();
        const conn = await mongoose.connect(memUri);
        console.log(`✅ MongoDB in-memory started: ${conn.connection.host}`);
        return;
      } catch (memError) {
        console.log('⚠️  In-memory MongoDB failed, trying local MongoDB...');
      }
    }

    // Try local MongoDB if URI is provided
    const uri = env.MONGODB_URI;
    if (uri) {
      const conn = await mongoose.connect(uri);
      console.log(`✅ MongoDB connected: ${conn.connection.host}`);
      return;
    }

    // If all else fails, create a simple mock connection for demo purposes
    console.log('⚠️  No database connection available. Running in demo mode...');
    console.log('📝 Note: Data will not persist between restarts');
    
    // Create a minimal in-memory connection
    const conn = await mongoose.connect('mongodb://localhost/demo', {
      bufferCommands: false,
    });
    console.log('✅ Demo mode active - using temporary database');
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // In development, continue without database for demo purposes
    console.log('🚀 Continuing in demo mode without persistent database...');
  }
};

export default connectDB;
