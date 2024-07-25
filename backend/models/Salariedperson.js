const mongoose = require('mongoose');

const salariedPersonSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    monthlySalary: { type: String, required: true },
    workExperience: { type: String, required: true },
    // address: {
    //     state: { type: String, required: true },
    //     // district: { type: String, required: true },
    //     city: { type: String, required: true },
    //     area: { type: String, required: true }
    // }
});

module.exports = mongoose.model('Customer_SalariedPerson', salariedPersonSchema);



