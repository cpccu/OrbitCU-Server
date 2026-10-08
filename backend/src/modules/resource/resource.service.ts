import { FilterQuery, Types } from 'mongoose';
import { Resource } from './resource.model';
import { IResourceDocument } from './resource.interface';
import {
  CreateResourceInput,
  ResourceFilterQuery,
  ResourceSearchQuery
} from './resource.types';
import { AppError } from '../../utils/AppError';
import { calculatePagination, getPaginationMeta } from '../../utils/pagination';
import { MESSAGES } from '../../constants/messages';

export const getResources = async (query: ResourceFilterQuery) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination({
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    sortBy: query.sortBy || 'createdAt',
    sortOrder: query.sortOrder || 'desc'
  });

  const filter: FilterQuery<IResourceDocument> = {};

  if (query.department) {
    filter.department = query.department;
  }
  if (query.courseCode) {
    filter.courseCode = query.courseCode.trim().toUpperCase();
  }
  if (query.semesterTerm) {
    filter.semesterTerm = query.semesterTerm;
  }
  if (query.session) {
    filter.academicSession = new RegExp(query.session.trim(), 'i');
  }

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('uploadedBy', 'name email universityId department'),
    Resource.countDocuments(filter)
  ]);

  return {
    resources,
    meta: getPaginationMeta(total, page, limit)
  };
};

export const searchResources = async (query: ResourceSearchQuery) => {
  const { page, limit, skip } = calculatePagination({
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
    sortBy: 'score',
    sortOrder: 'desc'
  });

  const q = (query.q || '').trim();
  if (!q) {
    return {
      resources: [],
      meta: getPaginationMeta(0, page, limit)
    };
  }

  // 1. Try text score search
  let resources = await Resource.find(
    { $text: { $search: q } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' }, upvotes: -1 })
    .skip(skip)
    .limit(limit)
    .populate('uploadedBy', 'name email universityId department');

  let total = await Resource.countDocuments({ $text: { $search: q } });

  // 2. If no text search results, or for partial course codes (e.g., "221" matching "CSE-221"), fallback to regex
  if (resources.length === 0) {
    const regexPattern = new RegExp(q, 'i');
    const regexFilter: FilterQuery<IResourceDocument> = {
      $or: [
        { courseCode: regexPattern },
        { courseTitle: regexPattern },
        { title: regexPattern }
      ]
    };

    [resources, total] = await Promise.all([
      Resource.find(regexFilter)
        .sort({ upvotes: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('uploadedBy', 'name email universityId department'),
      Resource.countDocuments(regexFilter)
    ]);
  }

  return {
    resources,
    meta: getPaginationMeta(total, page, limit)
  };
};

export const createResource = async (
  payload: CreateResourceInput,
  userId: string
): Promise<IResourceDocument> => {
  const resource = await Resource.create({
    ...payload,
    courseCode: payload.courseCode.toUpperCase().trim(),
    uploadedBy: new Types.ObjectId(userId)
  });

  return await resource.populate('uploadedBy', 'name email universityId department');
};

export const upvoteResource = async (resourceId: string): Promise<IResourceDocument> => {
  const updatedResource = await Resource.findByIdAndUpdate(
    resourceId,
    { $inc: { upvotes: 1 } },
    { new: true }
  ).populate('uploadedBy', 'name email universityId department');

  if (!updatedResource) {
    throw new AppError(MESSAGES.RESOURCE.NOT_FOUND, 404);
  }

  return updatedResource;
};

export const getResourceById = async (resourceId: string): Promise<IResourceDocument> => {
  const resource = await Resource.findById(resourceId).populate(
    'uploadedBy',
    'name email universityId department'
  );

  if (!resource) {
    throw new AppError(MESSAGES.RESOURCE.NOT_FOUND, 404);
  }

  return resource;
};
