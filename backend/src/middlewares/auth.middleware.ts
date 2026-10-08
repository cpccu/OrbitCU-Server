import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError';
import { jwtConfig } from '../config/jwt';
import { User } from '../modules/auth/auth.model';
import { MESSAGES } from '../constants/messages';
import { IAuthUser } from '../types/express';

interface JwtPayloadWithUser {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    let decoded: JwtPayloadWithUser;
    try {
      decoded = jwt.verify(token, jwtConfig.secret) as JwtPayloadWithUser;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError(MESSAGES.AUTH.TOKEN_EXPIRED, 401);
      }
      throw new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401);
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    req.user = {
      _id: user._id,
      name: user.name,
      universityId: user.universityId,
      email: user.email,
      department: user.department,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } as IAuthUser;

    next();
  } catch (error) {
    next(error);
  }
};
