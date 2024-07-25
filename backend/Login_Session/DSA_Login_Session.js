const mongoose = require('mongoose');

const loginSessionSchema = new mongoose.Schema({
    dsaId: { type: mongoose.Schema.Types.ObjectId, ref: 'DSA', required: true },
    loginDateTime: { type: Date, required: true }
});

module.exports = mongoose.model('DSA_LoginSession', loginSessionSchema);
