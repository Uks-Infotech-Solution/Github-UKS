const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const DSASchema = new mongoose.Schema({
    dsaName: {
        type: String,
        required: true
    },
    dsaCompanyName: {
        type: String,
        required: true
    },
    primaryNumber: {
        type: Number,
        required: true
    },
    alternateNumber: {
        type: Number
    },
    whatsappNumber: {
        type: Number
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    website: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    dsaNumber: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: false,
      },
      dsa_status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    },
      activationToken: {
        type: String,
      },
      resetToken: String,
      resetTokenExpiration: Date,
});

// Add auto-increment plugin for dsaNumber
DSASchema.plugin(AutoIncrement, { inc_field: 'dsaNumber', start_seq: 1 });

// Add virtual field for formatted dsaNumber
DSASchema.virtual('formattedDsaNumber').get(function () {
    return this.dsaNumber ? this.dsaNumber.toString().padStart(3, '0') : '';
});

// Ensure virtual fields are included in toJSON and toObject outputs
DSASchema.set('toJSON', { virtuals: true });
DSASchema.set('toObject', { virtuals: true });

const DSA = mongoose.model('DSA', DSASchema);

module.exports = DSA;


