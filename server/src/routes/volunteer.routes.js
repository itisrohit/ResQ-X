const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const volunteerController = require('../controllers/volunteerController');

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

module.exports = router;