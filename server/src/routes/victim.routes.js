import express from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { createSOS, getNearbySOS, getSOSStatus } from '../controllers/sosController.js';

const router = express.Router();

// Create SOS request
router.post('/sos',
  authenticate,
  authorize('victim'),
  createSOS
);

router.get('/nearby-sos', 
  authenticate, 
  authorize('volunteer'), 
  getNearbySOS);

// Get SOS status
router.get('/sos-status/:id',
  authenticate,
  authorize('victim'),
  getSOSStatus
);

export default router;
