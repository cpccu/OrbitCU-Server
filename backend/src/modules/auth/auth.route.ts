import { Router } from 'express';
import * as authController from './auth.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { registerSchema, loginSchema } from './auth.validation';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  authController.register
);

router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  authController.login
);

router.get('/me', authenticate, authController.getMe);

export const authRoutes = router;
