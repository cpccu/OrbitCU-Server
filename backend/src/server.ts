import http from 'http';
import { app } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

let server: http.Server;

const bootstrap = async () => {
  try {
    // 1. Establish MongoDB connection
    await connectDatabase();

    // 2. Start HTTP Server
    server = app.listen(env.PORT, () => {
      logger.info(`🚀 CampusOS Backend Server running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
      logger.info(`🔗 API Base URL: http://localhost:${env.PORT}/api`);
      logger.info(`🩺 Health Check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap CampusOS backend:', error);
    process.exit(1);
  }
};

const handleShutdown = async (signal: string) => {
  logger.warn(`Received ${signal}. Initiating graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed successfully');
      try {
        await disconnectDatabase();
        logger.info('Process termination complete. Goodbye!');
        process.exit(0);
      } catch (err) {
        logger.error('Error during database disconnect:', err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('unhandledRejection', (reason: any) => {
  logger.error('UNHANDLED REJECTION! Shutting down gracefully...', reason);
  handleShutdown('unhandledRejection');
});

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down immediately...', err);
  process.exit(1);
});

// Run bootstrap
bootstrap();

export default app;
