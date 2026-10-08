import { z } from 'zod';
import { FAQ_CATEGORIES } from '../../constants/enums';

export const createFAQSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long'),
  answer: z.string().min(5, 'Answer must be at least 5 characters long'),
  category: z.enum(FAQ_CATEGORIES),
  isPinned: z.boolean().optional().default(false),
  referenceUrl: z.string().url('Invalid URL format').or(z.literal('')).optional()
});

export const updateFAQSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters long').optional(),
  answer: z.string().min(5, 'Answer must be at least 5 characters long').optional(),
  category: z.enum(FAQ_CATEGORIES).optional(),
  isPinned: z.boolean().optional(),
  referenceUrl: z.string().url('Invalid URL format').or(z.literal('')).optional()
});

export const faqQuerySchema = z.object({
  category: z.enum(FAQ_CATEGORIES).optional(),
  search: z.string().optional()
});

export const faqIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});
