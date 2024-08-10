// models/AppliedLoanStatus.js

const mongoose = require('mongoose');

const AppliedLoanStatusSchema = new mongoose.Schema({
    dsaId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },
    loanId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        
    },
    dateTime: {
        type: Date,
        default: Date.now
    }
});

const AppliedLoanStatus = mongoose.model('Applied_Loan_Status', AppliedLoanStatusSchema);

module.exports = AppliedLoanStatus;
