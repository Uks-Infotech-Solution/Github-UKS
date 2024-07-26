const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);
const LoanType = require('./models/LoanType');
const Address = require('./models/Address_Schema') // Adjust the path as per your file structure
const PreviousLoan = require('./models/Previousloan');
const multer = require('multer');   
const ProfilePicture = require('./models/ProfilePicture_Schema');
const PdfModel = require('./models/Pdf_Model'); // Import the PdfModel
const LoanProcessing = require('./models/Loan_Processing_Schema');
const SalariedPerson = require('./models/Salariedperson');
const DocumentType = require('./models/DocumentType');
const Unsecured_DocumentType = require('./models/Unsecured_Document_Type');

const CustomerStatus = require('./models/Customer_status_Schema');
const LoanLevel = require('./models/Loan_Level_schema')     
const FileStatus = require('./models/File_types_Schema');
const DSA_Customer_Table = require('./models/Dsa-Customer-table')
const DSA_Customer_downloadTable = require('./models/Dsa-Customer-downloadtable')
const DSAAddress = require('./DSA/models/Address_Schema');
const Rejected = require('./models/Rejected_reson');
const LoanDetails = require('./DSA/models/DSA_Loan_Details_Schema');
const DSA_RequiredType = require('./DSA/models/DSA_Loan_File_type');
const EmployeeType=require('./models/Employee_Type');
const LoanApplication = require('./Loan_Application/Loan_Application_Schema')
const loanApplicationRoutes = require('../backend/Loan_Application/Get_Loan_Details');
const Feedback = require('./Loan_Application/feedback');
const LoanCancellation = require('./Loan_Application/Cancel_Loan_Schema');
const AppliedLoanStatus = require('./Loan_Application/Applied_Loan_Status_Schema');
// Login session
const LoginSession = require('./Login_Session/Customer_login');
const DSA_LoginSession = require('./Login_Session/DSA_Login_Session');

const ApplyViewCount = require('./DSA/Loan_Applications/Customer_Applied_Loan_View_Count');

const DSABranchDetails = require('../backend/DSA/models/DSA_Branch');
const PackageDetail = require('./UKS/Package');
const BuyPackage = require('./UKS/Buy_Packegers');
const Package_Activation = require('../backend/UKS/Dsa_Package_Activation');
const SalesPerson = require('./UKS/Sales_person_cus_reg');
const SalesPersonDSA= require('./UKS/Sales_person_dsa_reg');

const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const https = require('https');
const WebSocket = require('ws');
const fs = require('fs');
// const bcrypt = require('bcryptjs');

const connectDB = require('../backend/db');
require('dotenv').config();

// DSA
const dsaregister = require('./DSA/dsa-register')

const DSA = require('./DSA/models/dsa')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const server = https.createServer({
    cert: fs.readFileSync('/www/server/panel/vhost/cert/frontend/fullchain.pem'),
    key: fs.readFileSync('/www/server/panel/vhost/cert/frontend/privkey.pem')
}, app);

const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('something');
});

// Define the customer schema
const customerSchema = new Schema({
    title: String,
    customerFname: String,
    customerLname: String,
    gender: String,
    customerType:String,
    customercontact: String,
    customeralterno: String,
    customerwhatsapp: String,
    customermailid: String,
    typeofloan: String,
    loanRequired: Number,
    userpassword: String,
    isActive: {
        type: Boolean,
        default: false,
    },
    activationToken: {
        type: String,
    },
    resetToken: String,
    resetTokenExpiration: Date,
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DSAAddress' // Reference to DSAAddress model
    }
});

// Add auto-increment plugin for customerNo
customerSchema.plugin(AutoIncrement, { inc_field: 'customerNo', start_seq: 1 });

const Customer = mongoose.model('Customer', customerSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage(); // Store file in memory as binary data
const upload = multer({ storage: storage });



connectDB();
// Loan Application
app.use('/api', loanApplicationRoutes);

app.get('/sales/person/list', async (req, res) => {
    try {
      const salesperson = await User.find({ employeeType: 'Sales' });
      console.log(salesperson);
      res.status(200).json(salesperson);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching salesperson', error });
    }
  });
  

app.get('/sales/person/dsa/count/:uksId', async (req, res) => {
    try {
        const salesPersons = await SalesPersonDSA.find({ uksId: req.params.uksId }, { createdAt: 1 }).lean();
        const count = salesPersons.length;
        const createdDates = salesPersons.map(person => ({ _id: person._id, createdAt: person.createdAt }));

        res.status(200).json({ count, createdDates });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching count and created dates', error });
    }
});

app.get('/sales/person/cus/count/:uksId', async (req, res) => {
    try {
        const salesPersons = await SalesPerson.find({ uksId: req.params.uksId }, { createdAt: 1 }).lean();
        const count = salesPersons.length;
        const createdDates = salesPersons.map(person => ({ _id: person._id, createdAt: person.createdAt }));

        res.status(200).json({ count, createdDates });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching count and created dates', error });
    }
});
 
  
app.get('/sales/person/dsa/reg/:uksId', async (req, res) => {
    console.log(req.body);
    try {
      const dsa = await SalesPersonDSA.find({ uksId: req.params.uksId });
      console.log(dsa);
      res.status(200).json(dsa);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dsa', error });
    }
  });
  

app.post('/sales/person/dsa/reg', async (req, res) => {
    const { salesPersonName,uksId,dsaName,dsaId } = req.body;
    console.log(req.body);
    const newDsa = new SalesPersonDSA({
        uksId,
        salesPersonName,
        dsaName,
        dsaId,
    });

    try {
        await newDsa.save();
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error("Error saving data: ", error);
        res.status(500).send('Error saving data');
    }
});

app.get('/sales/person/cus/reg/:uksId', async (req, res) => {
    console.log(req.body);
    try {
      const customers = await SalesPerson.find({ uksId: req.params.uksId });
    //   console.log(customers);
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error });
    }
  });
  
app.post('/sales/person/cus/reg', async (req, res) => {
    const { salesPersonName,uksId,customerName,customerId } = req.body;
    console.log(req.body);
    const newCustomer = new SalesPerson({
        uksId,
        salesPersonName,
        customerName,
        customerId,
    });

    try {
        await newCustomer.save();
        res.status(200).send('Data saved successfully');
    } catch (error) {
        console.error("Error saving data: ", error);
        res.status(500).send('Error saving data');
    }
});


app.get('/sales/packagers', async (req, res) => {
    try {
        const { uksId } = req.query; // Extract uksId from query parameters
        const packagers = await BuyPackage.find({ salespersonId: uksId });
        res.status(200).json({ data: packagers });
    } catch (error) {
        console.error('Error fetching package details:', error);
        res.status(500).json({ message: 'Error fetching package details.', error });
    }
});

app.get('/api/package/details', async (req, res) => {
    const { pkgId } = req.query; // Use req.query to get query parameters
    console.log("Fetching package details for pkgId:", pkgId);
  
    try {
      const packageDetails = await BuyPackage.findById(pkgId);
      if (!packageDetails) {
        return res.status(404).send({ error: 'Package not found' });
      }
      res.status(200).json({ data: packageDetails });
    } catch (error) {
      console.error('Error fetching package details:', error);
      res.status(500).send({ error: 'Server error' });
    }
  });
  

  app.get('/Inactive/packagers', async (req, res) => {
    // console.log("Fetching inactive package details");
    try {
        const inactive_dsa = await BuyPackage.find({ packageStatus: 'Inactive' });
        res.status(200).json({ data: inactive_dsa });
    } catch (error) {
        console.error('Error fetching package details:', error);
        res.status(500).json({ message: 'Error fetching package details.', error });
    }
});


// Route to get packages by dsaId
app.get('/buy_packages/dsa/:dsaId', async (req, res) => {
    try {
      const packages = await BuyPackage.find({ dsaId: req.params.dsaId });
      if (!packages || packages.length === 0) {
        return res.status(404).json({ message: 'No packages found for this DSA ID' });
      }
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching packages', error });
    }
  }); 

// Activation Via Employee


