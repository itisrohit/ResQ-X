import User from '../models/User';
import { createGeoJSONPoint } from '../utils/geospatial';

export const updateDutyStatus = async (req, res) => {
  try {
    const volunteer = await User.findByIdAndUpdate(
      req.user.id,
      { isOnDuty: req.body.isOnDuty },
      { new: true }
    ).select('-password'); // Exclude password field

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

    const volunteers = await User.find({
      role: 'volunteer',
      isOnDuty: true,
      location: {
        $near: {
          $geometry: createGeoJSONPoint([lng, lat]),
          $maxDistance: 10000
        }
      }
    }).select('name skills location isOnDuty');

    res.json(volunteers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
