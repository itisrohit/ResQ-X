import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as victimController from '../controllers/victimController.js';

const router = express.Router();

// Create SOS request
router.post('/sos',
  authenticate,
  authorize('victim'),
  victimController.createSOS
);

// Create complaint
router.post('/complaints',
  authenticate,
  authorize('victim'),
  victimController.createComplaint
);

// Get SOS status
router.get('/sos-status/:id',
  authenticate,
  authorize('victim'),
  victimController.getSOSStatus
);

// Get complaint status
router.get('/complaint-status/:id',
  authenticate,
  authorize('victim'),
  victimController.getComplaintStatus
);

export default router;
