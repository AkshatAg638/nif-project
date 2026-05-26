import Program from '../models/Program.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res, next) => {
  try {
    const programs = await Program.find().sort({ category: 1 });
    res.status(200).json({ success: true, count: programs.length, data: programs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single program by ID or Category
// @route   GET /api/programs/:id
// @access  Public
export const getProgram = async (req, res, next) => {
  try {
    let program;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      program = await Program.findById(req.params.id);
    } else {
      program = await Program.findOne({ category: req.params.id });
    }

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }
    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Create program
// @route   POST /api/programs
// @access  Private/Admin
export const createProgram = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'programs');
    }

    // Parse impactMetrics if stringified (often comes from multi-part forms)
    if (req.body.impactMetrics && typeof req.body.impactMetrics === 'string') {
      try {
        req.body.impactMetrics = JSON.parse(req.body.impactMetrics);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid format for impact metrics' });
      }
    }

    const program = await Program.create(req.body);
    res.status(201).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Update program
// @route   PUT /api/programs/:id
// @access  Private/Admin
export const updateProgram = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'programs');
    }

    // Parse impactMetrics if stringified
    if (req.body.impactMetrics && typeof req.body.impactMetrics === 'string') {
      try {
        req.body.impactMetrics = JSON.parse(req.body.impactMetrics);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid format for impact metrics' });
      }
    }

    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.status(200).json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
export const deleteProgram = async (req, res, next) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    await program.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
