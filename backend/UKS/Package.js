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
