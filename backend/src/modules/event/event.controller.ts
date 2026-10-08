import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as eventService from './event.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const getEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventService.getAllEvents(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.EVENT.FETCHED_ALL,
    data: result.events,
    meta: result.meta
  });
});

export const getEvent = catchAsync(async (req: Request, res: Response) => {
  const eventId = String(req.params.id);
  const event = await eventService.getEventById(eventId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.EVENT.FETCHED_ONE,
    data: event
  });
});

export const createEvent = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const event = await eventService.createEvent(req.body, req.user._id.toString());

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.EVENT.CREATED,
    data: event
  });
});

export const rsvpEvent = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const eventId = String(req.params.id);
  const rsvp = await eventService.rsvpForEvent(
    eventId,
    req.user._id.toString(),
    req.user.universityId
  );

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.EVENT.RSVP_SUCCESS,
    data: rsvp
  });
});

export const getMyPasses = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const passes = await eventService.getMyPasses(req.user._id.toString());

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.EVENT.PASSES_FETCHED,
    data: passes
  });
});
