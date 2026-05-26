import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    organization: {
      name: { type: String, default: 'Namokriti International Foundation' },
      tagline: { type: String, default: 'Empowering Communities, Transforming Lives' },
      email: { type: String, default: 'contact@namokriti.org' },
      phone: { type: String, default: '+91 98765 43210' },
      address: { type: String, default: '12, Peace Plaza, New Delhi, India' },
      googleMapsUrl: { type: String, default: 'https://maps.google.com' },
    },
    hero: {
      title: { type: String, default: 'Empowering Communities, Transforming Lives' },
      subtitle: { type: String, default: 'Join us in our mission to support education, healthcare, and sustainable growth.' },
      backgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c' },
      videoUrl: { type: String, default: '' },
      donateButtonText: { type: String, default: 'Donate Now' },
      volunteerButtonText: { type: String, default: 'Become Volunteer' },
    },
    aboutBrief: {
      title: { type: String, default: 'Who We Are' },
      content: { type: String, default: 'Namokriti International Foundation is a non-profit organization dedicated to fostering positive growth across underserved areas through healthcare drives, environmental conservation, and educational resources.' },
      image: { type: String, default: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d' },
    },
    socialLinks: {
      facebook: { type: String, default: '#' },
      twitter: { type: String, default: '#' },
      instagram: { type: String, default: '#' },
      linkedin: { type: String, default: '#' },
      youtube: { type: String, default: '#' },
    },
    sponsors: [
      {
        name: { type: String, required: true },
        logo: { type: String, required: true },
      },
    ],
    csrPartners: [
      {
        name: { type: String, required: true },
        logo: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
