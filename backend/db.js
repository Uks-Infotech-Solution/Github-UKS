const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      const mongoURI = process.env.MONGO_URI;
      if (!mongoURI) {
        throw new Error("MongoDB connection string is not defined in the environment variables.");
      }
      await mongoose.connect(mongoURI, {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Failed to connect to MongoDB, retrying in 2 seconds...', err);
      setTimeout(connectWithRetry, 2000);
    }
  };

  await connectWithRetry();
};

module.exports = connectDB;
