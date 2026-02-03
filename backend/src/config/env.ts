import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';

if (!process.env.JWT_SECRET) {
  throw new Error('Missing required environment variable: JWT_SECRET');
}

const useInMemoryDefault = NODE_ENV === 'development';

export const env = {
  NODE_ENV,
  PORT: parseInt(process.env.PORT ?? '4000', 10),
  MONGODB_URI: process.env.MONGODB_URI ?? undefined,
  USE_IN_MEMORY_DB: process.env.USE_IN_MEMORY_DB
    ? process.env.USE_IN_MEMORY_DB === 'true'
    : useInMemoryDefault,
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '7d',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
} as const;
