// const express = require('express');
// const router = express.Router();
// const DSA = require('./models/dsa'); // Adjust the path to your DSA model

// // DSA registration route
// // router.post('/api/dsa/register', async (req, res) => {
// //     try {
// //         const { dsaName, dsaCompanyName, primaryNumber, alternateNumber, whatsappNumber, email, website, password } = req.body;
// // console.log(req.body);
// //         // Create a new DSA instance
// //         const newDSA = new DSA({
// //             dsaName,
// //             dsaCompanyName,
// //             primaryNumber,
// //             alternateNumber,
// //             whatsappNumber,
// //             email,
// //             website,
// //             password
// //         });

// //         // Save the new DSA to the database
// //         const savedDSA = await newDSA.save();

// //         // Send a success response with the saved DSA
// //         return res.status(201).json({
// //             message: 'DSA registered successfully',
// //             dsa: savedDSA
// //         });
// //     } catch (error) {
// //         console.error('Error registering DSA:', error);

// //         // Check for duplicate key error (MongoDB error code 11000)
// //         if (error.code === 11000) {
// //             return res.status(400).json({ error: 'DSA with this email already exists' });
// //         }

// //         // Send an error response only once
// //         return res.status(500).json({ error: 'Internal server error' });
// //     }
// // });

// module.exports = router;
