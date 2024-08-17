// PreviousLoan.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

const previousLoanSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: false
  },
  financeName: {
    type: String,
    required: false
  },
  yearOfLoan: {
    type: Number,
    required: false // Allow null values
  },
  loanAmount: {
    type: Number,
    required: false
  },
  outstandingAmount: {
    type: Number,
    required: false
  }
});

const PreviousLoan = mongoose.model('Customer_PreviousLoan', previousLoanSchema);

module.exports = PreviousLoan;
