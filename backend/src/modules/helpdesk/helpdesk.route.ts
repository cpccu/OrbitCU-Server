import { Router } from 'express';
import * as helpdeskController from './helpdesk.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { hasRole } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createFAQSchema,
  faqIdParamSchema,
  faqQuerySchema,
  updateFAQSchema
} from './helpdesk.validation';
import { USER_ROLES } from '../../constants/roles';

const router = Router();

router.get(
  '/',
  validateRequest({ query: faqQuerySchema }),
  helpdeskController.getFAQs
);

router.get(
  '/:id',
  validateRequest({ params: faqIdParamSchema }),
  helpdeskController.getFAQ
);

router.post(
  '/',
  authenticate,
  hasRole([USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({ body: createFAQSchema }),
  helpdeskController.createFAQ
);

router.put(
  '/:id',
  authenticate,
  hasRole([USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({ params: faqIdParamSchema, body: updateFAQSchema }),
  helpdeskController.updateFAQ
);

router.delete(
  '/:id',
  authenticate,
  hasRole([USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({ params: faqIdParamSchema }),
  helpdeskController.deleteFAQ
);

export const helpdeskRoutes = router;
