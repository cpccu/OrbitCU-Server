import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDatabase = async (customUri?: string): Promise<typeof mongoose> => {
  const uri = customUri || env.MONGODB_URI;

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(uri, {
      autoIndex: true
    });

    logger.info(`✅ MongoDB Connected Successfully: ${connection.connection.host}/${connection.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost. Reconnecting...');
    });

    return connection;
  } catch (error) {
    logger.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected cleanly');
  } catch (error) {
    logger.error('Error disconnecting MongoDB:', error);
    throw error;
  }
};
