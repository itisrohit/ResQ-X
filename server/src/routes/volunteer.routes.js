import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { getNearbyVolunteers, updateDutyStatus } from '../controllers/volunteerController.js';

const router = express.Router();

// Update duty status
router.put('/status',
  authenticate,
  authorize('volunteer'),
  updateDutyStatus
);


// Get nearby SOS requests
router.get('/nearby-sos',
  authenticate,
  authorize('volunteer'),
  getNearbyVolunteers
);

export default router;
