const mongoose = require('mongoose');

const employeeTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true, // Ensures the employee types are unique
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Master_Employee_Type', employeeTypeSchema);
