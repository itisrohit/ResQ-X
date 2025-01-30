import Complaint from '../models/Complaint';
import SOSRequest from '../models/SOSRequest';

export const getAllRequests = async (req, res) => {
  try {
    const requests = await SOSRequest.find()
      .populate('victim volunteer')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'resolved',
        resolvedBy: req.user.id,
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Real-time notifications
    req.io.to('ngo').emit('complaint-resolved', complaint);
    req.io.to(complaint.filedBy.toString()).emit('complaint-resolved', complaint);

    res.json(complaint);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
