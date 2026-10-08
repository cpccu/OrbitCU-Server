import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as authService from './auth.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.AUTH.REGISTER_SUCCESS,
    data: result
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.loginUser(req.body);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.AUTH.LOGIN_SUCCESS,
    data: result
  });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const result = await authService.getMeUser(req.user._id.toString());

  return sendResponse(res, {
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: result
  });
});
