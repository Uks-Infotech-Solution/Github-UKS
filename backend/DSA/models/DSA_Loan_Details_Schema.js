const mongoose = require('mongoose');

const loanDetailsSchema = new mongoose.Schema({
    dsaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DSA',
        required: true
    },
    typeOfLoan: {
        type: String,
        required: true
    },
    requiredDays: {
        type: Number,
        required: true
    },
    requiredDocument: {
        type: String,
        required: true
    },
    requiredType: {
        type: String,
        required: true
    },
    requiredCibilScore: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('DSA_Loan_Details', loanDetailsSchema);
