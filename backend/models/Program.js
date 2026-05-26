import mongoose from 'mongoose';

const impactMetricSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

const programSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Please add a program category'],
      unique: true,
      enum: ['Education', 'Healthcare', 'Women Empowerment', 'Environment', 'Child Welfare', 'Rural Development', 'Disaster Relief'],
    },
    title: {
      type: String,
      required: [true, 'Please add a program title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a program description'],
    },
    image: {
      type: String,
      required: [true, 'Please add a program cover image URL'],
    },
    impactMetrics: [impactMetricSchema],
  },
  {
    timestamps: true,
  }
);

const Program = mongoose.model('Program', programSchema);

export default Program;
