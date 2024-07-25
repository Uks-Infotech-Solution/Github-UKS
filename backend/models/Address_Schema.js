// Address.js (New Schema File)
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    aadharState: {type:String},
    aadharDistrict: {type:String} ,
    aadharCity: {type:String},
    aadharStreet: {type:String},
    aadharDoorNo: {type:String},
    aadharZip: {type:String},
    permanentState: {type:String},
    permanentDistrict:{type: String},
    permanentCity: {type:String},
    permanentStreet: {type:String},
    permanentDoorNo: {type:String},
    permanentZip: {type:String}
});

module.exports = mongoose.model('Customer_Address', addressSchema);
