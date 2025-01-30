const User = require('../models/User');
const { createGeoJSONPoint } = require('../utils/geospatial');

exports.updateDutyStatus = async (req, res) => {
  try {
    const volunteer = await User.findByIdAndUpdate(
      req.user.id,
      { isOnDuty: req.body.isOnDuty },
      { new: true }
    ).select('-password');

    req.io.emit('volunteer-status', volunteer);
    res.json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getNearbyVolunteers = async (req, res) => {
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