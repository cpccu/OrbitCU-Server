import { Router } from 'express';
import * as resourceController from './resource.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  createResourceSchema,
  resourceFilterSchema,
  resourceSearchSchema,
  resourceIdParamSchema
} from './resource.validation';

const router = Router();

router.get(
  '/',
  validateRequest({ query: resourceFilterSchema }),
  resourceController.getResources
);

router.get(
  '/search',
  validateRequest({ query: resourceSearchSchema }),
  resourceController.searchResources
);

router.get(
  '/:id',
  validateRequest({ params: resourceIdParamSchema }),
  resourceController.getResource
);

router.post(
  '/',
  authenticate,
  validateRequest({ body: createResourceSchema }),
  resourceController.createResource
);

router.patch(
  '/:id/upvote',
  authenticate,
  validateRequest({ params: resourceIdParamSchema }),
  resourceController.upvoteResource
);

export const resourceRoutes = router;
