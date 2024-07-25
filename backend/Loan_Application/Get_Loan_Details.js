// routes/loanApplicationRoutes.js
const express = require('express');
const router = express.Router();
const LoanApplication = require('./Loan_Application_Schema');

// GET all loan applications for a specific customer ID
router.get('/customer/:customerId/loans', async (req, res) => {
    try {
        const { customerId } = req.params;

        // Fetch all loan applications for the given customer ID
        const loanApplications = await LoanApplication.find({ customerId });

        if (!loanApplications || loanApplications.length === 0) {
            return res.status(404).json({ success: false, message: 'No loan applications found for this customer.' });
        }

        res.status(200).json({ success: true, data: loanApplications });
    } catch (error) {
        console.error('Error fetching loan applications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch loan applications.' });
    }
});

module.exports = router;
