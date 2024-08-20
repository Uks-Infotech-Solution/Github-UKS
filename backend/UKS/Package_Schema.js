const mongoose = require('mongoose');

const PackageDetailSchema = new mongoose.Schema({
  uksId: {
    type: String,
    required: true
  },
  packageName: {
    type: String,
    required: true
  },
  packageAmount: {
    type: String,
    required: true
  },
  downloadAccess: {
    type: Number,
    required: true
  },
  validity: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountUnit: {
    type: String,
    required: true
  },
  comparison: {
    type: String,
    required: true
  },
  cibil: {
    type: Number,
    required: true
  },
  cibilcomparison: {
    type: String,
    required: true
  },
  freeze: {
    type: Boolean,
    default: false,
  },
  loanTypes: {
    type: [String],
    default: []
  },
  packageStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },

  additionalInputs: [{
    value: String,
    InputStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Master_PackageDetail', PackageDetailSchema);
