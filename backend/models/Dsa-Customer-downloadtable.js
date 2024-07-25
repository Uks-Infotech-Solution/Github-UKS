const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  dsaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DSA', // Reference to the DSA model
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Reference to the Customer model
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DSA_Customer_downloadTable', dataSchema);
