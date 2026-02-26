import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // If already connected, return
    if (mongoose.connection.readyState === 1) {
      console.log('Using existing MongoDB connection');
      return;
    }

    // If connecting, wait
    if (mongoose.connection.readyState === 2) {
      console.log('MongoDB connection in progress...');
      return;
    }

    // Create new connection
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Throw error instead of exiting
    throw error;
  }
};

export default connectDB;