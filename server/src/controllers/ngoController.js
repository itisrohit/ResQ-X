exports.getAllRequests = async (req, res) => {
    try {
      const requests = await SOSRequest.find()
        .populate('victim volunteer')
        .sort({ createdAt: -1 });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.resolveComplaint = async (req, res) => {
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
      res.json(complaint);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };