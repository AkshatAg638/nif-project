import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    role: {
      type: String,
      required: [true, 'Please add a role/designation'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    bio: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

export default TeamMember;
