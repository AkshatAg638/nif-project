import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Please add a media file URL'],
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    category: {
      type: String,
      required: [true, 'Please specify the category'],
      enum: ['Education', 'Healthcare', 'Women Empowerment', 'Environment', 'Child Welfare', 'Rural Development', 'Disaster Relief', 'Events', 'General'],
    },
    caption: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
