import SOSRequest from '../models/SOSRequest';
import User from '../models/User';
import { createGeoJSONPoint } from '../utils/geospatial';

export const createSOS = async (req, res) => {
  try {
    const victim = await User.findById(req.user.id);
    if (!victim) return res.status(404).json({ error: 'User not found' });

    const sos = await SOSRequest.create({
      victim: victim._id,
      location: victim.location,
      description: req.body.description
    });

    // Find nearby volunteers within 10km
    const volunteers = await User.find({
      role: 'volunteer',
      isOnDuty: true,
      location: {
        $near: {
          $geometry: sos.location,
          $maxDistance: 10000
        }
      }
    }).select('-password');

    // Real-time notification
    req.io.emit('new-sos', {
      sos: await sos.populate('victim'),
      volunteers: volunteers.map(v => v._id)
    });

    // Notify all NGOs
    req.io.to('ngo').emit('new-sos', sos);

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
          $maxDistance: 10000
        }
      }
    }).populate('victim', 'name phone');

    res.json(sosRequests);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
