import Settings from '../models/Settings.js';

// @desc    Get website settings (homepage configurations, SEO parameters, social profiles)
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    // Bootstrap if it does not exist
    if (!settings) {
      settings = await Settings.create({});
    }
    
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update website settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      // Merge req.body properties
      Object.assign(settings, req.body);
      await settings.save();
    }
    
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
