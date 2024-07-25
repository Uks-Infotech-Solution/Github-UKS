const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profilePictureSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    fileId: { type: Schema.Types.ObjectId, unique: true, default: mongoose.Types.ObjectId }, // Ensure unique fileId
    imageData: Buffer, // Store image data in binary mode
    filename: String,
    contentType: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now } // Set default upload date to current date
});

const ProfilePicture = mongoose.model('Customer_ProfilePicture', profilePictureSchema);

module.exports = ProfilePicture;
