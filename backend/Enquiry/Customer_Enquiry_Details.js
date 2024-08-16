const mongoose = require('mongoose'); // Import mongoose

const enquirySchema = new mongoose.Schema({
    name: {
      type: String,
    },
    contactNumber: {
      type: String,
      required: true
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
    uksId: String,
  });
  
  const Enquiry = mongoose.model('Enquiry_Details', enquirySchema);
  
  module.exports = Enquiry;
  