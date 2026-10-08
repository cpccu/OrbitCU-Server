import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../constants/roles';
import { AppError } from '../utils/AppError';
import { MESSAGES } from '../constants/messages';

export const hasRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError(MESSAGES.AUTH.FORBIDDEN, 403));
    }

    next();
  };
};
