const mongoose = require('mongoose');

const DSABranchDetailsSchema = new mongoose.Schema({
    dsaId: String,
    branchName: String,
    branchAddress: String,
    branchManager: String,
    branchContact: String,
    branchStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }, // Add branchStatus field
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DSA_Branch_Details', DSABranchDetailsSchema);
