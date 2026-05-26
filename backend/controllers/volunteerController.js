import Volunteer from '../models/Volunteer.js';

// @desc    Apply as a volunteer
// @route   POST /api/volunteers
// @access  Public
export const applyVolunteer = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Check if user already applied
    const existing = await Volunteer.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied with this email address' });
    }

    const application = await Volunteer.create(req.body);
    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all volunteer applications
// @route   GET /api/volunteers
// @access  Private/Admin
export const getVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: volunteers.length, data: volunteers });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer application status
// @route   PUT /api/volunteers/:id
// @access  Private/Admin
export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer application not found' });
    }

    res.status(200).json({ success: true, data: volunteer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete volunteer application
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
export const deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer record not found' });
    }

    await volunteer.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
