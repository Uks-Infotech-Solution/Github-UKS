const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const LoanApplicationSchema = new mongoose.Schema({
    applicationNumber: {
        type: Number,
        unique: true,
        default: 1000 // Starting value for auto-increment
    },
    customerId: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerNo: {
        type: Number,
        required: true
    },
    customerMailId: {
        type: String,
        required: true
    },
    loanType: {
        type: String,
        required: true
    },
    loanAmount: {
        type: Number,
        required: true
    },
    loanRequiredDays: {
        type: Number,
        required: true
    },
    dsaId: {
        type: String,
        required: true
    },
    dsaName: {
        type: String,
        required: true
    },
    dsaNumber: {
        type: String,
        required: true
    },
    dsaCompanyName: {
        type: String,
        required: true
    },
    applyLoanStatus: {
        type: String,
        required: true
    },
    loanLevel: {
        type: String,
        required: true
    },
    loanSecured: {
        type: String,
        required: true
    },
    documentType: {
        type: String,
        required: true
    },
    documentOption: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Plugin auto-increment for applicationNumber
LoanApplicationSchema.plugin(AutoIncrement, { inc_field: 'applicationNumber' });

const LoanApplication = mongoose.model('Loan_Application', LoanApplicationSchema);

module.exports = LoanApplication;
