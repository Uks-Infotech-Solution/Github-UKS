// profilePictureRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const GridFsStorage  = require('multer-gridfs-storage');
const path = require('path');
const ProfilePicture = require('./models/ProfilePicture_Schema'); // Adjust the path as per your file structure
const Customer = require('./models/Schema'); // Adjust the path as per your file structure

const router = express.Router();

// Create mongo connection
const conn = mongoose.createConnection('mongodb://localhost:27017/Customer', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Init gfs
let gfs;
conn.once('open', () => {
    console.log('MongoDB connection open');
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

// Create storage engine
const storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/Customer',
    file: (req, file) => {
        return {
            filename: file.originalname,
            bucketName: 'uploads'
        };
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        // File filter logic (unchanged from your code)
    }
});

// Endpoint to upload profile picture
router.post('/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        console.log('File uploaded:', req.file);
        
        const { email } = req.body;
        const customer = await Customer.findOne({ customermailid: email });
  
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
  
        const profilePicture = new ProfilePicture({
            customerId: customer._id,
            filename: req.file.filename,
            contentType: req.file.mimetype,
            size: req.file.size,
            uploadDate: new Date(),
            fileId: req.file.id // Store the GridFS file ID
        });
  
        await profilePicture.save();
  
        res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to retrieve profile picture (unchanged from your code)

module.exports = router;