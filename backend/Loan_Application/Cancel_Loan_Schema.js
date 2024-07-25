// models/LoanCancellation.js

const mongoose = require('mongoose');

const LoanCancellationSchema = new mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    dsaId: {
        type: String,
        required: true
    },
    loanId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'LoanApplication'
    },
    cancellationDate: {
        type: Date,
        default: Date.now
    },
    customerLoanStatus: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive']
    }
});

const LoanCancellation = mongoose.model('Loan_Cancellation', LoanCancellationSchema);

module.exports = LoanCancellation;
