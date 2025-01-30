import { Complaint } from '../models/Complaint.model.js';
import { SOSRequest } from '../models/SOSRequest.model.js';


// Get all SOS requests (NGO view)
export const getAllRequests = async (req, res) => {
  try {
    const requests = await SOSRequest.find()
      .populate('victim volunteer')
      .sort({ createdAt: -1 });

    if (!requests.length) {
      return res.status(404).json({ message: 'No SOS requests found' });
    }

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint statistics
export const getComplaintStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });

    res.json({
      totalComplaints,
      pendingComplaints,
      resolvedComplaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create complaint
export const createComplaint = async (req, res) => {
  try {
    const { description, category } = req.body;

    // Ensure category is valid
    const validCategories = ['medical', 'food', 'shelter', 'rescue', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    const victim = await User.findById(req.user.id);  // Assuming 'victim' is the authenticated user
    if (!victim) return res.status(404).json({ error: 'Victim not found' });

    // Create new complaint
    const complaint = new Complaint({
      filedBy: victim._id,  // Set 'filedBy' as the victim
      description,
      category,
      status: 'open',  // Default status is 'open'
    });

    await complaint.save();

    // Emit notification to NGOs
    req.io.to('ngo').emit('new-complaint', complaint);

    res.status(201).json(complaint);  // Return the created complaint
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Resolve complaint
export const resolveComplaint = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

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

// Generate disaster report
export const generateReport = async (req, res) => {
  try {
    // Example: Combine SOS requests and complaints to generate a disaster report
    const requests = await SOSRequest.find()
      .populate('victim volunteer')
      .sort({ createdAt: -1 });

    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });

    // Combine data (can be customized based on your report structure)
    const report = {
      totalSOSRequests: requests.length,
      totalComplaints: complaints.length,
      complaintsResolved: complaints.filter(c => c.status === 'resolved').length,
      complaintsPending: complaints.filter(c => c.status === 'pending').length
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
