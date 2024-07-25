const mongoose = require('mongoose');

const BuyPackageSchema = new mongoose.Schema({
  dsaId: { type: String, required: true },
  dsaNumber: { type: String, required: true },
  dsaName: { type: String, required: true },
  dsaCompanyName: { type: String, required: true },
  email: { type: String, required: true },
  primaryNumber: { type: String, required: true },
  packageName: { type: String, required: true },
  downloadAccess: { type: String, required: true },
  packageAmount: { type: Number, required: true },
  loanTypes: [{ type: String }], // Array of loan types
  additionalInputs: [{
    value: { type: String, required: true },
    InputStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    // Add more fields as per your additionalInputs structure
  }],
  packageStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Inactive'
  },
  uksId: { type: String, default: null },
  salespersonId: { type: String, default: null },
  salespersonname: { type: String, default: null },
  transferAmountRefNumber: { type: String, default: null },
  purchaseDate: { type: Date, default: Date.now },
  activationToken: { type: String },
  resetToken: String,
  resetTokenExpiration: Date,
  
});

module.exports = mongoose.model('Buy_Packagers', BuyPackageSchema);
