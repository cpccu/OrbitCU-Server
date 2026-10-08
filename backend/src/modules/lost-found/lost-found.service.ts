import { FilterQuery, Types } from 'mongoose';
import { LostFound } from './lost-found.model';
import { ILostFoundDocument } from './lost-found.interface';
import { CreateLostFoundInput, LostFoundFilterQuery } from './lost-found.types';
import { AppError } from '../../utils/AppError';
import { calculatePagination, getPaginationMeta } from '../../utils/pagination';
import { MESSAGES } from '../../constants/messages';
import { USER_ROLES, UserRole } from '../../constants/roles';

export const getLostFoundListings = async (query: LostFoundFilterQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination({
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const filter: FilterQuery<ILostFoundDocument> = {};

  // Status defaults to 'OPEN' unless 'ALL' is specified or a custom status is passed
  if (!query.status || query.status.toUpperCase() === 'OPEN') {
    filter.status = 'OPEN';
  } else if (query.status.toUpperCase() !== 'ALL') {
    filter.status = query.status.toUpperCase();
  }

  if (query.type) {
    filter.type = query.type;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { locationFoundOrLost: searchRegex }
    ];
  }

  const [items, total] = await Promise.all([
    LostFound.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('reporterId', 'name email universityId department'),
    LostFound.countDocuments(filter)
  ]);

  return {
    items,
    meta: getPaginationMeta(total, page, limit)
  };
};

export const getLostFoundById = async (id: string): Promise<ILostFoundDocument> => {
  const item = await LostFound.findById(id).populate(
    'reporterId',
    'name email universityId department'
  );
  if (!item) {
    throw new AppError(MESSAGES.LOST_FOUND.NOT_FOUND, 404);
  }
  return item;
};

export const createLostFoundItem = async (
  payload: CreateLostFoundInput,
  reporterId: string
): Promise<ILostFoundDocument> => {
  const item = await LostFound.create({
    ...payload,
    dateOfIncident: new Date(payload.dateOfIncident),
    reporterId: new Types.ObjectId(reporterId)
  });

  return await item.populate('reporterId', 'name email universityId department');
};

export const resolveLostFoundItem = async (
  id: string,
  userId: string,
  userRole: UserRole
): Promise<ILostFoundDocument> => {
  const item = await LostFound.findById(id);
  if (!item) {
    throw new AppError(MESSAGES.LOST_FOUND.NOT_FOUND, 404);
  }

  // Allowed for the original reporter or UNIVERSITY_ADMIN
  const isReporter = item.reporterId.toString() === userId;
  const isUniversityAdmin = userRole === USER_ROLES.UNIVERSITY_ADMIN;

  if (!isReporter && !isUniversityAdmin) {
    throw new AppError(MESSAGES.LOST_FOUND.UNAUTHORIZED_RESOLVE, 403);
  }

  item.status = 'RESOLVED';
  await item.save();

  return await item.populate('reporterId', 'name email universityId department');
};
