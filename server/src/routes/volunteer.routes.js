import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as volunteerController from '../controllers/volunteerController.js';

const router = express.Router();

// Update duty status
router.put('/status',
  authenticate,
  authorize('volunteer'),
  volunteerController.updateDutyStatus
);

// Get nearby SOS requests
router.get('/nearby-sos',
  authenticate,
  authorize('volunteer'),
  volunteerController.getNearbySOS
);

// Accept SOS request
router.put('/accept-sos/:id',
  authenticate,
  authorize('volunteer'),
  volunteerController.acceptSOS
);

// Update SOS status
router.put('/sos-status/:id',
  authenticate,
  authorize('volunteer'),
  volunteerController.updateSOSStatus
);

export default router;
