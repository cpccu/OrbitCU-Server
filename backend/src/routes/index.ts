import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { eventRoutes } from '../modules/event/event.route';
import { resourceRoutes } from '../modules/resource/resource.route';
import { helpdeskRoutes } from '../modules/helpdesk/helpdesk.route';
import { lostFoundRoutes } from '../modules/lost-found/lost-found.route';
import { complaintRoutes } from '../modules/complaint/complaint.route';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'CampusOS API is operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Feature routes
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/resources', resourceRoutes);
router.use('/helpdesk', helpdeskRoutes);
router.use('/lost-found', lostFoundRoutes);
router.use('/complaints', complaintRoutes);

export const appRouter = router;
