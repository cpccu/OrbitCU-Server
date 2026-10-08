import { FilterQuery, Types } from 'mongoose';
import { Complaint } from './complaint.model';
import { IComplaintDocument } from './complaint.interface';
import {
  ComplaintFilterQuery,
  CreateComplaintInput,
  PublicComplaintTrackInfo,
  UpdateComplaintStatusInput
} from './complaint.types';
import { AppError } from '../../utils/AppError';
import { calculatePagination, getPaginationMeta } from '../../utils/pagination';
import { generateComplaintTicketId } from '../../utils/crypto';
import { MESSAGES } from '../../constants/messages';

export const createComplaint = async (
  payload: CreateComplaintInput,
  userId: string
): Promise<IComplaintDocument> => {
  // Generate unique ticket ID
  let ticketId = generateComplaintTicketId();
  let attempts = 0;
  while (await Complaint.findOne({ ticketId })) {
    ticketId = generateComplaintTicketId();
    attempts++;
    if (attempts > 10) {
      ticketId = `CU-TICK-${Date.now().toString().slice(-4)}`;
      break;
    }
  }

  // If isAnonymous: true, strip submittedBy before database write
  const submittedBy = payload.isAnonymous ? null : new Types.ObjectId(userId);

  const complaint = await Complaint.create({
    ticketId,
    title: payload.title,
    category: payload.category,
    description: payload.description,
    locationRoom: payload.locationRoom,
    isAnonymous: Boolean(payload.isAnonymous),
    submittedBy,
    status: 'SUBMITTED',
    adminRemarks: ''
  });

  return complaint;
};

export const trackComplaintByTicketId = async (
  ticketId: string
): Promise<PublicComplaintTrackInfo> => {
  const complaint = await Complaint.findOne({ ticketId }).select(
    'ticketId title category locationRoom status adminRemarks createdAt updatedAt -_id'
  );

  if (!complaint) {
    throw new AppError(MESSAGES.COMPLAINT.NOT_FOUND, 404);
  }

  return {
    ticketId: complaint.ticketId,
    title: complaint.title,
    category: complaint.category,
    locationRoom: complaint.locationRoom,
    status: complaint.status,
    adminRemarks: complaint.adminRemarks,
    createdAt: complaint.createdAt!,
    updatedAt: complaint.updatedAt!
  };
};

export const getMyComplaints = async (userId: string): Promise<IComplaintDocument[]> => {
  // Only non-anonymous complaints submitted by the user
  const complaints = await Complaint.find({
    submittedBy: new Types.ObjectId(userId),
    isAnonymous: false
  }).sort({ createdAt: -1 });

  return complaints;
};

export const updateComplaintStatus = async (
  id: string,
  payload: UpdateComplaintStatusInput
): Promise<IComplaintDocument> => {
  const updateData: any = {
    status: payload.status
  };

  if (payload.adminRemarks !== undefined) {
    updateData.adminRemarks = payload.adminRemarks;
  }

  const complaint = await Complaint.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  }).populate('submittedBy', 'name email universityId department');

  if (!complaint) {
    throw new AppError(MESSAGES.COMPLAINT.NOT_FOUND, 404);
  }

  return complaint;
};

export const getAllComplaints = async (query: ComplaintFilterQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination({
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const filter: FilterQuery<IComplaintDocument> = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.category) {
    filter.category = query.category;
  }

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('submittedBy', 'name email universityId department'),
    Complaint.countDocuments(filter)
  ]);

  return {
    complaints,
    meta: getPaginationMeta(total, page, limit)
  };
};
