const mongoose = require('mongoose');

// Define the Address schema
const AddressSchema = new mongoose.Schema({
    state: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String },
    doorNo: { type: String },
    postalCode: { type: String }
});

// Define the DSAAddress schema with Aadhar and Permanent addresses
const DSAAddressSchema = new mongoose.Schema({
    dsaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DSA',
        required: true
    },
    aadharAddress: {
        type: AddressSchema,
        required: true
    },
    permanentAddress: {
        type: AddressSchema,
        required: true
    }
});

module.exports = mongoose.model('DSA_Address', DSAAddressSchema);
