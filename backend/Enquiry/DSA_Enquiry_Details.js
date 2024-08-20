const mongoose = require('mongoose'); // Import mongoose

const enquirySchema = new mongoose.Schema({
    dsaname: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true
    },
    companyname: {
      type: String,
    },
    email: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
    convertedDate: {
        type: Date, // New field for conversion date
      },
    enquiry_convert_status: {
      type: String,
      enum: ['Pending', 'Converted', 'Deleted'],
      default: 'Pending'
    },
    Remarks:{
      type:String,
    },
    uksId: String,
  });
  
  const DSA_Enquiry = mongoose.model('Enquiry_DSA_Details', enquirySchema);
  
  module.exports = DSA_Enquiry;
  