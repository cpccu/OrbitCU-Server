import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as complaintService from './complaint.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const createComplaint = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const complaint = await complaintService.createComplaint(
    req.body,
    req.user._id.toString()
  );

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.COMPLAINT.CREATED,
    data: complaint
  });
});

export const trackComplaint = catchAsync(async (req: Request, res: Response) => {
  const ticketId = String(req.params.ticketId);
  const result = await complaintService.trackComplaintByTicketId(ticketId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.COMPLAINT.TRACK_FETCHED,
    data: result
  });
});

export const getMyComplaints = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const complaints = await complaintService.getMyComplaints(req.user._id.toString());

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.COMPLAINT.FETCHED_MY,
    data: complaints
  });
});

export const getAllComplaints = catchAsync(async (req: Request, res: Response) => {
  const result = await complaintService.getAllComplaints(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.COMPLAINT.FETCHED_ALL,
    data: result.complaints,
    meta: result.meta
  });
});

export const updateComplaintStatus = catchAsync(async (req: Request, res: Response) => {
  const complaintId = String(req.params.id);
  const updatedComplaint = await complaintService.updateComplaintStatus(
    complaintId,
    req.body
  );

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.COMPLAINT.STATUS_UPDATED,
    data: updatedComplaint
  });
});
