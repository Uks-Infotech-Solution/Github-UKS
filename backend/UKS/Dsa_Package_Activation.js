// models/Activation.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema
const activationSchema = new Schema({
    uksId: String,
    uksNumber: String,
    uksName: String,
    dsaId: String,
    dsaName: String,
    dsaNumber: String,
    pkgId:String,
    packageName: String,
    packageAmount: Number,
    downloadAccess: String,
    loanTypes: [String],
    
    salesPersonName: String,
    salesPersonId: String,
    transferRefNo: String,
    status_activation: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Inactive'
    },
    currentDate: { type: Date, default: Date.now }

});

// Create model
const Activation = mongoose.model('Package_Activation', activationSchema);

module.exports = Activation;
