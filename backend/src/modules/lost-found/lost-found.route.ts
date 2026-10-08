import { Router } from 'express';
import * as lostFoundController from './lost-found.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createLostFoundSchema,
  lostFoundFilterSchema,
  lostFoundIdParamSchema
} from './lost-found.validation';

const router = Router();

router.get(
  '/',
  validateRequest({ query: lostFoundFilterSchema }),
  lostFoundController.getListings
);

router.get(
  '/:id',
  validateRequest({ params: lostFoundIdParamSchema }),
  lostFoundController.getListing
);

router.post(
  '/',
  authenticate,
  validateRequest({ body: createLostFoundSchema }),
  lostFoundController.createListing
);

router.patch(
  '/:id/resolve',
  authenticate,
  validateRequest({ params: lostFoundIdParamSchema }),
  lostFoundController.resolveListing
);

export const lostFoundRoutes = router;
