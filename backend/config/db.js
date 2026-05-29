import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('Skipping Admin seeding: ADMIN_EMAIL or ADMIN_PASSWORD not specified in env.');
    return;
  }

  try {
    const emailLower = adminEmail.toLowerCase();
    let admin = await User.findOne({ email: emailLower }).select('+password');
    
    if (!admin) {
      console.log(`Creating Admin user: ${emailLower}`);
      await User.create({
        name: 'Super Admin',
        email: emailLower,
        password: adminPassword,
        role: 'super-admin',
      });
      console.log('Admin user seeded successfully.');
    } else {
      let needsSave = false;
      if (admin.role !== 'super-admin') {
        admin.role = 'super-admin';
        needsSave = true;
      }
      
      const isPasswordMatch = await admin.matchPassword(adminPassword);
      if (!isPasswordMatch) {
        console.log(`Updating password for Admin user ${emailLower} to match env...`);
        admin.password = adminPassword;
        needsSave = true;
      }

      if (needsSave) {
        await admin.save();
        console.log('Admin user credentials updated successfully.');
      } else {
        console.log('Admin user exists and is up to date.');
      }
    }
  } catch (error) {
    console.error(`Error seeding Admin user: ${error.message}`);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/namokriti');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedAdminUser();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
