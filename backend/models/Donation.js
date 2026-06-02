import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add donor name'],
    },
    email: {
      type: String,
      required: [true, 'Please add donor email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Please add donor phone number'],
    },
    amount: {
      type: Number,
      required: [true, 'Please add donation amount'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },
    paymentId: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    purpose: {
      type: String,
      required: [true, 'Please specify the donation purpose'],
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    receiptNumber: {
      type: String,
      default: null,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
