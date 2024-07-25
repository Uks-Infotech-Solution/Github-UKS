const mongoose = require('mongoose');
const { Schema } = mongoose;

const fileStatusSchema = new Schema({
  type: {
    type: String,
    required: true,
    unique: true, // If you want the file status types to be unique
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FileStatus = mongoose.model('Master_File_Status', fileStatusSchema);

module.exports = FileStatus;
