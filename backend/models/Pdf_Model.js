const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    filename: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now }
});

const PdfModel = mongoose.model('Cibil-Pdf', pdfSchema);

module.exports = PdfModel;
