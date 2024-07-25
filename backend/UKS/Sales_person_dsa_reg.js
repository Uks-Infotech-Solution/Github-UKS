const mongoose = require('mongoose');

const dsaSchema = new mongoose.Schema({
    dsaId:String,
    dsaName:String,
    customerNo:String,
    uksId:String,
    salesPersonName: String,
    createdAt: { type: Date, default: Date.now }
});

const Dsa = mongoose.model('Sales_Person_DSA_reg', dsaSchema);

module.exports = Dsa;
