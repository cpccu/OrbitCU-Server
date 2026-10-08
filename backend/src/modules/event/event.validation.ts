import { z } from 'zod';
import { EVENT_CATEGORIES, EVENT_TIME_FRAMES } from '../../constants/enums';

export const createEventSchema = z
  .object({
    title: z.string().min(3, 'Event title must be at least 3 characters long'),
    clubName: z.string().min(2, 'Club name is required'),
    category: z.enum(EVENT_CATEGORIES),
    description: z.string().min(10, 'Description must be at least 10 characters long'),
    bannerUrl: z.string().url('Invalid banner URL format'),
    venue: z.string().min(2, 'Venue is required'),
    eventDate: z.string().datetime().or(z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid event date')),
    registrationDeadline: z
      .string()
      .datetime()
      .or(z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid registration deadline')),
    maxCapacity: z.number().int().positive('Max capacity must be greater than 0'),
    isInterUniversity: z.boolean().optional().default(false)
  })
  .refine(
    (data) => new Date(data.registrationDeadline).getTime() < new Date(data.eventDate).getTime(),
    {
      message: 'Registration deadline must be before the event date',
      path: ['registrationDeadline']
    }
  );

export const eventQuerySchema = z.object({
  category: z.enum(EVENT_CATEGORIES).optional(),
  timeFrame: z.enum(EVENT_TIME_FRAMES).optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const eventIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});
