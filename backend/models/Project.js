import mongoose from 'mongoose';

const projectUpdateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    category: {
      type: String,
      required: [true, 'Please add a project category'],
      enum: ['Education', 'Healthcare', 'Women Empowerment', 'Environment', 'Child Welfare', 'Rural Development', 'Disaster Relief'],
    },
    image: {
      type: String,
      required: [true, 'Please add a main project image URL'],
    },
    gallery: {
      type: [String],
      default: [],
    },
    goalAmount: {
      type: Number,
      required: [true, 'Please add a funding goal amount'],
    },
    currentFunding: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
      required: [true, 'Please add a project location'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    updates: [projectUpdateSchema],
  },
  {
    timestamps: true,
  }
);

// Slugify the title before saving
projectSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
