const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const ngoController = require('../controllers/ngoController');

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

module.exports = router;