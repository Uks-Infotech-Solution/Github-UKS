const mongoose = require('mongoose');

const loanProcessingSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    checkBounds: { type: String, default: 'false' }, // Changed to string 'false' to match default value type
    blockStatus: { type: String, required: true },
    fileStatus: { type: String, required: true },
    // loanType: { type: String, required: true },
    // documentType: { type: String, required: true }, // New field for Document Type
    // documentStatus: { type: String, required: true },
    monthlyIncome: { type: Number, required: true },
    msneNo: { type: Number, required: true },
    gstNo: { type: String, required: true },
    cibilRecord: { type: String, required: true },
    itReturns: [{ type: String }] // Define itReturns as an array of strings
});

const LoanProcessing = mongoose.model('Customer_LoanProcessing', loanProcessingSchema);

module.exports = LoanProcessing;
