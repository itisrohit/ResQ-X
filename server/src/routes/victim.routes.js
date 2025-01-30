const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const victimController = require('../controllers/victimController');

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

module.exports = router;