import {User} from '../models/user.model.js';
import { createGeoJSONPoint } from '../utils/geospatial.js';


export const updateDutyStatus = async (req, res) => {
  try {
    const volunteer = await User.findByIdAndUpdate(
      req.user.id,
      { 
        isOnDuty: req.body.isOnDuty, 
        isBusy: req.body.isBusy 
      },
      { new: true }
    );

    if (!volunteer) {
      return res.status(404).json({ error: 'Volunteer not found' });
    }

    // Real-time status update
    req.io.emit('volunteer-status', volunteer);

    // Notify NGO of the volunteer's duty status
    if (volunteer.isOnDuty) {
      req.io.to('ngo').emit('volunteer-online', volunteer);
    } else {
      req.io.to('ngo').emit('volunteer-offline', volunteer._id);
    }

    res.json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const getNearbyVolunteers = async (req, res) => {
  try {
    const { lng, lat } = req.query;
    if (!lng || !lat) return res.status(400).json({ error: 'Missing coordinates' });

    // Find nearby volunteers who are on duty and not busy
    const volunteers = await User.find({
      role: 'volunteer',
      isOnDuty: true,
      isBusy: false,  // Check that the volunteer is not busy
      location: {
        $near: {
          $geometry: createGeoJSONPoint([lng, lat]),
          $maxDistance: 10000
        }
      }
    }).select('fullname location isOnDuty isBusy');

    if (volunteers.length === 0) {
      return res.status(404).json({ error: 'No volunteers found nearby' });
    }

    res.json(volunteers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

