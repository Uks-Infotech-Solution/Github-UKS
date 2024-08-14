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
    pkgId: String,
    packageName: String,
    packageAmount: Number,
    downloadAccess: String,
    validity:Number,
    amount:Number,
    comparison:String,
    loanTypes: [String],
    
    salesPersonName: String,
    salesPersonId: String,
    transferRefNo: String,
    status_activation: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    },
    activation_date: { type: Date, default: Date.now },
    expiry_date: { type: Date } // Set expiry_date type as Date
});

// // Middleware to check expiry date before saving
// activationSchema.pre('save', function(next) {
//     const currentDate = new Date();
    
//     // Check if the expiry date has passed
//     if (this.expiry_date && this.expiry_date < currentDate) {
//         this.status_activation = 'Inactive';
//     } else if (!this.status_activation || this.status_activation === 'Inactive') {
//         this.status_activation = 'Active';
//     }

//     next();
// });

// // Middleware to check expiry date during queries
// activationSchema.pre('find', function(next) {
//     const currentDate = new Date();
//     this.where('expiry_date').lte(currentDate).updateMany({}, { status_activation: 'Inactive' });
//     next();
// });

// Create model
const Activation = mongoose.model('Package_Activation', activationSchema);

module.exports = Activation;
