import { z } from 'zod';
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES, PATTERNS } from '../../constants/enums';

export const createComplaintSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  category: z.enum(COMPLAINT_CATEGORIES),
  description: z.string().min(5, 'Description must be at least 5 characters long'),
  locationRoom: z.string().min(2, 'Room/Location is required'),
  isAnonymous: z.boolean().optional().default(false)
});

export const updateComplaintStatusSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES),
  adminRemarks: z.string().optional().default('')
});

export const complaintFilterSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES).optional(),
  category: z.enum(COMPLAINT_CATEGORIES).optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const ticketIdParamSchema = z.object({
  ticketId: z.string().regex(PATTERNS.TICKET_ID, 'Ticket ID must match format CU-TICK-XXXX')
});

export const complaintIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});
