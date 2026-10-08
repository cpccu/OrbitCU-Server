import { Router } from 'express';
import * as complaintController from './complaint.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { hasRole } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validate.middleware';
import {
  complaintFilterSchema,
  complaintIdParamSchema,
  createComplaintSchema,
  ticketIdParamSchema,
  updateComplaintStatusSchema
} from './complaint.validation';
import { USER_ROLES } from '../../constants/roles';

const router = Router();

// Public tracking endpoint
router.get(
  '/track/:ticketId',
  validateRequest({ params: ticketIdParamSchema }),
  complaintController.trackComplaint
);

// Authenticated user's complaints
router.get(
  '/my-complaints',
  authenticate,
  complaintController.getMyComplaints
);

// Submit complaint (authenticated)
router.post(
  '/',
  authenticate,
  validateRequest({ body: createComplaintSchema }),
  complaintController.createComplaint
);

// Admin view all complaints
router.get(
  '/',
  authenticate,
  hasRole([USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({ query: complaintFilterSchema }),
  complaintController.getAllComplaints
);

// Admin update complaint status & remarks
router.patch(
  '/:id/status',
  authenticate,
  hasRole([USER_ROLES.UNIVERSITY_ADMIN]),
  validateRequest({
    params: complaintIdParamSchema,
    body: updateComplaintStatusSchema
  }),
  complaintController.updateComplaintStatus
);

export const complaintRoutes = router;
