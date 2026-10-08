import { z } from 'zod';
import { DEPARTMENTS } from '../../constants/enums';
import { USER_ROLES } from '../../constants/roles';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  universityId: z.string().min(3, 'University ID must be at least 3 characters long').max(30),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  department: z.enum(DEPARTMENTS, {
    errorMap: () => ({ message: 'Invalid department' })
  }),
  role: z.enum([USER_ROLES.STUDENT, USER_ROLES.CLUB_ADMIN, USER_ROLES.UNIVERSITY_ADMIN]).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
