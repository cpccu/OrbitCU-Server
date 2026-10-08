import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDatabase = async (customUri?: string): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const uri = customUri || env.MONGODB_URI;

  cachedPromise = (async () => {
    try {
      mongoose.set('strictQuery', true);

      const connection = await mongoose.connect(uri, {
        autoIndex: env.NODE_ENV !== 'production',
        serverSelectionTimeoutMS: 8000
      });

      logger.info(`MongoDB Connected Successfully: ${connection.connection.host}/${connection.connection.name}`);

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection lost. Reconnecting...');
        cachedPromise = null;
      });

      return connection;
    } catch (error) {
      cachedPromise = null;
      logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  })();

  return cachedPromise;
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    cachedPromise = null;
    await mongoose.connection.close();
    logger.info('MongoDB disconnected cleanly');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
    throw error;
  }
};
