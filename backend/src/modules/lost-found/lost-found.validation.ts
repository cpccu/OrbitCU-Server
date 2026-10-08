import { z } from 'zod';
import {
  LOST_FOUND_CATEGORIES,
  LOST_FOUND_TYPES
} from '../../constants/enums';

export const createLostFoundSchema = z.object({
  type: z.enum(LOST_FOUND_TYPES),
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  category: z.enum(LOST_FOUND_CATEGORIES),
  locationFoundOrLost: z.string().min(2, 'Location is required'),
  dateOfIncident: z
    .string()
    .datetime()
    .or(z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid date format')),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  imageUrl: z.string().url('Invalid image URL format').or(z.literal('')).optional(),
  contactNumberOrEmail: z.string().min(3, 'Contact details are required')
});

export const lostFoundFilterSchema = z.object({
  status: z.string().optional(),
  type: z.enum(LOST_FOUND_TYPES).optional(),
  category: z.enum(LOST_FOUND_CATEGORIES).optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const lostFoundIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});
