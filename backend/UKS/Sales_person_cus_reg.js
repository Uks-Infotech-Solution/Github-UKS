const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    customerId:String,
    customerName:String,
    customerNo:String,
    uksId:String,
    salesPersonName: String,
    createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Sales_Person_Cus_reg', customerSchema);

module.exports = Customer;
