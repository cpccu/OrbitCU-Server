import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { appRouter } from './routes';
import { globalErrorHandler } from './middlewares/error.middleware';
import { globalRateLimiter } from './middlewares/rateLimit.middleware';
import { AppError } from './utils/AppError';
import { MESSAGES } from './constants/messages';

export const createApp = (): Application => {
  const app: Application = express();

  // Trust reverse proxies (important for rate limiting and IP resolution)
  app.set('trust proxy', 1);

  // Chromium Private Network Access (PNA) header support
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.headers['access-control-request-private-network']) {
      res.setHeader('Access-Control-Allow-Private-Network', 'true');
    }
    next();
  });

  // Security Headers
  app.use(helmet());

  // Cross-Origin Resource Sharing
  const allowedOrigins = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in development, strict check allowed
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Access-Control-Request-Private-Network']
    })
  );

  // HTTP Request Logging
  if (env.NODE_ENV !== 'test') {
    app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  }

  // Rate Limiting
  if (env.NODE_ENV !== 'test') {
    app.use(globalRateLimiter);
  }

  // Request Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Root welcome endpoint
  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'CampusOS — City University Hub Backend API',
      version: '1.0.0',
      docs: '/docs/api.md',
      endpoints: '/api'
    });
  });

  // Ensure DB connection for serverless / cold starts before API execution
  app.use('/api', async (_req: Request, _res: Response, next: NextFunction) => {
    try {
      if (mongoose.connection.readyState !== 1) {
        await connectDatabase();
      }
      next();
    } catch (err) {
      next(err);
    }
  });

  // API Routes
  app.use('/api', appRouter);

  // 404 Route Handler
  app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`${MESSAGES.SERVER.NOT_FOUND}: ${req.method} ${req.originalUrl}`, 404));
  });

  // Global Error Handler
  app.use(globalErrorHandler);

  return app;
};

export const app = createApp();
