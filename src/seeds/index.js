import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cleanDB from './cleanDB.js';
import seedData from './data.js';

dotenv.config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    await cleanDB();     // Optional but helpful!
    await seedData();    // Seed users, thoughts, etc.

    console.log('🌱 Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
};

seedAll();