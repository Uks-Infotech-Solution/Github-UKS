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
  validity:Number,
  amount:Number,
  comparison: String,
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
  activationDate: { type: Date, default: null },
  expiryDate: { type: Date, default: null },
  activationToken: { type: String },
  resetToken: String,
  resetTokenExpiration: Date,
});

// // Middleware to check expiry date before saving
// BuyPackageSchema.pre('save', function(next) {
//   const currentDate = new Date();

//   // Check if the expiry date has passed
//   if (this.expiryDate && this.expiryDate <= currentDate) {
//     this.packageStatus = 'Inactive';
//   } 

//   next();
// });

// // Middleware to check expiry date during queries
// BuyPackageSchema.pre('find', function(next) {
//   const currentDate = new Date();
//   this.where('expiryDate').lte(currentDate).updateMany({}, { packageStatus: 'Inactive' });
//   next();
// });

// Create and export the model
module.exports = mongoose.model('Buy_Packagers', BuyPackageSchema);
