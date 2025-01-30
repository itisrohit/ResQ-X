import {SOSRequest} from '../models/SOSRequest.model.js';
import {User} from '../models/user.model.js';
import { createGeoJSONPoint, validateCoordinates } from '../utils/geospatial.js';


export const createSOS = async (req, res) => {
  try {
    const victim = await User.findById(req.user.id);
    if (!victim) return res.status(404).json({ error: 'User not found' });

    // Validate victim's location before creating the SOS request
    if (!validateCoordinates(victim.location.coordinates)) {
      return res.status(400).json({ error: 'Invalid victim location coordinates' });
    }

    const sos = await SOSRequest.create({
      victim: victim._id,
      location: victim.location,
      description: req.body.description,
      category: req.body.category || 'other'  // Default to 'other' if not provided
    });

    // Find nearby volunteers who are on duty and not busy
    const volunteers = await User.find({
      role: 'volunteer',
      isOnDuty: true,
      isBusy: false,  // Check that the volunteer is not busy
      location: {
        $near: {
          $geometry: sos.location,
          $maxDistance: 10000
        }
      }
    });

    if (volunteers.length === 0) {
      return res.status(404).json({ error: 'No available volunteers nearby' });
    }

    // Real-time notification to the nearest volunteer
    req.io.emit('new-sos', {
      sos: await sos.populate('victim'),
      volunteers: volunteers.map(v => v._id)
    });

    // Notify all NGOs
    req.io.to('ngo').emit('new-sos', sos);

    // Send information of the nearest volunteer to the victim
    req.io.emit('victim-details', {
      victim: victim,
      volunteer: volunteers[0]  // Send the first available volunteer's info
    });

    // Send the volunteer's details and live location to the victim
    req.io.to(volunteers[0]._id).emit('volunteer-details', {
      victim: victim,
      volunteer: volunteers[0]  // Send the victim's details to the volunteer
    });

    // Mark the volunteer as busy (set isBusy to true)
    await User.findByIdAndUpdate(volunteers[0]._id, { isBusy: true });

    res.status(201).json(sos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



export const getNearbySOS = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    if (!lng || !lat) return res.status(400).json({ error: 'Missing coordinates' });

    const sosRequests = await SOSRequest.find({
      status: 'pending',
      location: {
        $near: {
          $geometry: createGeoJSONPoint([lng, lat]),
          $maxDistance: 20000
        }
      }
    });

    res.json(sosRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get SOS status
export const getSOSStatus = async (req, res) => {
  try {
    const sosRequest = await SOSRequest.findById(req.params.id)
      .populate('victim')
      .populate('volunteer');
    
    if (!sosRequest) {
      return res.status(404).json({ error: 'SOS request not found' });
    }

    res.json(sosRequest);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};