const mongoose = require('mongoose');
const { Schema } = mongoose;

const DSA_RequiredTypeSchema = new Schema({
  requiredType: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DSA_RequiredType = mongoose.model('DSA_RequiredType', DSA_RequiredTypeSchema);

module.exports = DSA_RequiredType;
