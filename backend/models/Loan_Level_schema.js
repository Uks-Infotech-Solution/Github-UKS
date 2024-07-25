const mongoose = require('mongoose');

const loanLevelSchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true } // Ensure each loan type is unique
});

module.exports = mongoose.model('Master_Loan_Level', loanLevelSchema);
