const mongoose = require('mongoose');

const connectDB = async () => {
  const connectWithRetry = async () => {
    try {
      await mongoose.connect('mongodb://LDp-DB:d888833d093ksKdmc@148.251.230.14:27017/LDp-DB', {

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
