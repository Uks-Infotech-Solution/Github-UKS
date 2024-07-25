// models/DocumentType.js

const mongoose = require('mongoose');

const documentTypeSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    }
});

const DocumentType = mongoose.model('Master_Document_Type', documentTypeSchema);

module.exports = DocumentType;
