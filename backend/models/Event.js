import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    category: {
      type: String,
      required: [true, 'Please add an event category'],
      enum: ['Fundraiser', 'Awareness', 'Volunteer Drive', 'Community Service', 'Workshop'],
    },
    image: {
      type: String,
      required: [true, 'Please add an event banner image URL'],
    },
    date: {
      type: Date,
      required: [true, 'Please specify the event date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify the event time'],
    },
    venue: {
      type: String,
      required: [true, 'Please specify the event venue'],
    },
    rsvpList: {
      type: [String],
      default: [],
    },
    gallery: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Slugify the title before saving
eventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
