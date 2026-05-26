import TeamMember from '../models/TeamMember.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res, next) => {
  try {
    const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: team.length, data: team });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
export const createTeamMember = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'team');
    }

    const member = await TeamMember.create(req.body);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
export const updateTeamMember = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'team');
    }

    const member = await TeamMember.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
export const deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found' });
    }

    await member.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
