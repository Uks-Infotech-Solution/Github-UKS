// const mongoose = require('mongoose');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

// const customerSchema = new mongoose.Schema({
//     customerNo: { type: Number, unique: true },
//     title: { type: String },
//     customerFname: { type: String },
//     customerLname: { type: String },
//     gender: { type: String },
//     customercontact: { type: String },
//     customeralterno: { type: String },
//     customerwhatsapp: { type: String },
//     customermailid: { type: String, unique: true },
//     typeofloan: { type: String },
//     userpassword: { type: String },
//     customerType: { type: String },
//     loanRequired: { type: String }
// });

// // Add auto-increment plugin for customerNo
// customerSchema.plugin(AutoIncrement, { inc_field: 'customerNo', start_seq: 1 });

// const Customerdetails = mongoose.models.Customerdetails || mongoose.model('Customerdetails', customerSchema);

// module.exports = Customerdetails;
