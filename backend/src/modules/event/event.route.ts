import { Router } from 'express';
import * as eventController from './event.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { hasRole } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createEventSchema,
  eventQuerySchema,
  eventIdParamSchema
} from './event.validation';
import { USER_ROLES } from '../../constants/roles';

const router = Router();

router.get(
  '/',
  validateRequest({ query: eventQuerySchema }),
  eventController.getEvents
);

router.get(
  '/my-passes',
  authenticate,
  hasRole([USER_ROLES.STUDENT]),
  eventController.getMyPasses
);

router.get(
  '/:id',
  validateRequest({ params: eventIdParamSchema }),
  eventController.getEvent
);

router.post(
  '/',
  authenticate,
  hasRole([USER_ROLES.CLUB_ADMIN, USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({ body: createEventSchema }),
  eventController.createEvent
);

router.post(
  '/:id/rsvp',
  authenticate,
  hasRole([USER_ROLES.STUDENT]),
  validateRequest({ params: eventIdParamSchema }),
  eventController.rsvpEvent
);

export const eventRoutes = router;
