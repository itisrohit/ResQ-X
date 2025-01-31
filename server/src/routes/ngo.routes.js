import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { getAllRequests, resolveComplaint, generateReport,getComplaintStats, createComplaint } from '../controllers/ngoController.js';

const router = express.Router();

// Get all SOS requests (NGO view)
router.get('/requests',
  authenticate,
  authorize('ngo'),
  getAllRequests
);


// Get complaint statistics
router.get('/complaints/stats',
  authenticate,
  authorize('ngo'),
  getComplaintStats
);

router.post('/complaints',
  authenticate,
  authorize('victim'),
  createComplaint
);

// Resolve complaint
router.put('/complaints/:id/resolve',
  authenticate,
  authorize('ngo'),
  resolveComplaint
);

// Generate disaster report
router.get('/reports',
  authenticate,
  authorize('ngo'),
  generateReport
);

export default router;