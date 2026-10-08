import { FilterQuery, Types } from 'mongoose';
import { FAQ } from './helpdesk.model';
import { IFAQDocument } from './helpdesk.interface';
import { CreateFAQInput, FAQFilterQuery, UpdateFAQInput } from './helpdesk.types';
import { AppError } from '../../utils/AppError';
import { MESSAGES } from '../../constants/messages';

export const getFAQs = async (query: FAQFilterQuery) => {
  const filter: FilterQuery<IFAQDocument> = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { question: searchRegex },
      { answer: searchRegex }
    ];
  }

  // Pinned FAQs appear first, then newest
  const faqs = await FAQ.find(filter)
    .sort({ isPinned: -1, createdAt: -1 })
    .populate('updatedBy', 'name email department');

  return faqs;
};

export const getFAQById = async (id: string): Promise<IFAQDocument> => {
  const faq = await FAQ.findById(id).populate('updatedBy', 'name email department');
  if (!faq) {
    throw new AppError(MESSAGES.HELPDESK.NOT_FOUND, 404);
  }
  return faq;
};

export const createFAQ = async (
  payload: CreateFAQInput,
  userId: string
): Promise<IFAQDocument> => {
  const faq = await FAQ.create({
    ...payload,
    updatedBy: new Types.ObjectId(userId)
  });

  return await faq.populate('updatedBy', 'name email department');
};

export const updateFAQ = async (
  id: string,
  payload: UpdateFAQInput,
  userId: string
): Promise<IFAQDocument> => {
  const faq = await FAQ.findByIdAndUpdate(
    id,
    {
      ...payload,
      updatedBy: new Types.ObjectId(userId)
    },
    { new: true, runValidators: true }
  ).populate('updatedBy', 'name email department');

  if (!faq) {
    throw new AppError(MESSAGES.HELPDESK.NOT_FOUND, 404);
  }

  return faq;
};

export const deleteFAQ = async (id: string): Promise<IFAQDocument> => {
  const faq = await FAQ.findByIdAndDelete(id);
  if (!faq) {
    throw new AppError(MESSAGES.HELPDESK.NOT_FOUND, 404);
  }

  return faq;
};
