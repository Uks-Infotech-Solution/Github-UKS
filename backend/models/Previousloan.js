// PreviousLoan.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const previousLoanSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  financeName: {
    type: String,
    required: true
  },
  yearOfLoan: {
    type: Number,
    required: false // Allow null values
  },
  loanAmount: {
    type: Number,
    required: true
  },
  outstandingAmount: {
    type: Number,
    required: true
  }
});

const PreviousLoan = mongoose.model('Customer_PreviousLoan', previousLoanSchema);

module.exports = PreviousLoan;
