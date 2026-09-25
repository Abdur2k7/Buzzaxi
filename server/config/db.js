import mongoose from 'mongoose';

let isConnected = false;
let isInMemoryFallback = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/buzzaxi';
  
  try {
    // Attempt Mongoose connection with a 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    isInMemoryFallback = false;
    console.log(`[MongoDB] Connected successfully to database at ${uri}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to local/remote MongoDB (${error.message}).`);
    console.log(`[MongoDB Fallback] Activating resilient in-memory database store so Buzzaxi works seamlessly out of the box without requiring a running Mongo daemon.`);
    isInMemoryFallback = true;
  }
};

export const getDBStatus = () => ({
  isConnected,
  isInMemoryFallback,
  driver: isInMemoryFallback ? 'In-Memory Mock/Store' : 'MongoDB / Mongoose'
});
