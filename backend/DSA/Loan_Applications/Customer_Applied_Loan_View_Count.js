// models/ApplyViewCount.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applyViewCountSchema = new Schema({
  customerId: { type: String, required: true },
  dsaId: { type: String, required: true },
  loanId: { type: String, required: true },
  applicationNumber: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DSA_Customer_ApplyViewCount', applyViewCountSchema);
