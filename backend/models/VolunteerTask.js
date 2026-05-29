import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A user must be assigned to this task'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    appreciationMessage: {
      type: String,
      default: '🌟 Outstanding work! Thank you for your dedication to Namokriti International Foundation. Your contribution makes a real difference in the lives of many. Keep inspiring others!',
    },
    completedAt: {
      type: Date,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const VolunteerTask = mongoose.model('VolunteerTask', volunteerTaskSchema);

export default VolunteerTask;