app.post('/api/dsa/packager/activation', async (req, res) => {
    console.log(req.body);
    try {
        // Extract data from request body
        const {
            uksId,
            uksNumber,
            uksName,
            dsaId,
            dsaName,
            dsaNumber,
            pkgId,
            packageName,
            packageAmount,
            downloadAccess,
            loanTypes,
            salesPersonName,
            salesPersonId,
            transferRefNo
        } = req.body;

        // Create a new instance of Activation model
        const newActivation = new Package_Activation({
            uksId,
            uksNumber,
            uksName,
            dsaId,
            dsaName,
            dsaNumber,
            pkgId,
            packageName,
            packageAmount,
            downloadAccess,
            loanTypes,
            status_activation: "Active",
            salesPersonName,
            salesPersonId,
            transferRefNo
        });

        // Save to MongoDB
        const savedActivation = await newActivation.save();

        // Update BuyPackage table for package activation
        const newBuyPackage = await BuyPackage.findById(pkgId);
        if (newBuyPackage) {
            newBuyPackage.packageStatus = 'Active';
            newBuyPackage.uksId = uksId;
            newBuyPackage.activationToken = undefined;
            newBuyPackage.salespersonname = salesPersonName;
            newBuyPackage.salespersonId = salesPersonId;
            newBuyPackage.transferAmountRefNumber = transferRefNo;
            await newBuyPackage.save();
        } else {
            throw new Error('BuyPackage not found');
        }
        res.status(201).json(savedActivation); // Respond with saved data
    } catch (err) {
        console.error('Error saving activation:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Activation Via Email
app.post('/package/activate/:token', async (req, res) => {
    const { token } = req.params;
    const { transferAmountRefNumber } = req.body;
    console.log(req.body, token); // Log request body and token for debugging
  
    try {
      const newBuyPackage = await BuyPackage.findOne({ activationToken: token });
  
      if (!newBuyPackage) {
        return res.status(400).json({ error: 'Invalid or expired confirmation token' });
      }
  
      newBuyPackage.packageStatus = 'Active';
      newBuyPackage.activationToken = undefined;
      newBuyPackage.transferAmountRefNumber = transferAmountRefNumber;
  
      await newBuyPackage.save();
  
      return res.status(200).json({ message: 'Package activated successfully' });
    } catch (err) {
      return res.status(400).json({ error: 'Error activating package: ' + err.message });
    }
  });
  
  
  app.post('/buy_packagers', async (req, res) => {
    const {
      dsaId,
      dsaNumber,
      dsaName,
      dsaCompanyName,
      email,
      primaryNumber,
      packageName,
      downloadAccess,
      packageAmount,
      transferAmountRefNumber,
      loanTypes,
      additionalInputs
    } = req.body;
  
    const token = crypto.randomBytes(32).toString('hex');
  
    try {
      const newPurchase = new BuyPackage({
        dsaId,
        dsaNumber,
        dsaName,
        dsaCompanyName,
        email,
        primaryNumber,
        packageName,
        downloadAccess,
        packageAmount,
        transferAmountRefNumber,
        activationToken: token,
        loanTypes,
        additionalInputs,
        packageStatus: 'Inactive' // Default to 'Inactive' if not provided in req.body
      });
  
      await newPurchase.save();
  
      // Prepare email to be sent to customer
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to:  process.env.EMAIL_USER, // Send email to the customer's email address
        subject: 'Package Activation',
        html: `
          <h4>${dsaName} (UKS-DSA_0${dsaNumber}) Package Activation Mail,</h4>
          <p>${dsaName} has selected the ${packageName} (${packageAmount}) Package,</p>
          <p>To activate this package <a href="https://localhost:8000/package/activate/${token}">Click Here</a>.</p>
          <p>Thanks & regards,<br>LDP Finanserv.</p>`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('DSA Email sent: ' + info.response);
        }
      });
  
      // Send success response with the generated activation token
      res.status(201).json({ message: 'Package purchased successfully', token: token });
    } catch (error) {
      console.error('Error saving purchase:', error);
      res.status(500).json({ error: 'Failed to purchase package' });
    }
  });
  


app.get('/PackageDetails', async (req, res) => {
    console.log("package detail");
    try {
        const packageDetails = await PackageDetail.find();
        res.status(200).json({ data: packageDetails });
    } catch (error) {
        console.error('Error fetching package details:', error);
        res.status(500).json({ message: 'Error fetching package details.', error });
    }
});

// Get package details by uksId
app.get('/uks/PackageDetails/:uksId', async (req, res) => {
    const { uksId } = req.params;
    try {
        const packageDetails = await PackageDetail.find({ uksId }).sort({ createdAt: -1 });
        res.status(200).json({ data: packageDetails });
    } catch (error) {
        console.error('Error fetching package details:', error);
        res.status(500).json({ message: 'Error fetching package details.', error });
    }
});

// Save or update package details
app.post('/uks/savePackageDetails', async (req, res) => {
    const { uksId, packageDetails } = req.body;
console.log(packageDetails);
    try {
        for (let detail of packageDetails) {
            if (detail._id) {
                // Update existing package detail
                const updatedDetail = await PackageDetail.findByIdAndUpdate(detail._id, {
                    ...detail,
                    updatedAt: new Date() // Update the updatedAt field
                }, { new: true });
                if (!updatedDetail) {
                    return res.status(404).json({ message: 'Package detail not found for update.' });
                }
            } else {
                // Create new package detail
                const newDetail = new PackageDetail({
                    ...detail,
                    uksId,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await newDetail.save();
            }
        }
        res.status(200).json({ message: 'Package details saved successfully.' });
    } catch (error) {
        console.error('Error saving package details:', error);
        res.status(500).json({ message: 'Error saving package details.', error });
    }
});

// Delete a package detail by ID
app.delete('/uks/PackageDetails/:packageId', async (req, res) => {
    const { packageId } = req.params;
    console.log(packageId);
    try {
        await PackageDetail.findByIdAndDelete(packageId);
        res.status(200).json({ message: 'Package detail deleted successfully.' });
    } catch (error) {
        console.error('Error deleting package detail:', error);
        res.status(500).json({ message: 'Error deleting package detail.', error });
    }
});





// Get Branch Details
app.get('/dsa/BranchDetails/:dsaId', async (req, res) => {
    const { dsaId } = req.params;
    try {
        const branchDetails = await DSABranchDetails.find({ dsaId }).sort({ createdAt: -1 });
        res.status(200).json({ data: branchDetails });
    } catch (error) {
        console.error('Error retrieving branch details:', error);
        res.status(500).json({ message: 'Error retrieving branch details.', error });
    }
});

// Express POST endpoint for saving/updating branch details

app.post('/dsa/saveBranchDetails', async (req, res) => {
    const { dsaId, branchDetails } = req.body;
    try {
        for (let branch of branchDetails) {
            if (!branch.branchContact || branch.branchContact.toString().length !== 10) {
                return res.status(400).json({ message: 'Branch contact must be a 10-digit number.' });
            }

            if (branch._id) {
                // Update existing branch detail
                const updatedBranch = await DSABranchDetails.findByIdAndUpdate(branch._id, {
                    ...branch,
                    updatedAt: new Date() // Update the updatedAt field
                }, { new: true });
                if (!updatedBranch) {
                    return res.status(404).json({ message: 'Branch not found for update.' });
                }
            } else {
                // Create new branch detail
                const newBranch = new DSABranchDetails({
                    ...branch,
                    dsaId,
                    status: 'Active',
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                await newBranch.save();
            }
        }
        res.status(200).json({ message: 'Branch details saved successfully.' });
    } catch (error) {
        console.error('Error saving branch details:', error);
        res.status(500).json({ message: 'Error saving branch details.', error });
    }
});
// Update Branch Status to Inactive
// PATCH endpoint to update branch status to Inactive

app.delete('/dsa/BranchDetails/:branchId', async (req, res) => {
    const { branchId } = req.params;
    try {
        await DSABranchDetails.findByIdAndDelete(branchId);
        res.status(200).json({ message: 'Branch detail deleted successfully.' });
    } catch (error) {
        console.error('Error deleting branch detail:', error);
        res.status(500).json({ message: 'Error deleting branch detail.', error });
    }
});


// Apply_Loan_Status_Update

app.get('/api/dsa/loan/status/count/customer:customerId', async (req, res) => {
    const { customerId } = req.params;

    try {
        const approvedCount = await AppliedLoanStatus.countDocuments({ customerId, status: 'Approved' });
        const rejectedCount = await AppliedLoanStatus.countDocuments({ customerId, status: 'Rejected' });

        res.status(200).json({
            approvedCount,
            rejectedCount
        });
    } catch (error) {
        console.error('Error fetching loan status counts:', error);
        res.status(500).json({ error: 'Failed to fetch loan status counts' });
    }
});

app.get('/api/dsa/loan/status/count/:dsaId', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const approvedCount = await AppliedLoanStatus.countDocuments({ dsaId, status: 'Approved' });
        const rejectedCount = await AppliedLoanStatus.countDocuments({ dsaId, status: 'Rejected' });

        res.status(200).json({
            approvedCount,
            rejectedCount
        });
    } catch (error) {
        console.error('Error fetching loan status counts:', error);
        res.status(500).json({ error: 'Failed to fetch loan status counts' });
    }
});

app.post('/api/customer/dsa/updateStatus', async (req, res) => {
    const { customerId, dsaId, loanId, newStatus, dateTime } = req.body;

    try {
        // Update the applyLoanStatus in the LoanApplication collection
        const updatedLoanApplication = await LoanApplication.findOneAndUpdate(
            { _id: loanId, customerId, dsaId },
            { applyLoanStatus: newStatus },
            { new: true }
        );

        if (!updatedLoanApplication) {
            return res.status(404).json({ success: false, message: 'Loan application not found' });
        }

        // Check if the status entry already exists for the same customerId, dsaId, and loanId
        let newStatusEntry;
        const existingStatusEntry = await AppliedLoanStatus.findOne({ customerId, dsaId, loanId });

        if (existingStatusEntry) {
            // Update the existing status entry with newStatus and dateTime
            existingStatusEntry.status = newStatus;
            existingStatusEntry.dateTime = dateTime;
            newStatusEntry = await existingStatusEntry.save();
        } else {
            // Create a new status entry in the AppliedLoanStatus collection
            newStatusEntry = new AppliedLoanStatus({
                customerId,
                dsaId,
                loanId,
                status: newStatus,
                dateTime
            });
            await newStatusEntry.save();
        }

        res.status(200).json({ success: true, message: 'Loan status updated successfully' });
    } catch (error) {
        console.error('Error updating loan status:', error);
        res.status(500).json({ success: false, message: 'Failed to update loan status' });
    }
});

// Dsa_Customer_Applied_Loan_View_Count

app.get('/dsa/customer/apply/view/count/:dsaId', async (req, res) => {
    try {
        const { dsaId } = req.params;
        console.log("view count");
        // Count the number of documents with the specified dsaId
        const count = await ApplyViewCount.countDocuments({ dsaId });
        console.log(count);
        res.status(200).send({ message: 'Count retrieved successfully', count });
    } catch (error) {
        console.error('Error retrieving count:', error.message);
        res.status(500).send({ error: 'Server error' });
    }
});

app.post('/dsa/customer/apply/view/count', async (req, res) => {
    try {
        const { customerId, dsaId, loanId, applicationNumber, date } = req.body;
        //   console.log(req.body);

        // Define the filter criteria
        const filter = { customerId, dsaId, loanId };

        // Define the update operation
        const update = {
            $set: {
                applicationNumber,
                date: date || new Date()
            }
        };

        // Define the options to return the new document after update, and create a new document if none exists
        const options = { new: true, upsert: true };

        // Perform the update operation
        const applyView = await ApplyViewCount.findOneAndUpdate(filter, update, options);

        res.status(201).send({ message: 'Data stored successfully', data: applyView });
    } catch (error) {
        console.error('Error storing data:', error.message);
        res.status(500).send({ error: 'Server error' });
    }
});


app.get('/api/dsa/applications/loan/:loanId', async (req, res) => {
    const { loanId } = req.params;
    console.log("Fetching loan applications for Loan ID:", loanId);

    try {
        const loanApplication = await LoanApplication.findById(loanId);
        if (!loanApplication) {
            return res.status(404).send({ error: 'Loan application not found' });
        }
        res.status(200).json({ loanApplication });
    } catch (error) {
        console.error('Error finding loan applications:', error);
        res.status(500).send({ error: 'Server error' });
    }
});





app.get('/api/dsa/applications/count/:dsaId', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const count = await LoanApplication.countDocuments({ dsaId });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching loan application count:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// DSA_LOgin_Session

app.post('/dsa/login/session', async (req, res) => {
    try {
        const { dsaId, loginDateTime } = req.body;

        // Create a new login session document
        const newSession = new DSA_LoginSession({
            dsaId,
            loginDateTime
        });

        // Save the session document to the database
        await newSession.save();

        res.status(201).json({ message: 'Login session stored successfully' });
    } catch (error) {
        console.error('Error storing login session:', error);
        res.status(500).json({ error: 'An error occurred while storing the login session' });
    }
});

// Endpoint to fetch the last login session for a DSA

// Endpoint to fetch the last (previous) login session for a DSA
app.get('/dsa/login/last-session', async (req, res) => {
    console.log("Fetching last login session for DSA ID:", req.query.dsaId);
    try {
        const { dsaId } = req.query;
        const sessions = await DSA_LoginSession.find({ dsaId }).sort({ loginDateTime: -1 }).limit(2);

        if (sessions.length < 2) {
            return res.status(404).json({ error: 'No previous login session found for the given DSA ID' });
        }

        const lastSession = sessions[1]; // The second most recent session
        res.status(200).json(lastSession);
    } catch (error) {
        console.error('Error fetching last login session:', error);
        res.status(500).json({ error: 'An error occurred while fetching the last login session' });
    }
});




// Customer Login Session
app.post('/customer/login/session', async (req, res) => {
    try {
        const { customerId, loginDateTime } = req.body;

        // Create a new login session document
        const newSession = new LoginSession({
            customerId,
            loginDateTime
        });

        // Save the session document to the database
        await newSession.save();

        res.status(201).json({ message: 'Login session stored successfully' });
    } catch (error) {
        console.error('Error storing login session:', error);
        res.status(500).json({ error: 'An error occurred while storing the login session' });
    }
});

app.get('/customer/login/last-session', async (req, res) => {
    console.log("Fetching last login session for customer ID:", req.query.customerId);
    try {
        const { customerId } = req.query;
        const sessions = await LoginSession.find({ customerId }).sort({ loginDateTime: -1 }).limit(2);

        if (sessions.length < 2) {
            return res.status(404).json({ error: 'No previous login session found for the given customer ID' });
        }

        const lastSession = sessions[1]; // The second most recent session
        res.status(200).json(lastSession);
    } catch (error) {
        console.error('Error fetching last login session:', error);
        res.status(500).json({ error: 'An error occurred while fetching the last login session' });
    }
});


//DSA  FEEDBACK

app.get('/loan/api/feedback/:dsaId', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const feedbacks = await Feedback.find({ dsaId });
        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

app.post('/loan/api/feedback', async (req, res) => {
    const { customerId, dsaId, rating, serviceQuality, textFeedback, date } = req.body;

    try {
        // Check if feedback already exists for the customerId and dsaId
        let existingFeedback = await Feedback.findOne({ customerId, dsaId });

        if (existingFeedback) {
            // If feedback exists, update the existing entry
            existingFeedback.rating = rating;
            existingFeedback.serviceQuality = serviceQuality;
            existingFeedback.textFeedback = textFeedback;
            existingFeedback.date = date;
            await existingFeedback.save();
            res.status(200).json({ message: 'Feedback updated successfully' });
        } else {
            // If no feedback exists, create a new entry
            const newFeedback = new Feedback({ customerId, dsaId, rating, serviceQuality, textFeedback, date });
            await newFeedback.save();
            res.status(201).json({ message: 'Feedback submitted successfully' });
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
});



// Get a Loan with particular customer// Example route setup in your Express server


app.get('/api/customer/dsa/loans/:loanId', async (req, res) => {
    try {
        const { loanId } = req.params;
        console.log("Fetching loans for loanId:", loanId);

        // Logic to fetch loan details from your database based on loanId
        const loanApplication = await LoanApplication.findById(loanId);

        if (!loanApplication) {
            return res.status(404).json({ success: false, message: 'No loan application found for this loan ID.' });
        }

        res.status(200).json({ success: true, data: loanApplication });
    } catch (error) {
        console.error('Error fetching loan application:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch loan application.' });
    }
});



// Loan Apply
app.get('/customer/loan/application', async (req, res) => {
    try {
        const loanApplications = await LoanApplication.find();
        res.status(200).json(loanApplications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching loan applications" });
    }
});



app.get('/dsa/customer/applied/loan/:dsaId', async (req, res) => {
    const dsaId = req.params.dsaId;
    try {
        const loanApplications = await LoanApplication.find({ dsaId: dsaId });
        res.status(200).json(loanApplications);
    } catch (error) {
        res.status(500).json({ error: "Error fetching loan applications" });
    }
});

app.post('/customer/loan/apply', async (req, res) => {
    try {
        console.log(req.body);

        const {
            customerId,
            customerName,
            customerNo,
            customerMailId,
            loanType,
            loanAmount,
            loanRequiredDays,
            dsaId,
            dsaName,
            dsaNumber,
            dsaCompanyName,
            applyLoanStatus,
            loanLevel,
            loanSecured,
            documentType,
            documentOption
        } = req.body;
        // Create a new instance of AppliedLoanStatus
        const newAppliedLoanStatus = new LoanApplication({
            customerId,
            customerName,
            customerNo,
            customerMailId,
            loanType,
            loanAmount,
            loanRequiredDays,
            dsaId,
            dsaName,
            dsaNumber,
            dsaCompanyName,
            applyLoanStatus,
            loanLevel,
            loanSecured,
            documentType,
            documentOption
        });

        // Save the new applied loan status to MongoDB
        const savedLoanApplication = await newAppliedLoanStatus.save();

        // Respond with the saved data
        res.status(201).json({
            success: true,
            data: savedLoanApplication
        });
    } catch (error) {
        console.error('Error submitting loan application:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit loan application'
        });
    }
});

// server.js or routes file

app.post('/customer/loan/cancel', async (req, res) => {
    try {
        const { customerId, dsaId, loanId } = req.body;

        // Find the loan application and update the customerLoanStatus
        const loanApplication = await LoanApplication.findOneAndUpdate(
            { _id: loanId },
            { customerLoanStatus: 'Inactive' },
            { new: true }
        );

        if (!loanApplication) {
            return res.status(404).json({
                success: false,
                error: 'Loan application not found'
            });
        }

        // Create a new cancellation record
        const cancellationRecord = new LoanCancellation({
            customerId,
            dsaId,
            loanId,
            cancellationDate: new Date(),
            customerLoanStatus: 'Inactive'
        });

        // Save the cancellation record
        await cancellationRecord.save();

        res.status(200).json({
            success: true,
            message: 'Loan application cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling loan application:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel loan application'
        });
    }
});


// Endpoint to deactivate DSA account
app.delete('/api/dsa/deactivate/:dsaId', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const dsa = await DSA.findById(dsaId);
        if (!dsa) {
            return res.status(404).json({ error: 'DSA not found' });
        }

        // Update dsa_status to 'inactive'
        dsa.dsa_status = 'Inactive';
        await dsa.save();

        return res.status(200).json({ message: 'DSA account deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating DSA account:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
// Import your LoanDetails model
app.get('/api/dsa/:dsaId/loanDetails', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const loanDetails = await LoanDetails.find({ dsaId });
        res.status(200).json({ loanDetails });
    } catch (error) {
        console.error('Error fetching loan details:', error);
        res.status(500).json({ error: 'Failed to fetch loan details' });
    }
});

app.delete('/api/dsa/loanDetails/:loanId', async (req, res) => {
    const { loanId } = req.params;

    try {
        await LoanDetails.findByIdAndDelete(loanId);
        res.status(200).json({ message: 'Loan detail deleted successfully' });
    } catch (error) {
        console.error('Error deleting loan detail:', error);
        res.status(500).json({ error: 'Failed to delete loan detail' });
    }
})

app.get('/api/dsa/getLoanDetails/:dsaId', async (req, res) => {
    const { dsaId } = req.params;

    try {
        const loanDetails = await LoanDetails.find({ dsaId });

        if (!loanDetails || loanDetails.length === 0) {
            return res.status(404).json({ error: 'No loan details found for this DSA' });
        }

        res.status(200).json({ loanDetails });
    } catch (error) {
        console.error('Error fetching loan details:', error);
        res.status(500).json({ error: 'Failed to fetch loan details' });
    }
});

app.post('/api/dsa/saveLoanDetails', async (req, res) => {
    const { dsaId, loanDetails } = req.body;

    try {
        const dsa = await DSA.findById(dsaId);
        if (!dsa) {
            return res.status(404).json({ error: 'DSA not found' });
        }

        if (!Array.isArray(loanDetails)) {
            return res.status(400).json({ error: 'Invalid data format: loanDetails must be an array' });
        }

        const savedLoanDetails = await Promise.all(
            loanDetails.map(async loan => {
                let existingLoanDetail;

                if (loan._id) {
                    existingLoanDetail = await LoanDetails.findById(loan._id);
                }

                if (existingLoanDetail) {
                    // Update existing loan detail
                    existingLoanDetail.typeOfLoan = loan.typeOfLoan;
                    existingLoanDetail.requiredDays = loan.requiredDays;
                    existingLoanDetail.requiredDocument = loan.requiredDocument;
                    existingLoanDetail.requiredType = loan.requiredType;
                    existingLoanDetail.requiredCibilScore = loan.requiredCibilScore;
                    existingLoanDetail.updatedAt = new Date();

                    return existingLoanDetail.save();
                } else {
                    // Insert new loan detail
                    return LoanDetails.create({
                        dsaId: dsa._id,
                        typeOfLoan: loan.typeOfLoan,
                        requiredDays: loan.requiredDays,
                        requiredDocument: loan.requiredDocument,
                        requiredType: loan.requiredType,
                        requiredCibilScore: loan.requiredCibilScore,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            })
        );

        res.status(200).json({ message: 'Loan details saved successfully', savedLoanDetails });
    } catch (error) {
        console.error('Error saving loan details:', error);
        res.status(500).json({ error: 'Failed to save loan details' });
    }
});


// DSA API'S

app.get('/api/dsa', async (req, res) => {
    try {
        const { dsaId } = req.query;
        console.log("dsa id" + req.query);

        const dsa = await DSA.findById(dsaId);

        if (!dsa) {
            return res.status(404).json({ error: 'DSA not found' });
        }
        res.status(200).json(dsa);
    } catch (error) {
        console.error('Error fetching DSA details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/dsa/list', async (req, res) => {
    try {
        const dsaList = await DSA.find();
        res.status(200).json({ dsa: dsaList });
    } catch (error) {
        console.error('Error fetching DSA list:', error);
        res.status(500).json({ message: 'Error fetching DSA list' });
    }
});

app.get('/dsa/activate/:token', async (req, res) => {
    const { token } = req.params;
    console.log(token);

    try {
        const dsa = await DSA.findOne({ activationToken: token });
        if (!dsa) {
            return res.status(400).json('Invalid or expired confirmation token');
        }
        dsa.dsa_status = 'Active';
        dsa.isActive = true;
        dsa.activationToken = undefined;
        await dsa.save();

        // Send a JSON response with a redirect URL
        // const redirectUrl = `${process.env.BASE_URL}/dsa/login`;
        return res.status(200).json('Email confirmed successfully');
    } catch (err) {
        return res.status(400).json({ error: 'Error: ' + err });
    }
});
app.post('/api/dsa/register', async (req, res) => {
    try {
        const token = crypto.randomBytes(32).toString('hex');
        const { dsaName, dsaCompanyName, primaryNumber, alternateNumber, whatsappNumber, email, website, password } = req.body;
        // console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new DSA instance
        const newDSA = new DSA({
            dsaName,
            dsaCompanyName,
            primaryNumber,
            alternateNumber,
            whatsappNumber,
            email,
            website,
            password : hashedPassword,
            activationToken: token,
            dsa_status: 'Inactive'
        });

        // Save the new DSA to the database
        const savedDSA = await newDSA.save();
        const confirmationUrl = `https://localhost:8000/dsa/activate/${token}`;
        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Confirmation',
            // text: `Hello ${dsaName},\n\nPlease confirm your email by clicking the following link: ${confirmationUrl}\n\nThank you!`,
            html: `
            <p>Hello ${dsaName},</p>
            <p>Welcome to LDP Finanserv ,</p>
            <p>To Activate Your Account  <a href="https://localhost:8000/dsa/activate/${token}">Click </a> Here.</p>
            <p>Thanks & regards,<br>LDP Finanserv.</p>`,
        
        
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('DSA Email sent: ' + info.response);
            }
        });
        // Send a success response with the saved DSA
        return res.status(201).json({
            message: 'DSA registered successfully',
            dsa: savedDSA
        });
    } catch (error) {
        console.error('Error registering DSA:', error);

        // Check for duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            return res.status(400).json({ error: 'DSA with this email already exists' });
        }

        // Send an error response only once
        return res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/dsa/address', async (req, res) => {
    const { dsaId, aadharAddress, permanentAddress } = req.body;
    // console.log(dsaId, aadharAddress, permanentAddress);
    try {
        // Check if dsaId exists in DSA model
        const dsaExists = await DSA.exists({ _id: dsaId });
        if (!dsaExists) {
            return res.status(404).send('DSA not found');
        }

        // Check if DSAAddress already exists for dsaId
        let existingDSAAddress = await DSAAddress.findOne({ dsaId });

        if (existingDSAAddress) {
            // Update existing DSAAddress
            existingDSAAddress.aadharAddress = aadharAddress;
            existingDSAAddress.permanentAddress = permanentAddress;
            await existingDSAAddress.save();
            return res.status(200).send('DSA Address updated successfully');
        } else {
            // Create new DSAAddress if not exists
            const newDSAAddress = new DSAAddress({ dsaId, aadharAddress, permanentAddress });
            await newDSAAddress.save();
            return res.status(200).send('DSA Address saved successfully');
        }
    } catch (error) {
        console.error('Error saving/updating DSA Address:', error);
        res.status(500).send('Error saving/updating DSA Address');
    }
});

// Endpoint to fetch DSA address// Example backend route handler
app.get('/api/dsa/address', async (req, res) => {
    try {
        const { dsaId } = req.query;
        const address = await DSAAddress.findOne({ dsaId });
        // console.log('Address data:', address); 
        res.json(address);
    } catch (error) {
        console.error('Error fetching address:', error);
        res.status(500).send('Server Error');
    }
});


// Backend implementation for fetching DSA details by email

// app.get('/api/dsa', async (req, res) => {
//     try {
//         const { dsaId } = req.query;
//         console.log("dsa id" + req.query);

//         const dsa = await DSA.findById(dsaId).populate('address');

//         if (!dsa) {
//             return res.status(404).json({ error: 'DSA not found' });
//         }
//         res.status(200).json(dsa);
//     } catch (error) {
//         console.error('Error fetching DSA details:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });
app.put('/api/dsa/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;

        const updatedDSA = await DSA.findByIdAndUpdate(id, update, { new: true });

        if (updatedDSA) {
            res.status(200).json(updatedDSA);
        } else {
            res.status(404).json({ error: 'DSA not found' });
        }
    } catch (error) {
        console.error('Error updating DSA:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/dsa-login', async (req, res) => {
    try {
        const { email, password } = req.query;
        
        // Validate user input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find DSA by email
        const dsa = await DSA.findOne({ email });
        if (!dsa) {
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Check if the account is active
        if (!dsa.isActive) {
            return res.status(400).json({ success: false, message: 'Please activate your account to login' });
        }

        // Compare passwords using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, dsa.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // If passwords match, login is successful
        // Remove sensitive information from the response object (e.g., password)
        const { password: dsaPassword, ...dsaWithoutPassword } = dsa.toObject();
        return res.status(200).json({ success: true, dsa: dsaWithoutPassword, dsaId: dsa._id });

    } catch (error) {
        console.error('Error during DSA login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/dsa/forgotpassword', async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email);

    try {
        const dsa = await DSA.findOne({ email });
        if (!dsa) {
            return res.status(404).send('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        dsa.resetToken = token;
        dsa.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        console.log('Generated token:', token);
        console.log('Token expiration:', new Date(dsa.resetTokenExpiration));

        await dsa.save();
        console.log('Token saved to database');

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: dsa.email,
            subject: 'Password Reset',
            html: `
            <p>Hi ${dsa.dsaName},</p>
            <p><a href="https://localhost:8000/dsa/reset/password/${token}">Click</a> to Reset Your Account (UKS-DSA-00${dsa.dsaNumber}) Password.</p>
            <p>Thanks & regards,<br>LDP Finanserv.</p>
        `,
        
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            }
            console.log('Email sent:', info.response);
            res.send('Password reset email sent');
        });
    } catch (err) {
        console.error('Error during password reset process:', err);
        return res.status(500).json('Error: ' + err);
    }
});

app.post('/dsa/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Received password reset request for token:', token);
    console.log('New password:', password);

    try {
        const dsa = await DSA.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!dsa) {
            console.log('Password reset token is invalid or has expired.');
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password before saving
        // const hashedPassword = await bcrypt.hash(password, 12);

        dsa.password = password;
        dsa.resetToken = undefined;
        dsa.resetTokenExpiration = undefined;

        await dsa.save();
        console.log('Password has been reset and saved successfully.');

        res.send('Password has been reset');
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json('Error: ' + err);
    }
});

// ANOTHHER API'S
app.post('/api/customer_file_status_update', async (req, res) => {
    try {
        const { customerId, fileStatus, rejectionReason, dsaId } = req.body;

        // Find the customer by ID
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the existing loan processing details, or create a new one if it doesn't exist
        const updatedLoanProcessing = await LoanProcessing.findOneAndUpdate(
            { customerId: customer._id },
            { $set: { fileStatus } },
            { new: true, upsert: true }
        );

        // Handle rejection reason if the file status is 'Rejected'
        if (fileStatus === 'Rejected' && rejectionReason) {
            const newRejected = new Rejected({
                customerId: customer._id,
                fileStatus,
                rejectionReason,
                dsaId
            });
            await newRejected.save();
        }

        res.status(201).json({ message: 'Loan processing details saved successfully', loanProcessing: updatedLoanProcessing });
    } catch (error) {
        console.error('Error saving loan processing details:', error);
        res.status(500).json({ message: 'Failed to save loan processing details' });
    }
});


app.post('/api/block_status_update', async (req, res) => {
    // console.log('Received request:', req.body);

    try {
        const { customerId, blockStatus, fileStatus } = req.body;

        // Find the customer by ID
        const customer = await Customer.findById(customerId);

        if (!customer) {
            console.log('Customer not found');
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find and update the existing loan processing details, or create a new one if it doesn't exist
        const updatedLoanProcessing = await LoanProcessing.findOneAndUpdate(
            { customerId: customer._id },
            {
                $set: {
                    blockStatus,
                    fileStatus
                }
            },
            { new: true, upsert: true }
        );

        console.log('Loan processing details updated:', updatedLoanProcessing);
        res.status(201).json({ message: 'Loan processing details saved successfully', loanProcessing: updatedLoanProcessing });
    } catch (error) {
        console.error('Error saving loan processing details:', error);
        res.status(500).json({ message: 'Failed to save loan processing details' });
    }
});

// DSA
app.get('/dsa/download/count', async (req, res) => {
    try {
        const { dsaId } = req.query;

        // Validate the query parameter
        if (!dsaId) {
            return res.status(400).json({ message: 'Dsa ID is required' });
        }

        // Count the number of documents with the provided customerId
        const count = await DSA_Customer_downloadTable.countDocuments({ dsaId: new mongoose.Types.ObjectId(dsaId) });
        console.log(count);

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting documents in DSA_Customer_downloadTable:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/dsa/table/count', async (req, res) => {
    try {
        const { dsaId } = req.query;

        // Validate the query parameter
        if (!dsaId) {
            return res.status(400).json({ message: 'Dsa ID is required' });
        }

        // Count the number of documents with the provided customerId
        const count = await DSA_Customer_Table.countDocuments({ dsaId: new mongoose.Types.ObjectId(dsaId) });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting documents in DSA_Customer_Table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/dsa-customer/downloadtable/count', async (req, res) => {
    try {
        const { customerId } = req.query;

        // Validate the query parameter
        if (!customerId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        // Count the number of documents with the provided customerId
        const count = await DSA_Customer_downloadTable.countDocuments({ customerId: new mongoose.Types.ObjectId(customerId) });
        // console.log(count);

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting documents in DSA_Customer_downloadTable:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to count documents in DSA_Customer_Table
app.get('/dsa-customer/table/count', async (req, res) => {
    try {
        const { customerId } = req.query;

        // Validate the query parameter
        if (!customerId) {
            return res.status(400).json({ message: 'Customer ID is required' });
        }

        // Count the number of documents with the provided customerId
        const count = await DSA_Customer_Table.countDocuments({ customerId: new mongoose.Types.ObjectId(customerId) });

        res.status(200).json({ count });
    } catch (error) {
        console.error('Error counting documents in DSA_Customer_Table:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.post('/dsa-customer/downloadtable', async (req, res) => {
    try {
        const { dsaId, customerId } = req.body;

        // Validate the request body
        if (!dsaId || !customerId) {
            return res.status(400).json({ message: 'DSA ID and Customer ID are required' });
        }

        // Check if an entry with the same dsaId and customerId already exists
        const existingEntry = await DSA.findOne({ dsaId, customerId });

        if (existingEntry) {
            // Update the createdAt date of the existing entry
            existingEntry.createdAt = Date.now();
            await existingEntry.save();
            return res.status(200).json({ message: 'Data updated successfully' });
        }

        // Create a new entry if no existing entry is found
        const newData = new DSA_Customer_downloadTable({
            dsaId,
            customerId
        });

        // Save the new entry to the database
        await newData.save();

        res.status(201).json({ message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/dsa-customer/table', async (req, res) => {
    try {
        const { dsaId, customerId } = req.body;

        // Validate the request body
        if (!dsaId || !customerId) {
            return res.status(400).json({ message: 'DSA ID and Customer ID are required' });
        }

        // Check if an entry with the same dsaId and customerId already exists
        const existingEntry = await DSA_Customer_Table.findOne({ dsaId, customerId });

        if (existingEntry) {
            // Update the createdAt date of the existing entry
            existingEntry.createdAt = Date.now();
            await existingEntry.save();
            return res.status(200).json({ message: 'Data updated successfully' });
        }

        // Create a new entry if no existing entry is found
        const newData = new DSA_Customer_Table({
            dsaId,
            customerId
        });

        // Save the new entry to the database
        await newData.save();

        res.status(201).json({ message: 'Data stored successfully' });
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/customer/status', async (req, res) => {
    // console.log("***********************");
    // const { email } = req.query;

    // console.log("email",email);

    try {
        // const { startdt, enddt} = req.query;
        // const startDate = moment.tz(new Date(startdt), 'Asia/Kolkata').startOf('day').toDate();
        // const endDate = moment.tz(new Date(enddt), 'Asia/Kolkata').endOf('day').toDate();
        // console.log("startDate",startDate);
        // console.log("endDate", endDate);

        const customercount = await Customer.countDocuments();
        const activeCount = await CustomerStatus.countDocuments({
            status: 'Active'
            //     ,created_dt: {
            //     $gte: startDate,
            //     $lt: endDate
            //   }
        });
        const inactiveCount = await CustomerStatus.countDocuments({
            status: 'InActive'
            //     ,created_dt: {
            //     $gte: startDate,
            //     $lt: endDate
            //   }
        });


        // console.log("Active Count:", activeCount);
        // console.log("Inactive Count:", inactiveCount);

        res.json({
            totalcustomer: customercount,
            activestatus: activeCount,
            inactivestatus: inactiveCount
        });
        // Update this line to return only the status field
        //   res.json({ status: customerStatus.status });
    } catch (error) {
        console.error('Error fetching Salaried Person details:', error.message);
        res.status(500).json({ error: 'Error fetching Salaried Person details', details: error.message });
    }
});


// Define the route to get the customer status by email
app.get('/customer/status/table', async (req, res) => {
    const { customerId } = req.query;

    try {
        // Find the customer by email
        const customer = await Customer.findById(customerId);


        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find the customer status by customerId
        const customerStatus = await CustomerStatus.findOne({ customerId: customer._id });

        if (!customerStatus) {
            return res.status(404).json({ message: 'Customer status not found' });
        }

        res.json({ status: customerStatus.status });
    } catch (error) {
        console.error('Error fetching customer status:', error);
        res.status(500).json({ message: 'Failed to fetch customer status' });
    }
});

app.post('/customer/status', async (req, res) => {
    const { customerId, status } = req.body;

    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const customerStatus = await CustomerStatus.findOneAndUpdate(
            { customerId: customer._id },
            {
                customerId: customer._id,
                status: status,
                created_dt: new Date()
            },
            { new: true, upsert: true }
        );

        return res.status(200).json({ message: 'Customer status updated successfully', customerStatus });
    } catch (error) {
        console.error('Error updating customer status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// CUSTOMER SALARIED PERSON API

app.post('/salariedperson', async (req, res) => {
    // console.log('Request body:', req.body);
    const { customerId, salariedperson } = req.body;
    // console.log(email, salariedperson);

    try {
        // Check if email exists in Customer collection
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Remove existing salaried person details for the customer
        await SalariedPerson.deleteMany({ customerId: customer._id });

        // Save new Salaried Person details
        const savedSalariedPersons = await Promise.all(salariedperson.map(async (person) => {
            const newSalariedPerson = new SalariedPerson({
                customerId: customer._id, // Use the found customer's ID
                companyName: person.companyName,
                role: person.role,
                monthlySalary: person.monthlySalary,
                workExperience: person.workExperience,
            });
            return await newSalariedPerson.save();

        }));
        //   console.log(savedSalariedPersons);
        res.json({ message: 'Salaried Person details saved successfully', salariedPersons: savedSalariedPersons });
    } catch (error) {
        console.error('Error saving Salaried Person details:', error.message);
        res.status(500).json({ error: 'Error saving Salaried Person details', details: error.message });
    }
});
app.delete('/salariedperson/:id', async (req, res) => {
    const { id } = req.params;
    // console.log(id);

    try {
        await SalariedPerson.findByIdAndDelete(id);
        res.json({ message: 'Salaried Person deleted successfully' });
    } catch (error) {
        console.error('Error deleting Salaried Person:', error.message);
        res.status(500).json({ error: 'Error deleting Salaried Person', details: error.message });
    }
});
app.get('/salariedperson', async (req, res) => {
    const { customerId } = req.query;
    // console.log(email);

    try {
        // Check if email exists in Customer collection
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Find salaried person details for the customer
        const salariedPersons = await SalariedPerson.find({ customerId: customer._id });

        res.json({ salariedPersons });
        // console.log(salariedPersons);
    } catch (error) {
        console.error('Error fetching Salaried Person details:', error.message);
        res.status(500).json({ error: 'Error fetching Salaried Person details', details: error.message });
    }
});

// app.get('/customer/:customerId/pdf', async (req, res) => {
//     try {
//         const customerId = req.params.customerId;
//         const customer = await Customer.findById(customerId);

//         if (!customer || !customer.pdfData) {
//             return res.status(404).send('PDF not found');
//         }

//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Length': customer.pdfData.length
//         });
//         res.send(customer.pdfData);
//         // console.log(customer.pdfData);
//     } catch (error) {
//         console.error('Error retrieving PDF:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });





// CUSTOMER ADDRESS
app.post('/add-address', async (req, res) => {
    const { customerId, address } = req.body;
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        let existingAddress = await Address.findOne({ customerId: customer._id });
        if (existingAddress) {
            existingAddress = await Address.findOneAndUpdate(
                { customerId: customer._id },
                address,
                { new: true }
            );
            // console.log(address);
        } else {
            const newAddress = new Address({ customerId: customer._id, ...address });
            await newAddress.save();

            existingAddress = newAddress;
            // console.log(newAddress);
        }

        res.json(existingAddress);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
app.get('/view-address', async (req, res) => {
    const { customerId } = req.query;
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        const address = await Address.findOne({ customerId: customer._id });
        if (!address) {
            return res.status(404).json({ error: 'Address not found' });
        }

        res.json(address);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



// CUSTOMER PREVIOUS LOAN API'S

// Endpoint to add/update previous loans
app.post('/add-previous-loans', async (req, res) => {
    const { customerId, previousLoans } = req.body;
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        await PreviousLoan.deleteMany({ customerId: customer._id });
        await PreviousLoan.insertMany(previousLoans.map(loan => ({
            customerId: customer._id,
            financeName: loan.financeName,
            yearOfLoan: loan.yearOfLoan || undefined, // Handle null values
            loanAmount: loan.loanAmount,
            outstandingAmount: loan.outstandingAmount
        })));

        res.json({ message: 'Previous loans updated successfully' });
    } catch (error) {
        console.error('Error adding/updating previous loans:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Endpoint to get previous loans
app.get('/get-previous-loans', async (req, res) => {
    const { customerId } = req.query;
    try {
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const previousLoans = await PreviousLoan.find({ customerId: customer._id });
        res.status(200).json(previousLoans);
    } catch (error) {
        console.error('Error fetching previous loans:', error);
        res.status(500).json({ message: 'Failed to fetch previous loans' });
    }
});
// Endpoint to delete a previous loan
app.delete('/delete-previous-loan/:loanId', async (req, res) => {
    const { loanId } = req.params;
    try {
        const deletedLoan = await PreviousLoan.findByIdAndDelete(loanId);
        if (!deletedLoan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.json({ message: 'Previous loan deleted successfully' });
    } catch (error) {
        console.error('Error deleting previous loan:', error);
        res.status(500).json({ message: 'Failed to delete previous loan' });
    }
});




// CUSTOMER LOAN PROCESSING API

app.post('/api/save-loan-processing', async (req, res) => {
    try {
        const { customerEmail, checkBounds, blockStatus, fileStatus, loanType, documentStatus, monthlyIncome, msneNo, gstNo, cibilRecord, selectedOptions, documentType, customerId } = req.body; // Add documentType to the request body

        // Find the customer by email
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find and update the existing loan processing details, or create a new one if it doesn't exist
        const updatedLoanProcessing = await LoanProcessing.findOneAndUpdate(
            { customerId: customer._id },
            {
                customerId: customer._id,
                checkBounds,
                blockStatus,
                fileStatus,
                loanType,
                documentType, // Add documentType to the update object
                documentStatus,
                monthlyIncome,
                msneNo,
                gstNo,
                cibilRecord,
                itReturns: selectedOptions.map(option => option.value) // Map selectedOptions to itReturns
            },
            { new: true, upsert: true }
        );

        res.status(201).json({ message: 'Loan processing details saved successfully', loanProcessing: updatedLoanProcessing });
    } catch (error) {
        console.error('Error saving loan processing details:', error);
        res.status(500).json({ message: 'Failed to save loan processing details' });
    }
});

app.get('/get-loan-processing', async (req, res) => {
    const { customerId } = req.query;
    // console.log(email);
    try {
        // Find the customer by email
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find the loan processing details using customerId
        const loanProcessingDetails = await LoanProcessing.findOne({ customerId: customer._id });
        if (!loanProcessingDetails) {
            return res.status(404).json({ message: 'Loan processing details not found' });
            console.log("not fount");
        }

        res.status(200).json(loanProcessingDetails);
        // console.log(loanProcessingDetails);
    } catch (error) {
        console.error('Error fetching loan processing details:', error);
        res.status(500).json({ message: 'Failed to fetch loan processing details' });
    }
});



// CUSTOMER BASIC DETAIL API-S
app.post('/customer/forgotpassword', async (req, res) => {
    const { email } = req.body;
    const customermailid = email;
    console.log('Received email:', customermailid);

    try {
        // Case-insensitive query for email
        const customer = await Customer.findOne({ customermailid });

        if (!customer) {
            console.log('User not found for email:', customermailid);
            return res.status(404).send('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        console.log('Generated token:', token);

        customer.resetToken = token;
        customer.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        console.log('Token expiration:', new Date(customer.resetTokenExpiration));

        await customer.save();
        console.log('Token saved to database for customer:', customer.customermailid);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customer.customermailid,
            subject: 'Password Reset',
            html: `
    <p>Hi ${customer.customerFname},</p>
    <p><a href="https://localhost:8000/customer/reset/password/${token}">Click</a> to Reset Your Account (UKS-CUS-00${customer.customerNo}) Password.</p>
    <p>Thanks & regards,<br>LDP Finanserv.</p>
`,

        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            }
            console.log('Email sent:', info.response);
            res.send('Password reset email sent');
        });
    } catch (err) {
        console.error('Error during password reset process:', err);
        return res.status(500).json('Error: ' + err);
    }
});


app.post('/customer/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Received password reset request for token:', token);
    console.log('New password:', password);

    try {
        const customer = await Customer.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!customer) {
            console.log('Password reset token is invalid or has expired.');
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password before saving
        // const hashedPassword = await bcrypt.hash(password, 12);

        customer.userpassword = password;
        customer.resetToken = undefined;
        customer.resetTokenExpiration = undefined;

        await customer.save();
        console.log('Password has been reset and saved successfully.');

        res.send('Password has been reset');
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json('Error: ' + err);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate user input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find customer by email
        const customer = await Customer.findOne({ customermailid: email });
        if (!customer) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if the account is active
        if (!customer.isActive) {
            return res.status(403).json({ error: 'Please activate your account to login' });
        }

        // Compare passwords using bcrypt
        const isPasswordMatch = await bcrypt.compare(password, customer.userpassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // If passwords match, login is successful
        res.json({
            message: 'Login successful',
            customerId: customer._id  // assuming the customer model uses _id as the primary key
        });

    } catch (error) {
        console.error('Error during customer login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/customer/activate/:token', async (req, res) => {
    const { token } = req.params;
    console.log("Customer token: " + token);

    try {
        const customer = await Customer.findOne({ activationToken: token });
        if (!customer) {
            return res.status(400).json('Invalid or expired confirmation token');
        }

        customer.isActive = true;
        customer.activationToken = undefined;
        await customer.save();

        // Send a JSON response indicating success and a redirect URL
        //   res.redirect(`${process.env.BASE_URL}/customer/login`);

        return res.status(200).json('Customer Email confirmed successfully');
    } catch (err) {
        return res.status(400).json({ error: 'Error: ' + err });
    }
});

app.post('/register', async (req, res) => {
    const { title, customerFname, customerLname, gender, customercontact, customeralterno, customerwhatsapp, customermailid, typeofloan, userpassword, customerType, loanRequired, level } = req.body;
console.log(req.body);
    try {
        const token = crypto.randomBytes(32).toString('hex');

        const existingCustomer = await Customer.findOne({ customermailid });
        if (existingCustomer) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(userpassword, 10);

        const customer = new Customer({
            title,
            customerFname,
            customerLname,
            gender,
            customercontact,
            customeralterno,
            customerwhatsapp,
            customermailid,
            typeofloan,
            userpassword :hashedPassword,
            customerType,
            loanRequired,
            level,
            activationToken: token
        });

        const savedCustomer = await customer.save();
        const confirmationUrl = `https://localhost:8000/customer/activate/${token}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customermailid,
            subject: 'Registration Confirmation',
            // text: `Hello ${customerFname},\n\nPlease confirm your email by clicking the following link: ${confirmationUrl}\n\nThank you!`,
            html: `
            <p>Hello ${customerFname},</p>
            <p>Welcome to LDP Finanserv ,</p>
            <p>To Activate Your Account  <a href="https://localhost:8000/customer/activate/${token}">Click </a> Here.</p>
            <p>Thanks & regards,<br>LDP Finanserv.</p>`,
        
        
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const formattedCustomerNo = savedCustomer.customerNo.toString().padStart(3, '0');
        const customerId = savedCustomer._id;
        const savedCustomerType = savedCustomer.customerType; 

        res.json({ message: 'Customer added successfully', customerNo: formattedCustomerNo,customerId,customerType: savedCustomerType  });
    } catch (error) {
        console.error('Error Saving Customer:', error.message);
        res.status(500).json({ error: 'Error saving customer', details: error.message });
    }
});
app.put('/update-customer-details', async (req, res) => {
    try {
        const { customerId, updatedDetails } = req.body;

        if (!customerId || !updatedDetails) {
            console.error('Received incomplete data:', req.body);
            return res.status(400).json({ message: 'Invalid request data' });
        }

        // Find the customer by customerId
        const customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Update the customer details
        Object.assign(customer, updatedDetails);
        await customer.save();

        res.status(200).json({ message: 'Customer details updated successfully' });
    } catch (error) {
        console.error('Error updating customer details:', error);
        res.status(500).json({ message: 'Failed to update customer details' });
    }
});
// Get all customers endpoint
app.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.json(customers);
});
app.get('/customer-details', async (req, res) => {
    const { customerId } = req.query;
    // console.log('Received query:', req.query); // Log to check if customerId is received

    if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }

    try {
        const customer = await Customer.findById(customerId).populate('address');
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(customer);
        console.log('Customer details:', customer);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching customer details:', error);
    }
});

// Get customer by ID endpoint
app.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.json(customer);
});

app.put('/customers/:id', async (req, res) => {
    try {
        const { customerNo, ...rest } = req.body; // Exclude customerNo from the update data
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, rest, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Error updating customer' });
    }
});

// Delete customer by ID endpoint
app.delete('/:id', async (req, res) => {
    await Customer.findByIdAndDelete(req.params.id);
    res.json('success');
});



// UKS EMPLOYEE API'S 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    employeeType: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isActive: {
        type: Boolean,
        default: false,
    },
    activationToken: {
        type: String,
    },
    UKSNumber: {
        type: Number,
        unique: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
});

userSchema.plugin(AutoIncrement, { inc_field: 'UKSNumber', start_seq: 1 });

// Add virtual field for formatted employee number
userSchema.virtual('formattedEmployeeNumber').get(function () {
    return `UKS-EMP-${this.UKSNumber}`;
});

const User = mongoose.model('UKS_Employees', userSchema);



app.get('/uks/details', async (req, res) => {
    const { uksId } = req.query;
    console.log('Received query uks:', req.query); // Log to check if customerId is received

    if (!uksId) {
        return res.status(400).json({ error: 'Uks ID is required' });
    }

    try {
        const uks = await User.findById(uksId);
        if (!uks) {
            return res.status(404).json({ error: 'Uks not found' });
        }
        res.json(uks);
        console.log('Uks details:', uks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Error fetching customer details:', error);
    }
});

app.post('/api/uksregister', async (req, res) => {
    const { name, email, password, employeeType } = req.body;

    // Validate user input
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
        return res.status(400).send({ error: 'Invalid input data' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send({ error: 'User already exists' });
    }

    // Hash password
    const token = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
        employeeType,
        name,
        email,
        password: hashedPassword,
        activationToken: token
    });

    try {
        await newUser.save();

        const confirmationUrl = `https://localhost:8000/uks/activate/${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Confirmation',
            html: `
            <p>Hello ${name},</p>
            <p>Welcome to LDP Finanserv</p>
            <p>To Activate Your Account <a href="https://localhost:8000/uks/activate/${token}">Click Here</a>.</p>
            <p>Thanks & regards,<br>LDP Finanserv.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('UKS Email sent: ' + info.response);
            }
        });

        res.status(201).send({
            message: 'User registered successfully',
            formattedEmployeeNumber: newUser.formattedEmployeeNumber
        });
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
app.get('/uks/activate/:token', async (req, res) => {
    const { token } = req.params;
    console.log('Activation token:', token);

    try {
        const user = await User.findOne({ activationToken: token });
        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired confirmation token' });
        }

        user.isActive = true;
        user.activationToken = undefined;
        await user.save();
        // res.redirect(`${process.env.BASE_URL}/uks/login`);

        // Send a JSON response indicating success and a redirect URL
        return res.status(200).json('Email confirmed successfully');
    } catch (err) {
        return res.status(400).json({ error: 'Error: ' + err });
    }
});
app.post('/api/ukslogin', async (req, res) => {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required' });
    }

    try {
        // Extract the number part from the email
        const uksNumberMatch = email.match(/^UKS-EMP-(\d+)$/);
        if (!uksNumberMatch) {
            return res.status(400).send({ error: 'Invalid UKS number format' });
        }

        const uksNumber = parseInt(uksNumberMatch[1], 10);

        // Find user by UKS number
        const user = await User.findOne({ UKSNumber: uksNumber });
        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        // Check if the account is active
        if (!user.isActive) {
            return res.status(400).send({ error: 'Please activate your account to login' });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid credentials' });
        }

        // If passwords match, login is successful
        res.status(200).send({
            message: 'Login successful',
            email: user.email,
            name: user.name,
            uksId: user._id,
            employeeType: user.employeeType
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.get('/api/ukslogin', async (req, res) => {
    const { uksId } = req.query; // Get the uksId from the query parameters
    try {
        // Check if user exists
        const user = await User.findById(uksId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        // If user found, return user details
        res.status(200).send({ email: user.email, name: user.name });
        console.log(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.post('/uks/forgotpassword', async (req, res) => {
    const { email } = req.body;
    console.log('Received email:', email);

    try {
        // Case-insensitive query for email
        const user = await User.findOne({ email });


        if (!user) {
            console.log('User not found for email:', email);
            return res.status(404).send('User not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        console.log('Generated token:', token);

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
        console.log('Token expiration:', new Date(user.resetTokenExpiration));

        await user.save();
        console.log('Token saved to database for customer:', user.customermailid);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset',
            html: `
            <p>Hi ${user.name},</p>
            <p><a href="https://localhost:8000/uks/reset/password/${token}">Click</a> to Reset Your Account (UKS-00${user.UKSNumber}) Password.</p>
            <p>Thanks & regards,<br>LDP Finanserv.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send('Error sending email');
            }
            console.log('Email sent:', info.response);
            res.send('Password reset email sent');
        });
    } catch (err) {
        console.error('Error during password reset process:', err);
        return res.status(500).json('Error: ' + err);
    }
});

app.post('/uks/resetpassword/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log('Received password reset request for token:', token);
    console.log('New password:', password);

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() },
        });

        if (!user) {
            console.log('Password reset token is invalid or has expired.');
            return res.status(400).send('Password reset token is invalid or has expired.');
        }

        // Hash the new password before saving
        // const hashedPassword = await bcrypt.hash(password, 12);

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;

        await user.save();
        console.log('Password has been reset and saved successfully.');

        res.send('Password has been reset');
    } catch (err) {
        console.error('Error resetting password:', err);
        return res.status(500).json('Error: ' + err);
    }
});



// PROFILE PICTURE UPLOAD API

app.post('/api/profile/upload-profile-picture', upload.single('profilePicture'), async (req, res) => {
    try {
        const { customerId } = req.body;
        console.log(req.body);
        // Find the customer by email
        const customer = await Customer.findOne({ customerId: Customer._id });


        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        // Check if the customer already has a profile picture
        let profilePicture = await ProfilePicture.findOne({ customerId });

        // If a profile picture exists, update it with the new image data
        if (profilePicture) {
            profilePicture.imageData = req.file.buffer;
            profilePicture.filename = req.file.originalname;
            profilePicture.contentType = req.file.mimetype;
            profilePicture.size = req.file.size;

            await profilePicture.save();
        } else {
            // If no profile picture exists, create a new one
            profilePicture = new ProfilePicture({
                customerId: customerId,
                fileId: new mongoose.Types.ObjectId(),
                imageData: req.file.buffer,
                filename: req.file.originalname,
                contentType: req.file.mimetype,
                size: req.file.size
            });

            await profilePicture.save();
        }

        res.status(201).json({ message: 'Profile picture uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Failed to upload profile picture' });
    }
});
app.get('/api/profile/view-profile-picture', async (req, res) => {
    try {
        const { customerId } = req.query;
        // console.log(req.query);
        // Find the customer based on the email
        const customer = await Customer.findById(customerId);

        if (!customer) {
            console.log("customer not found");

            return res.status(404).json({ error: 'Customer not found' });
        }

        // Once customer is found, get the customer ID
        // const customerId = customer._id;

        // Find the profile picture based on customer ID
        const profilePicture = await ProfilePicture.findOne({ customerId });

        if (!profilePicture) {
            console.log("picture not found");

            return res.status(404).json({ error: 'Profile picture not found' });
        }

        // Send the profile picture data
        res.set('Content-Type', profilePicture.contentType);
        res.send(profilePicture.imageData);
        console.log(profilePicture.imageData);
        // console.log(profilePicture.imageData);

    } catch (error) {
        console.error('Error retrieving profile picture:', error);
        res.status(500).json({ error: 'Failed to retrieve profile picture' });
    }
});




// CIBIL PDF API'S

app.post('/api/upload-pdf', upload.single('pdfFile'), async (req, res) => {
    try {
        const { buffer, originalname, mimetype, size } = req.file;
        const { customerId } = req.body;

        if (size > 25 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds 25MB limit' });
        }

        // Check if there's an existing PDF for the customer ID
        const existingPdf = await PdfModel.findOne({ customerId });

        if (existingPdf) {
            // If an existing PDF is found

            // If an existing PDF is found, delete it
            await PdfModel.findByIdAndDelete(existingPdf._id);
        }

        // Save the new PDF
        const newPdf = new PdfModel({
            customerId,
            data: buffer,
            contentType: mimetype,
            filename: originalname
        });

        await newPdf.save();
        res.status(201).json({ message: 'PDF uploaded successfully' });
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
});
app.get('/api/check-pdf', async (req, res) => {
    try {
        const { email } = req.query;
        // console.log(email);
        const customer = await Customer.findOne({ customermailid: email });


        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        const pdf = await PdfModel.findOne({ customerId: customer._id });

        if (!pdf) {
            return res.status(404).json({ message: 'No PDF found for this customer' });
        }

        res.status(200).json({ message: 'PDF exists', customerId: customer._id });
    } catch (error) {
        console.error('Error checking PDF:', error);
        res.status(500).json({ error: 'Failed to check PDF' });
    }
});
app.get('/api/download-pdf/:customerId', async (req, res) => {
    try {
        const { customerId } = req.params;
        const pdf = await PdfModel.findOne({ customerId });

        if (!pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        res.set({
            'Content-Type': pdf.contentType,
            'Content-Disposition': `attachment; filename="${pdf.filename}"`
        });

        res.send(pdf.data);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        res.status(500).json({ error: 'Failed to download PDF' });
    }
});


// MASTER STORAGES API'
app.post('/api/dsa/required/type', async (req, res) => {
    const { requiredType } = req.body;

    try {
        // Create a new instance of DSA_RequiredType and save it to the database
        const newRequiredType = new DSA_RequiredType({ requiredType });
        await newRequiredType.save();

        res.status(201).json({ message: 'Required Type saved successfully' });
    } catch (error) {
        console.error('Error saving required type:', error);

        // Check for duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            res.status(400).json({ error: 'Required Type already exists' });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});


app.get('/api/dsa/required/type', async (req, res) => {
    try {
        const requiredTypes = await DSA_RequiredType.find();
        console.log('File statuses fetched:', requiredTypes); // Log the fetched data
        res.json(requiredTypes);
        console.log(requiredTypes);
    } catch (error) {
        console.error('Error fetching file statuses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/file-status', async (req, res) => {
    try {
        const fileStatuses = await FileStatus.find();
        // console.log('File statuses fetched:', fileStatuses); // Log the fetched data
        res.json(fileStatuses);
    } catch (error) {
        console.error('Error fetching file statuses:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/file-status', async (req, res) => {
    const { fileStatus } = req.body;

    try {
        // Assuming you have a LoanType model/schema
        // Create a new instance of LoanType and save it to the database
        const fileStatuses = new FileStatus({ type: fileStatus });
        await fileStatuses.save();

        res.status(201).json({ message: 'Loan type saved successfully' });
    } catch (error) {
        console.error('Error saving loan type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Route to handle POST request for adding employee type
app.post('/api/employee-type', async (req, res) => {
    const { employeeType } = req.body;
    // console.log(employeeType);
    if (!employeeType || typeof employeeType !== 'string' || !employeeType.trim()) {
      return res.status(400).json({ message: 'Valid employee type is required' });
    }
  
    try {
      const newEmployeeType = new EmployeeType({ type: employeeType.trim() });
      await newEmployeeType.save();
      res.json({ message: 'Employee type saved successfully' });
    } catch (error) {
      console.error('Error saving employee type:', error);
      if (error.code === 11000) {
        res.status(400).json({ message: 'Employee type already exists' });
      } else {
        res.status(500).json({ message: 'Failed to save employee type' });
      }
    }
  });
  // Assuming you're using Express and Mongoose
app.get('/api/employee-type', async (req, res) => {
    try {
      const employeeTypes = await EmployeeType.find();
      res.json(employeeTypes);
    } catch (error) {
      console.error('Error retrieving employee types:', error);
      res.status(500).json({ message: 'Failed to retrieve employee types' });
    }
  });
  
app.post('/api/loan-types', async (req, res) => {
    const { loanType } = req.body;

    try {
        // Assuming you have a LoanType model/schema
        // Create a new instance of LoanType and save it to the database
        const newLoanType = new LoanType({ type: loanType });
        await newLoanType.save();

        res.status(201).json({ message: 'Loan type saved successfully' });
    } catch (error) {
        console.error('Error saving loan type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/loan-types', async (req, res) => {
    try {
        const loanTypes = await LoanType.find();
        res.json(loanTypes);
    } catch (error) {
        console.error('Error fetching loan types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/loan-levels', async (req, res) => {
    const { loanLevel } = req.body;

    try {
        const newLoanLevel = new LoanLevel({ type: loanLevel });
        await newLoanLevel.save();

        res.status(201).json({ message: 'Loan Level saved successfully' });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            res.status(400).json({ error: 'Loan Level already exists' });
        } else {
            console.error('Error saving loan level:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});
app.get('/api/loan-levels', async (req, res) => {
    try {
        const loanLevels = await LoanLevel.find();
        res.status(200).json(loanLevels);
    } catch (error) {
        console.error('Error fetching loan levels:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/document-type', async (req, res) => {
    const { documenttype } = req.body;

    try {
        const newDocumentType = new DocumentType({ type: documenttype });
        await newDocumentType.save();
        res.status(201).json({ message: 'Document type saved successfully' });
    } catch (error) {
        console.error('Error saving document type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/unsecured/document-type', async (req, res) => {
    const { documenttype } = req.body;

    try {
        const newDocumentType = new Unsecured_DocumentType({ type: documenttype });
        await newDocumentType.save();
        res.status(201).json({ message: 'Unsecured Document type saved successfully' });
    } catch (error) {
        console.error('Error saving document type:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Route to fetch all document types
app.get('/api/unsecured/document-type', async (req, res) => {
    try {
        const Unsecured_documentTypes = await Unsecured_DocumentType.find();
        res.json(Unsecured_documentTypes);
    } catch (error) {
        console.error('Error fetching document types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/document-type', async (req, res) => {
    try {
        const documentTypes = await DocumentType.find();
        res.json(documentTypes);
    } catch (error) {
        console.error('Error fetching document types:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


server.listen(8000, () => {
    console.log(`Server running on https://148.251.230.14:8000:${8000}`);
  console.log('WebSocket server is running on wss://148.251.230.14:${8000}');
});
