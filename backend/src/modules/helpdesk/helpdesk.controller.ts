import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import * as helpdeskService from './helpdesk.service';
import { MESSAGES } from '../../constants/messages';
import { AppError } from '../../utils/AppError';

export const getFAQs = catchAsync(async (req: Request, res: Response) => {
  const faqs = await helpdeskService.getFAQs(req.query as any);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.HELPDESK.FETCHED_ALL,
    data: faqs
  });
});

export const getFAQ = catchAsync(async (req: Request, res: Response) => {
  const faqId = String(req.params.id);
  const faq = await helpdeskService.getFAQById(faqId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.HELPDESK.FETCHED_ONE,
    data: faq
  });
});

export const createFAQ = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const faq = await helpdeskService.createFAQ(req.body, req.user._id.toString());

  return sendResponse(res, {
    statusCode: 201,
    message: MESSAGES.HELPDESK.CREATED,
    data: faq
  });
});

export const updateFAQ = catchAsync(async (req: Request, res: Response) => {
  if (!req.user?._id) {
    throw new AppError(MESSAGES.AUTH.UNAUTHORIZED, 401);
  }

  const faqId = String(req.params.id);
  const faq = await helpdeskService.updateFAQ(
    faqId,
    req.body,
    req.user._id.toString()
  );

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.HELPDESK.UPDATED,
    data: faq
  });
});

export const deleteFAQ = catchAsync(async (req: Request, res: Response) => {
  const faqId = String(req.params.id);
  const faq = await helpdeskService.deleteFAQ(faqId);

  return sendResponse(res, {
    statusCode: 200,
    message: MESSAGES.HELPDESK.DELETED,
    data: faq
  });
});
