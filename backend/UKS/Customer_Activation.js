const mongoose = require('mongoose');

const activationSchema = new mongoose.Schema({
  uksId: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerFname: {
    type: String,
    required: true
  },
  customermailid: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Uks_Customer_Activation', activationSchema);
