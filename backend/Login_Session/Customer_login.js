const mongoose = require('mongoose');

const loginSessionSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    loginDateTime: { type: Date, required: true }
});

module.exports = mongoose.model('LoginSession', loginSessionSchema);
