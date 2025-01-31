import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as ngoController from '../controllers/ngoController.js';

const router = express.Router();

// Get all SOS requests (NGO view)
router.get('/requests',
  authenticate,
  authorize('ngo'),
  ngoController.getAllRequests
);

// Get complaint statistics
router.get('/complaints/stats',
  authenticate,
  authorize('ngo'),
  ngoController.getComplaintStats
);

// Resolve complaint
router.put('/complaints/:id/resolve',
  authenticate,
  authorize('ngo'),
  ngoController.resolveComplaint
);

// Get resource inventory
router.get('/resources',
  authenticate,
  authorize('ngo'),
  ngoController.getResources
);

// Generate disaster report
router.get('/reports',
  authenticate,
  authorize('ngo'),
  ngoController.generateReport
);

export default router;
