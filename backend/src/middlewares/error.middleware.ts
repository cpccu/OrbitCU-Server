import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import { MESSAGES } from '../constants/messages';
import { env } from '../config/env';

export const globalErrorHandler: ErrorRequestHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || MESSAGES.SERVER.INTERNAL_ERROR;
  let errors = err.errors;

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = Object.values(err.errors || {}).map((item: any) => ({
      field: item.path,
      message: item.message
    }));
    message = `${MESSAGES.SERVER.VALIDATION_ERROR}: ${validationErrors.map((e) => e.message).join(', ')}`;
    errors = validationErrors;
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedFields = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate field value entered: ${duplicatedFields}. Please use another value.`;
    errors = err.keyValue;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = MESSAGES.AUTH.TOKEN_INVALID;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = MESSAGES.AUTH.TOKEN_EXPIRED;
  }

  // Log 500 errors
  if (statusCode >= 500) {
    logger.error(`[Unhandled Error] ${err.stack || err}`);
  }

  const responseBody: any = {
    success: false,
    statusCode,
    message,
    ...(errors !== undefined && { errors }),
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  };

  res.status(statusCode).json(responseBody);
};
