import { Response } from 'express';

export interface IResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: IResponseMeta;
}

export const sendResponse = <T>(
  res: Response,
  payload: {
    statusCode: number;
    message: string;
    data?: T;
    meta?: IResponseMeta;
  }
): Response => {
  const responseBody: IApiResponse<T> = {
    success: true,
    statusCode: payload.statusCode,
    message: payload.message,
    ...(payload.data !== undefined && { data: payload.data }),
    ...(payload.meta !== undefined && { meta: payload.meta })
  };

  return res.status(payload.statusCode).json(responseBody);
};
