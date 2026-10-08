import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as lostFoundService from './lost-found.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const getListings = catchAsync(async (req: Request, res: Response) => {
  const result = await lostFoundService.getLostFoundListings(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.LOST_FOUND.FETCHED_ALL,
    data: result.items,
    meta: result.meta
  });
});

export const getListing = catchAsync(async (req: Request, res: Response) => {
  const itemId = String(req.params.id);
  const item = await lostFoundService.getLostFoundById(itemId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.LOST_FOUND.FETCHED_ONE,
    data: item
  });
});

export const createListing = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const item = await lostFoundService.createLostFoundItem(
    req.body,
    req.user._id.toString()
  );

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.LOST_FOUND.CREATED,
    data: item
  });
});

export const resolveListing = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const itemId = String(req.params.id);
  const item = await lostFoundService.resolveLostFoundItem(
    itemId,
    req.user._id.toString(),
    req.user.role
  );

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.LOST_FOUND.RESOLVED,
    data: item
  });
});
