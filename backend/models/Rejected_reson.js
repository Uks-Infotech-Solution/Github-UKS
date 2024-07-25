// models/Rejected.js
const mongoose = require('mongoose');

const RejectedSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    fileStatus: {
        type: String,
        required: true
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    dsaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dsa', // Assuming you have a Dsa model
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Rejected', RejectedSchema);
