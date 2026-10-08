import { z } from 'zod';
import { DEPARTMENTS, FILE_FORMATS, PATTERNS, SEMESTER_TERMS } from '../../constants/enums';

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  courseCode: z
    .string()
    .transform((val) => val.trim().toUpperCase())
    .pipe(z.string().regex(PATTERNS.COURSE_CODE, 'Course code must contain 3 or 4 letters and 3 or 4 digits (e.g., CSE-221, MATH 2105)')),
  courseTitle: z.string().min(2, 'Course title is required'),
  department: z.enum(DEPARTMENTS),
  semesterTerm: z.enum(SEMESTER_TERMS),
  academicSession: z.string().min(3, 'Academic session is required (e.g., Spring 2025)'),
  fileUrl: z.string().url('File URL must be a valid URL'),
  fileFormat: z.enum(FILE_FORMATS)
});

export const resourceFilterSchema = z.object({
  department: z.enum(DEPARTMENTS).optional(),
  courseCode: z.string().optional(),
  semesterTerm: z.enum(SEMESTER_TERMS).optional(),
  session: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const resourceSearchSchema = z.object({
  q: z.string().min(1, 'Search query cannot be empty'),
  page: z.string().optional(),
  limit: z.string().optional()
});

export const resourceIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});
