const mongoose = require('mongoose');

const customerStatusSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    // customermailid: { type: String, required: true },
    status: {
        type: String,
        enum: ['Active', 'InActive'],
        default: 'InActive'
      }
});

const CustomerStatus = mongoose.model('Customer_Status', customerStatusSchema);

module.exports = CustomerStatus;
