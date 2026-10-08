import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as resourceService from './resource.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const getResources = catchAsync(async (req: Request, res: Response) => {
  const result = await resourceService.getResources(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.RESOURCE.FETCHED_ALL,
    data: result.resources,
    meta: result.meta
  });
});

export const searchResources = catchAsync(async (req: Request, res: Response) => {
  const result = await resourceService.searchResources(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.RESOURCE.SEARCH_SUCCESS,
    data: result.resources,
    meta: result.meta
  });
});

export const getResource = catchAsync(async (req: Request, res: Response) => {
  const resourceId = String(req.params.id);
  const resource = await resourceService.getResourceById(resourceId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.RESOURCE.FETCHED_ONE,
    data: resource
  });
});

export const createResource = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const resource = await resourceService.createResource(
    req.body,
    req.user._id.toString()
  );

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.RESOURCE.CREATED,
    data: resource
  });
});

export const upvoteResource = catchAsync(async (req: Request, res: Response) => {
  const resourceId = String(req.params.id);
  const resource = await resourceService.upvoteResource(resourceId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.RESOURCE.UPVOTED,
    data: resource
  });
});
