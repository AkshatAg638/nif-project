import Gallery from '../models/Gallery.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get gallery items
// @route   GET /api/gallery
// @access  Public
export const getGallery = async (req, res, next) => {
  try {
    const { category, mediaType } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (mediaType) {
      query.mediaType = mediaType;
    }

    const items = await Gallery.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create gallery item (upload image/video)
// @route   POST /api/gallery
// @access  Private/Admin
export const createGallery = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a media file' });
    }

    // Determine type
    const mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    const url = await uploadToCloudinary(req.file.buffer, 'gallery');

    const item = await Gallery.create({
      url,
      mediaType,
      category: req.body.category || 'General',
      caption: req.body.caption || '',
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGallery = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Media item not found' });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
