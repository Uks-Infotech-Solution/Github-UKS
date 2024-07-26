import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useCustomer } from '../../Customer/Navbar/Customername-context';
import './Basic_View.css'; // Import the CSS file for styling
import Select from 'react-select';
import { IoCloseSharp } from "react-icons/io5";
import { Country, State, City } from "country-state-city";
import { useNavigate } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { MdHome, MdArrowForwardIos, MdEdit } from 'react-icons/md';
import Popup from 'react-popup';
import { message } from 'react-message-popup'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import PathnameUrlPath from '../../URL_Path/Url_Path';


// IT RETURN VALUES

const options = [
    { value: '2020-2021', label: '2020-2021' },
    { value: '2021-2022', label: '2021-2022' },
    { value: '2022-2023', label: '2022-2023' },
    { value: '2023-2024', label: '2023-2024' },
    { value: '2024-2025', label: '2024-2025' }
];

function Profile_View() {
    // console.log(customerEmail);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const location = useLocation();
    const { customerId } = location.state || {};
    // console.log(customerId);
    const [customerDetails, setCustomerDetails] = useState(null);


    const homepage = () => {
        navigate('/customer-dashboard', { state: { customerId } });

    };


    const [addressDetails, setAddressDetails] = useState({});
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    const [isAccountDeleted, setIsAccountDeleted] = useState(false);


    // CUSTOMER ACOOUNT ACTIVE OR INACTIVE

    const handleDeleteAccount = async () => {
        try {
            await axios.post('http://148.251.230.14:8000/customer/status', {
                customerId: customerId, // Ensure you have the customerId of the customer
                status: 'InActive' // You can send 'InActive' or 'Active' based on the current state
            });
            setIsAccountDeleted(true);
        } catch (error) {
            console.error('Error updating account status:', error);
        }
    };

    const [isAccountActivated, setIsAccountActivated] = useState(true);

    const handleActivateAccount = async () => {
        try {
            await axios.post('http://148.251.230.14:8000/customer/status', {
                customerId: customerId,
                status: 'Active' // Set the status to 'active'
            });
            setIsAccountActivated(true);
        } catch (error) {
            console.error('Error activating account:', error);
        }
    };


    //    LOAN PROCESSING USE STATES

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [checkBounds, setCheckBounds] = useState("No");
    const [blockStatus, setBlockStatus] = useState("Inactive");
    const [fileStatus, setFileStatus] = useState("Null");
    const [documentType, setDocumentType] = useState('');
    const [loanType, setLoanType] = useState('');
    const [documentStatus, setDocumentStatus] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState('');
    const [msneNo, setmsneNo] = useState('');
    const [gstNo, setGstNo] = useState('');
    const [cibilRecord, setCibilRecord] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('details'); // Define the activeTab state
    const [showModal, setShowModal] = useState(false);
    const [editingMode, setEditingMode] = useState(false);
    const [editiloanprocess, seteditiloanprocess] = useState(false);
    const [editingModeAddress, setEditingModeAddress] = useState(false);


    // LOAN AMOUNT WITH COMMA OPERATOR
    const formatAmountWithCommas = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the amount
    };


    // SINGLE CUSTOMER DETAIL
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/customer-details', {
                    params: { customerId: customerId }
                });
                setCustomerDetails(response.data);
                handleActivateAccount();
                setAddressDetails(response.data.address || {});
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer details:', error);
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [customerId, setCustomerDetails]);

    const handleEditClick = () => {
        setEditingMode(true); // Enable editing mode
    };



    // FETCH LOAN TYPES IN MASTER  

    const [loanTypes, setLoanTypes] = useState([]);

    useEffect(() => {
        const fetchLoanTypes = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/loan-types');
                setLoanTypes(response.data);
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        fetchLoanTypes();
    }, []);



    // FETCH LEVEL OF LOAN AMOUNT FROM MASTER

    const [level, setLevel] = useState('');
    const determineLevel = async (amount) => {
        try {
            const response = await axios.post('http://148.251.230.14:8000/api/determine-loan-level', { loanAmount: amount });
            setLevel(response.data.loanLevel);
        } catch (error) {
            console.error('Error determining loan level:', error);
        }
    };
    const [formattedLoanRequired, setFormattedLoanRequired] = useState('');

    useEffect(() => {
        if (customerDetails && customerDetails.loanRequired) {
            let amount = customerDetails.loanRequired;
            if (typeof amount === 'string') {
                amount = amount.replace(/,/g, '');
            }
            amount = Number(amount);
            if (!isNaN(amount)) {
                determineLevel(amount);
                setFormattedLoanRequired(formatAmountWithCommas(amount.toString()));
            }
        }
    }, [customerDetails]);

    // SINGLE CUSTOMER DETAIL UPDATE
    const handleSaveClick = async () => {
        if (!customerDetails || !customerId) {
            alert("Customer details are not properly loaded.");
            return;
        }
        determineLevel(customerDetails.loanRequired);
        const updatedDetails = {
            customerType: customerDetails.customerType,
            title: customerDetails.title,
            customerFname: customerDetails.customerFname,
            customerLname: customerDetails.customerLname,
            gender: customerDetails.gender,
            customercontact: customerDetails.customercontact,
            customeralterno: customerDetails.customeralterno,
            customerwhatsapp: customerDetails.customerwhatsapp,
            customermailid: customerDetails.customermailid,
            typeofloan: customerDetails.typeofloan,
            loanRequired: customerDetails.loanRequired,
            level: level
        };
        console.log(updatedDetails);
        try {
            const response = await axios.put('http://148.251.230.14:8000/update-customer-details', {
                customerId: customerId, // Use the _id from customerDetails
                updatedDetails: updatedDetails
            });

            console.log("Response from server:", response.data);
            setEditingMode(false);
            message.success('Updated successfully');
        } catch (error) {
            console.error('Error updating customer details:', error);
            alert("Error updating customer details");
        }
    };



    // CIBIL PDF FILE UPLOADING 
    const onFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const [pdfName, setPdfName] = useState('');
    const [showDownloadLink, setShowDownloadLink] = useState(false);

    useEffect(() => {
        const checkForPdf = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/check-pdf', {
                    params: { customerId: customerId }
                });
                if (response.status === 200) {
                    setShowDownloadLink(true);
                }
            } catch (error) {
                console.log('No existing PDF found for this customer');
            }
        };

        if (customerId) {
            checkForPdf();
        }
    }, [customerId]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPdfFile(file);
            setPdfName(file.name);
            setShowDownloadLink(false); // Hide the download link when a new file is selected
        }
    };

    const handleUpload = async () => {
        if (!pdfFile) {
            alert('Please select a PDF file first.');
            return;
        }

        if (pdfFile.size > 25 * 1024 * 1024) {
            alert('File size exceeds the maximum limit of 25MB.');
            return;
        }

        const formData = new FormData();
        formData.append('pdfFile', pdfFile);
        formData.append('customerId', customerDetails._id);

        try {
            await axios.post('http://148.251.230.14:8000/api/upload-pdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('PDF uploaded successfully');
            setShowDownloadLink(true); // Show the download link after successful upload
        } catch (error) {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF');
        }
    };



    // FETCH LOAN PROCESSING

    const [loanProcessingDetails, setLoanProcessingDetails] = useState(null);

    const fetchLoanProcessingDetails = async () => {
        try {
            const response = await axios.get('http://148.251.230.14:8000/get-loan-processing', {
                params: { customerId: customerId }
            });
            if (response.status === 200) {
                const data = response.data;

                // Check if all the values are empty or null or blank strings
                const allValuesEmpty = Object.values(data).every(
                    value => value === null || value === '' || (Array.isArray(value) && value.length === 0)
                );

                if (allValuesEmpty) {
                    seteditiloanprocess(true);
                } else {
                    setLoanProcessingDetails(data);
                    seteditiloanprocess(false); // Data found and not empty, set to false
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Loan processing details not found
                seteditiloanprocess(true);
            } else {
                console.error('Error fetching loan processing details:', error);
                alert('Failed to fetch loan processing details');
            }
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchLoanProcessingDetails();
        }
    }, [customerId]);

    const validateLoanProcessingDetails = () => {
        const requiredFields = [
            'selectedOptions', 'checkBounds', 'blockStatus', 'fileStatus',
            'cibilRecord'
        ];
        // Fields that are required only if customer type is 'Business'
        if (customerDetails.customerType === 'Business') {
            requiredFields.push('monthlyIncome', 'msneNo', 'gstNo');
        }

        for (let field of requiredFields) {
            if (!eval(field) || (Array.isArray(eval(field)) && eval(field).length === 0)) {
                return false;
            }
        }
        return true;
    };


    // SAVE LOAN PROCESSING DETAILS
    const handleLoanProcessingSave = async () => {
        if (!validateLoanProcessingDetails()) {
            alert('Please fill out all required fields of Loan Processing.');
            return;
        }
        try {
            await axios.post('http://148.251.230.14:8000/api/save-loan-processing', {
                selectedOptions, // Ensure this is defined somewhere in your component
                checkBounds,
                blockStatus,
                fileStatus,
                monthlyIncome,
                msneNo,
                gstNo,
                cibilRecord,
                customerId
                // loanType:"Personal Loan" 
            });
            alert('Loan processing details saved successfully');
            fetchLoanProcessingDetails();
            seteditiloanprocess(false)
        } catch (error) {
            console.error('Error saving loan processing details:', error);
            alert('Failed to save loan processing details');
        }
    };

    const handleEditLoanProcess = () => {
        seteditiloanprocess(true); // Enable editing mode
    };

    const handleChange = (selected) => {
        setSelectedOptions(selected);
    };


    //SAVE PREVIOUS LOAN DETAILS

    const [hasPreviousLoan, setHasPreviousLoan] = useState(null);
    const [previousLoanDetails, setPreviousLoanDetails] = useState([{
        financeName: '',
        yearOfLoan: '',
        loanAmount: '',
        outstandingAmount: ''
    }]);

    const handlePreviousLoanSave = async () => {
        try {
            const loansToSave = hasPreviousLoan
                ? previousLoanDetails
                : [{ financeName: 'No previous loan', yearOfLoan: null, loanAmount: 0, outstandingAmount: 0 }];

            await axios.post('http://148.251.230.14:8000/add-previous-loans', {
                previousLoans: loansToSave,
                customerId: customerId,
            });

            alert('Loan processing details saved successfully');
            setActiveTab('loanprocessing');

        } catch (error) {
            console.error('Error updating previous loan details:', error);
        }
    };

    const handlePreviousLoanChange = (index, e) => {
        const { name, value } = e.target;
        const newLoans = [...previousLoanDetails];
        newLoans[index][name] = value;
        setPreviousLoanDetails(newLoans);
    };

    const addLoanRow = () => {
        setPreviousLoanDetails([
            ...previousLoanDetails,
            { _id: null, financeName: '', yearOfLoan: '', loanAmount: '', outstandingAmount: '' }
        ]);
    };

    const deleteLoanRow = async (index) => {
        const loanToDelete = previousLoanDetails[index];
        if (loanToDelete._id) {
            try {
                await axios.delete(`http://148.251.230.14:8000/delete-previous-loan/${loanToDelete._id}`);
                alert('Loan deleted successfully');
            } catch (error) {
                console.error('Error deleting previous loan:', error);
                return;
            }
        }
        const newLoans = previousLoanDetails.filter((_, i) => i !== index);
        setPreviousLoanDetails(newLoans);
    };



    // FETCH PREVIOUS LOAN
    const fetchPreviousLoans = async () => {
        try {
            const response = await axios.get('http://148.251.230.14:8000/get-previous-loans', {
                params: { customerId: customerId }
            });
            setPreviousLoanDetails(response.data);
        } catch (error) {
            console.error('Error fetching previous loans:', error);
        }
    };

    useEffect(() => {
        fetchPreviousLoans();
    }, [customerId]);



    // ADDRESS INPUT UPDATE
    const handleEditAddress = () => {
        setEditingModeAddress(true); // Enable editing mode
    };

    const handleInputChange = (fieldName, value) => {
        let newValue = value;

        // Remove non-numeric characters if the field is supposed to be numeric
        if (fieldName === 'phone' || fieldName === 'anotherNumericField') { // Add any other numeric fields here
            newValue = value.replace(/\D/g, '');
        }

        // Update the state with the new value
        setCustomerDetails({ ...customerDetails, [fieldName]: newValue });
    };

    useEffect(() => {
        const updatedStates = State.getStatesOfCountry('IN').map(state => ({
            label: state.name,
            value: state.isoCode
        }));
        setStatesList(updatedStates);
    }, []);

    // AADHAR AND PERMANENT ADDRESS SAME VALUE

    useEffect(() => {
        if (isSameAddress) {
            setAddressDetails(prevState => ({
                ...prevState,
                permanentState: prevState.aadharState,
                permanentDistrict: prevState.aadharDistrict,
                permanentCity: prevState.aadharCity,
                permanentStreet: prevState.aadharStreet,
                permanentDoorNo: prevState.aadharDoorNo,
                permanentZip: prevState.aadharZip,
            }));
        }
    }, [isSameAddress]);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressDetails(prevState => {
            const updatedAddress = { ...prevState, [name]: value };

            if (isSameAddress && name.startsWith('aadhar')) {
                const permanentField = name.replace('aadhar', 'permanent');
                updatedAddress[permanentField] = value;
            }

            return updatedAddress;
        });
    };

    const handleStateChange = (selectedOption, fieldPrefix) => {
        const updatedCities = City.getCitiesOfState('IN', selectedOption.value).map(city => ({
            label: city.name,
            value: city.name
        }));
        setCitiesList(updatedCities);

        setAddressDetails(prevState => ({
            ...prevState,
            [`${fieldPrefix}`]: selectedOption.value,
            [`${fieldPrefix}District`]: '',
            [`${fieldPrefix}City`]: ''
        }));
    };

    const handleCityChange = (selectedOption, fieldPrefix) => {
        setAddressDetails(prevState => ({
            ...prevState,
            [`${fieldPrefix}`]: selectedOption.value
        }));
    };
    const validateAddressDetails = () => {
        const fields = [
            'aadharState', 'aadharDistrict', 'aadharCity', 'aadharStreet', 'aadharDoorNo', 'aadharZip',
            'permanentState', 'permanentDistrict', 'permanentCity', 'permanentStreet', 'permanentDoorNo', 'permanentZip'
        ];

        for (let field of fields) {
            if (!addressDetails[field]) {
                return false;
            }
        }
        return true;
    };



    // ADDRESS SAVING
    const handleAddressSave = async () => {
        if (!validateAddressDetails()) {
            alert('Please fill out all required fields.');
            return;
        }
        try {
            await axios.post(`http://148.251.230.14:8000/add-address`, {
                customerId: customerId,
                address: addressDetails,
            });
            console.log(addressDetails);
            setShowModal(true);
            alert('Address saved successfully');
            setEditingModeAddress()
            setActiveTab('previousLoan');
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };


    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                console.log(`Fetching address details for customerId: ${customerId}`);
                const response = await axios.get(`http://148.251.230.14:8000/view-address`, {
                    params: { customerId: customerId }
                });
                if (response.data) {
                    setAddressDetails(response.data);
                    setEditingModeAddress(false);
                    if (response.data.aadharState) {
                        const updatedCities = City.getCitiesOfState('IN', response.data.aadharState).map(city => ({
                            label: city.name,
                            value: city.name
                        }));
                        setCitiesList(updatedCities);
                    }
                } else {
                    setEditingModeAddress(true);
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
                setEditingModeAddress(true);
            }
        };

        if (customerId) {
            fetchAddressDetails();
        }
    }, [customerId]);




    // PROFILE PICTURE UPLOAD
    const [imageSrc, setImageSrc] = useState(null);

    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const onUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
            return;
        }
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('customerId', customerId);
        try {
            const response = await axios.post('http://148.251.230.14:8000/api/profile/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Profile picture uploaded successfully');
            fetchProfilePicture(customerId);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload profile picture');
        }
    };


    // FETCH PROFILE PICTURE

    const fetchProfilePicture = async (customerId) => {
        try {
            const response = await axios.get(`http://148.251.230.14:8000/api/profile/view-profile-picture?customerId=${customerId}`, {
                responseType: 'arraybuffer'
            });
            const contentType = response.headers['content-type'];

            if (contentType && contentType.startsWith('image')) {
                const base64Image = `data:${contentType};base64,${btoa(
                    String.fromCharCode(...new Uint8Array(response.data))
                )}`;
                setImageSrc(base64Image);
                setError(null);
            } else {
                setError('Response is not an image');
                setImageSrc(null);
            }
        } catch (err) {
            console.error('Error retrieving profile picture:', err);
            setError('Failed to load profile picture');
            setImageSrc(null);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchProfilePicture(customerId);
        }
    }, [customerId]);



    // CUSTOMER TYPE IS SALARIED PERSON
    const [salariedPersons, setSalariedPersons] = useState([]);
    const [salaryEdit, setSalaryEdit] = useState(false);

    useEffect(() => {
        const fetchSalariedPersonDetails = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/salariedperson', {
                    params: { customerId: customerId }
                });
                if (response.status === 200) {
                    const data = response.data.salariedPersons;
                    const allValuesEmpty = data.length === 0 || data.every(person =>
                        !person.companyName && !person.role && !person.monthlySalary && !person.workExperience
                    );
                    if (allValuesEmpty) {
                        setSalaryEdit(true);
                    } else {
                        setSalariedPersons(data);
                        setSalaryEdit(false);
                    }
                }
            } catch (error) {
                setError('Error fetching Salaried Person details');
                alert("Error fetching Salaried Person details")

                console.error('Error fetching Salaried Person details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId && activeTab === 'salariedperson') {
            fetchSalariedPersonDetails();
        }
    }, [customerId, activeTab]);

    const handleSalaryInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSalariedPersons = [...salariedPersons];
        updatedSalariedPersons[index][name] = value;
        setSalariedPersons(updatedSalariedPersons);
    };

    const addSalariedPerson = () => {
        setSalariedPersons([
            ...salariedPersons,
            { _id: null, companyName: '', role: '', monthlySalary: '', workExperience: '' }
        ]);
    };

    const deleteSalariedPerson = (_id) => {
        const salariedPersonToDelete = salariedPersons.find((person) => person._id === _id);
        if (salariedPersonToDelete) {
            if (salariedPersonToDelete._id) {
                // If the salaried person has been saved before, delete it from the database
                axios.delete(`http://148.251.230.14:8000/salariedperson/${_id}`)
                    .then(() => {
                        alert('Salaried person deleted successfully');
                    })
                    .catch((error) => {
                        console.error('Error deleting salaried person:', error);
                        alert("Error deleting salaried person");
                    });
            }
            setSalariedPersons(salariedPersons.filter((person) => person._id !== _id));
        } else {
            console.error(`Salaried person not found: ${_id}`);
        }
    };

    const handleSaveSalariedPerson = async () => {
        try {

            const response = await axios.post('http://148.251.230.14:8000/salariedperson', {
                customerId: customerId,
                salariedperson: salariedPersons
            });

            if (response.status === 200) {
                alert("Salaried Person aved successfully")
                setActiveTab('loanprocessing')
            }
        } catch (error) {
            console.error('Error saving Salaried Person details:', error);
            alert("Error saving Salaried Person details")
        }
    };


    const [fileStatuses, setFileStatuses] = useState([]);
    const [selectedFileStatus, setSelectedFileStatus] = useState('');
    useEffect(() => {
        const fetchFileStatuses = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/file-status');
                setFileStatuses(response.data);
            } catch (error) {
                console.error('Error fetching file statuses:', error);
            }
        };

        fetchFileStatuses();
    }, []);

    const handleFileStatusChange = (e) => {
        setSelectedFileStatus(e.target.value);
    };

    const handleProfileDownload = () => {
        if (customerId) {
            navigate(`/customer/profile/download`, { state: { customerId } });
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customerDetails) {
        return <div>Un defined error . Please try again or go to login page</div>
    }



    return (
        <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
            <div style={{ paddingBottom: '18px' }}>
            <PathnameUrlPath location={location} homepage={homepage} />
            </div>
            <Row className="Section-1-Row" >
                <Col className="New-Customer-container-second basic-view-col">
                    <Row >
                        <Col>
                            <div>
                                <span className="basic-view-head">Customer Profile</span>
                                {isAccountDeleted ? (
                                    <span style={{ margin: '5px', color: 'red', fontWeight: "500" }}><GoDotFill />InActive</span>
                                ) : (
                                    <span style={{ margin: '5px', color: 'green', fontWeight: "500" }}><GoDotFill />Active</span>
                                )}
                            </div>
                        </Col>
                        <Col lg={3} style={{ justifyContent: "end", textAlign: "end" }}>
                            <span>
                                <a href="" onClick={handleProfileDownload} style={{ marginRight: "15px", textDecoration: 'none' }}>
                                    Profile Download
                                </a>
                            </span>
                            {showDownloadLink && (
                                <span>
                                    <a href={`http://148.251.230.14:8000/api/download-pdf/${customerDetails._id}`} style={{ textDecoration: 'none' }} download="Cibil_Report.pdf">
                                        Cibil Report Download
                                    </a>
                                </span>
                            )}

                        </Col>
                        <Col style={{ justifyContent: "end", textAlign: "end" }} lg={1}>

                            {!editingMode && (

                                <Col lg={2}><Button style={{ width: "80px", marginTop: "-5px" }} onClick={handleEditClick}>Edit</Button></Col>

                            )}
                            {editingMode && (
                                <Row>
                                    <Col lg={2}><Button style={{ width: "80px", marginTop: "-5px" }} onClick={handleSaveClick}>Submit</Button></Col>
                                </Row>
                            )}
                        </Col>
                        <hr style={{ margin: "5px" }} />
                    </Row>
                    <Row className={`Upload-profile-row ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                        <div className='Upload-profile-div'>
                            <h6 >Upload Profile Picture</h6>

                            <div>
                                {imageSrc ? (
                                    <img style={{ height: '150px', borderStyle: "solid", borderWidth: 'thin', padding: '1px' }} src={imageSrc} alt="Profile" />
                                ) : (
                                    <div></div>
                                )}
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    onChange={onFileChange}
                                    className="file-input"
                                    style={{ margin: '10px 0', wordWrap: "break-word" }}
                                />
                                <div className="file-name">{fileName}</div>
                                <div>
                                    <Button onClick={onUpload} style={{ border: 'none' }} >Upload</Button>
                                </div>
                            </div>

                        </div>
                        {loanProcessingDetails && loanProcessingDetails.cibilRecord ? (
                            <div style={{ textAlign: "center", fontWeight: "500", marginTop: "8px", color: "green" }}>
                                Cibil Score: <span style={{ fontWeight: '400' }}>{loanProcessingDetails.cibilRecord}</span>
                            </div>
                        ) : null}
                    </Row>


                    {/* CUSTOMER BASIC DETAILS */}

                    {loading ? (
                        <div>Loading...</div>
                    ) : editingMode ? (
                        <>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2} ><span className="customer-sentence">Customer Type</span></Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Business"
                                        className="radio-btn"
                                        checked={customerDetails.customerType === 'Business'}
                                        onChange={(e) => handleInputChange('customerType', e.target.value)}
                                    /> Business
                                    <Row>

                                    </Row>
                                </Col>
                                <Col >
                                    <input
                                        type="radio"
                                        value="Salaried Person"
                                        className="radio-btn"
                                        checked={customerDetails.customerType === 'Salaried Person'}
                                        onChange={(e) => handleInputChange('customerType', e.target.value)}
                                    /> Salaried Person
                                </Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Title</span></Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Mr"
                                        className="radio-btn"
                                        checked={customerDetails.title === 'Mr'}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                    /> Mr
                                </Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Ms"
                                        className="radio-btn"
                                        checked={customerDetails.title === 'Ms'}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                    /> Ms
                                </Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Mrs"
                                        className="radio-btn"
                                        checked={customerDetails.title === 'Mrs'}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                    /> Mrs
                                </Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={3}><span className="customer-sentence">Primary Contact</span></Col>
                                <Col lg={2}><input type="text" className="box" value={customerDetails.customerFname} onChange={(e) => handleInputChange('customerFname', e.target.value)} /></Col>
                                <Col  ><input type="text" className="box" value={customerDetails.customerLname} onChange={(e) => handleInputChange('customerLname', e.target.value)} /></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Gender</span></Col>
                                <Col lg={6}>
                                    <select

                                        value={customerDetails.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="dropdown box"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Transgender">Transgender</option>
                                    </select>
                                </Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={3}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={2} ><input type="text" className="box" value={customerDetails.customercontact} onChange={(e) => handleInputChange('customercontact', e.target.value)} /></Col>
                                <Col lg={2}><input type="text" className="box" value={customerDetails.customeralterno} onChange={(e) => handleInputChange('customeralterno', e.target.value)} /></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col  ><input type="text" className="box" value={customerDetails.customerwhatsapp} onChange={(e) => handleInputChange('customerwhatsapp', e.target.value)} /></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">E-Mail</span></Col>
                                <Col  ><input type="text" className="box" value={customerDetails.customermailid} onChange={(e) => handleInputChange('customermailid', e.target.value)} /></Col>

                            </Row>
                            
                            {/* Add input fields for other customer details similarly */}
                        </>
                    ) : (
                        <>
                            <Row className='Row1 view-row-size'>
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Customer Type</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customerType}</div></Col>
                            </Row >

                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Title</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.title}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Primary Contact</span></Col>
                                <Col lg={3}><div className="box customer-data-font">{customerDetails.customerFname}</div></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customerLname}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Gender</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.gender}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={3}><div className="box customer-data-font">{customerDetails.customercontact}</div></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customeralterno}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.customerwhatsapp}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">E-Mail</span></Col>
                                <Col><div className=" box customer-data-font">{customerDetails.customermailid}</div></Col>
                            </Row>
                            
                           
                        </>
                    )}



                    {/* 4-TAB OPTIONS */}

                    <Row className='basic-view-address-row'>
                        <Col lg={1} className={`col ${activeTab === 'address' ? 'active' : ''}`} style={{ fontWeight: "500" }} onClick={() => setActiveTab('address')}>Address</Col>
                        <Col lg={1} className={`col ${activeTab === 'previousLoan' ? 'active' : ''}`} style={{ fontWeight: "500" }} onClick={() => setActiveTab('previousLoan')}>Previous Loan</Col>
                        {customerDetails.customerType === 'Salaried Person' && (
                            <Col lg={1} className={`col ${activeTab === 'salariedperson' ? 'active' : ''}`} style={{ fontWeight: "500" }} onClick={() => setActiveTab('salariedperson')}>Salaried Person</Col>
                        )}
                        <Col lg={2} className={`col ${activeTab === 'loanprocessing' ? 'active' : ''}`} style={{ fontWeight: "500" }} onClick={() => setActiveTab('loanprocessing')}>Loan Processing</Col>

                        <div className={`Edit-button ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                            <Col lg={2}>
                                {(!editingModeAddress || !editiloanprocess) && (
                                    <Button style={{ width: "80px" }} onClick={() => {
                                        if (!editingModeAddress) handleEditAddress();
                                        if (!editiloanprocess) handleEditLoanProcess();
                                    }}>
                                        Edit
                                    </Button>
                                )}
                            </Col>
                        </div>
                    </Row>
                    <hr />



                    {/* CUSTOMER ADDRESS */}

                    <Row className="Section-1-Row three-tab-margin">
                        {activeTab === 'address' && (
                            <Row style={{ paddingLeft: '0px' }}>
                                <Col className="profile-address-col">
                                    <Row><div className="profile-aadhar-per-head">Aadhar Address</div></Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">State</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharState"
                                                options={statesList}
                                                value={statesList.find(state => state.value === addressDetails.aadharState)}
                                                onChange={(option) => handleStateChange(option, 'aadharState')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">District</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharDistrict"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.aadharDistrict)}
                                                onChange={(option) => handleCityChange(option, 'aadharDistrict')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">City</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharCity"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.aadharCity)}
                                                onChange={(option) => handleCityChange(option, 'aadharCity')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Area</span></Col>
                                        <Col><input className="input-box-address" name="aadharStreet" type="text" value={addressDetails.aadharStreet} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Door No</span></Col>
                                        <Col><input className="input-box-address" name="aadharDoorNo" type="text" value={addressDetails.aadharDoorNo} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Postal Code</span></Col>
                                        <Col><input className="input-box-address" name="aadharZip" type="text" value={addressDetails.aadharZip} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                </Col>
                                <Col className="profile-address-col">
                                    <Row className="mb-3">
                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <span className="profile-aadhar-per-head">Permanent Address</span>
                                                <Form.Check
                                                    type="checkbox"
                                                    label="Same as Aadhaar Address"
                                                    checked={isSameAddress}
                                                    onChange={() => {
                                                        setIsSameAddress(!isSameAddress);
                                                        if (!isSameAddress) {
                                                            setAddressDetails({
                                                                ...addressDetails,
                                                                permanentState: addressDetails.aadharState,
                                                                permanentDistrict: addressDetails.aadharDistrict,
                                                                permanentCity: addressDetails.aadharCity,
                                                                permanentStreet: addressDetails.aadharStreet,
                                                                permanentDoorNo: addressDetails.aadharDoorNo,
                                                                permanentZip: addressDetails.aadharZip
                                                            });
                                                        } else {
                                                            setAddressDetails({
                                                                ...addressDetails,
                                                                permanentState: '',
                                                                permanentDistrict: '',
                                                                permanentCity: '',
                                                                permanentStreet: '',
                                                                permanentDoorNo: '',
                                                                permanentZip: ''
                                                            });
                                                        }
                                                    }}
                                                    className="ms-2"
                                                    disabled={!editingModeAddress}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">State</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentState"
                                                options={statesList}
                                                value={statesList.find(state => state.value === addressDetails.permanentState)}
                                                onChange={(option) => handleStateChange(option, 'permanentState')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">District</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentDistrict"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.permanentDistrict)}
                                                onChange={(option) => handleCityChange(option, 'permanentDistrict')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">City</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentCity"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.permanentCity)}
                                                onChange={(option) => handleCityChange(option, 'permanentCity')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Area</span></Col>
                                        <Col><input className="input-box-address" name="permanentStreet" type="text" value={addressDetails.permanentStreet} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Door No</span></Col>
                                        <Col><input className="input-box-address" name="permanentDoorNo" type="text" value={addressDetails.permanentDoorNo} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Postal Code</span></Col>
                                        <Col><input className="input-box-address" name="permanentZip" type="text" value={addressDetails.permanentZip} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} required /></Col>
                                    </Row>
                                </Col>

                                <Row>
                                    <Col>
                                        <Button onClick={handleAddressSave}>Save Address</Button>
                                        {successMessage && <div className="success-message">{successMessage}</div>}
                                    </Col>
                                </Row>
                            </Row>

                        )}




                        {/* CUSTOMER HAVE PREVIOUS LOAN */}

                        {activeTab === 'previousLoan' && (

                            <Row>
                                <Col>
                                    <Row className='profile-address-single-row'>
                                        <Col lg={2}><span>Previous Loan</span></Col>
                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <Form.Check
                                                    type="radio"
                                                    label="Yes"
                                                    name="previousLoan"
                                                    className='me-3'
                                                    checked={hasPreviousLoan === true}
                                                    onChange={() => setHasPreviousLoan(true)}
                                                />
                                                <Form.Check
                                                    type="radio"
                                                    label="No"
                                                    name="previousLoan"
                                                    checked={hasPreviousLoan === false}
                                                    onChange={() => setHasPreviousLoan(false)}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    {hasPreviousLoan && (
                                        <>
                                            <Row className='profile-address-single-row'>
                                                <Col><span className="profile-finance">Finance Name</span></Col>
                                                <Col><span className="profile-finance">Year of Loan</span></Col>
                                                <Col><span className="profile-finance">Loan Amount</span></Col>
                                                <Col><span className="profile-finance">Outstanding Amount</span></Col>
                                            </Row>
                                            {previousLoanDetails.map((loan, index) => (
                                                <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                                    <Col><input className="input-box-address" placeholder='Finance Name' name="financeName" type="text" value={loan.financeName} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                                    <Col><input className="input-box-address" name="yearOfLoan" placeholder='Year of Loan' type="text" value={loan.yearOfLoan} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                                    <Col><input className="input-box-address" name="loanAmount" placeholder='Loan Amount' type="text" value={loan.loanAmount} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                                    <Col><input className="input-box-address" name="outstandingAmount" placeholder='Outstanding Amount' type="text" value={loan.outstandingAmount} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                                    <Col lg={1}>
                                                        <IoCloseSharp
                                                            style={{ color: 'red', cursor: 'pointer' }}
                                                            size={30}
                                                            onClick={() => deleteLoanRow(index)}
                                                        />
                                                    </Col>
                                                </Row>
                                            ))}
                                            <Button onClick={addLoanRow} style={{ marginBottom: '10px', marginLeft: "-10px" }}>+ Add another Loan</Button>
                                        </>
                                    )}
                                </Col>
                                <Row>
                                    <Col>
                                        <Button onClick={handlePreviousLoanSave}>Save Previous Loan</Button>
                                        {successMessage && <div className="success-message">{successMessage}</div>}
                                    </Col>
                                </Row>
                            </Row>

                        )}




                        {/* CUSTOMER IS A SALARIED PERSON */}

                        {activeTab === 'salariedperson' && (
                            <Row>
                                <Col>
                                    <>
                                        <Row className='profile-address-single-row'>
                                            <Col><span className="profile-finance" style={{ textAlign: "left" }}>Company Name</span></Col>
                                            <Col><span className="profile-finance" style={{ textAlign: "left" }}>Designation</span></Col>
                                            <Col><span className="profile-finance" style={{ textAlign: "left" }}>Monthly Salary</span></Col>
                                            <Col><span className="profile-finance" style={{ textAlign: "left" }}>How Many Years of Work</span></Col>
                                        </Row>
                                        {salariedPersons.map((salaried, index) => (
                                            <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                                <Col>
                                                    <input
                                                        className="input-box-address"
                                                        placeholder='Company Name'
                                                        name="companyName"
                                                        type="text"
                                                        value={salaried.companyName}
                                                        onChange={(e) => handleSalaryInputChange(index, e)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <input
                                                        className="input-box-address"
                                                        name="role"
                                                        placeholder='Role'
                                                        type="text"
                                                        value={salaried.role}
                                                        onChange={(e) => handleSalaryInputChange(index, e)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <input
                                                        className="input-box-address"
                                                        name="monthlySalary"
                                                        placeholder='Monthly Salary'
                                                        type="text"
                                                        value={salaried.monthlySalary}
                                                        onChange={(e) => handleSalaryInputChange(index, e)}
                                                    />
                                                </Col>
                                                <Col>
                                                    <input
                                                        className="input-box-address"
                                                        name="workExperience"
                                                        placeholder='How Many Years of Work'
                                                        type="text"
                                                        value={salaried.workExperience}
                                                        onChange={(e) => handleSalaryInputChange(index, e)}
                                                    />
                                                </Col>
                                                <Col lg={1}>
                                                    <Row key={salaried._id}>
                                                        {/* other columns */}
                                                        <Col>
                                                            <IoCloseSharp
                                                                style={{ color: 'red', cursor: 'pointer' }}
                                                                size={30}
                                                                onClick={() => deleteSalariedPerson(salaried._id)}
                                                            />
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        ))}
                                    </>
                                </Col>

                                <Row>
                                    <Row>
                                        <Col>
                                            <Button onClick={addSalariedPerson} style={{ marginBottom: '10px', marginLeft: "10px" }}>+ Add Company</Button>
                                        </Col>
                                    </Row>
                                </Row>
                                <Row>
                                    <Col>
                                        <Button onClick={handleSaveSalariedPerson}>Save Salary Details</Button>
                                        {successMessage && <div className="success-message">{successMessage}</div>}
                                    </Col>
                                </Row>
                            </Row>
                        )}




                        {/* CUSTOMER LOAN PROCESSING DETAILS */}

                        {activeTab === 'loanprocessing' && (
                            <>
                                <Row className={`Upload-pdf-row ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                                    <div className='Upload-profile-div'>
                                        <h6 >Upload Pdf</h6>

                                        <div>
                                            <input type="file" onChange={handleFileChange} style={{}} />

                                            <div className="file-name">{pdfName}</div>
                                            <div>
                                                <Button onClick={handleUpload}>Upload</Button>

                                            </div>
                                        </div>
                                        {/* <Col lg={1}>
                                            {!editiloanprocess && (
                                                <Button style={{ width: "80px", marginTop: '20px' }} onClick={handleEditLoanProcess}>Edit</Button>

                                            )}
                                        </Col> */}
                                    </div>

                                </Row>

                                {loading ? (
                                    <div>Loading...</div>
                                ) : editiloanprocess ? (
                                    <>
                                        <Row >
                                            <Col>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">IT Returns</span></Col>
                                                    <Col>
                                                        <Select
                                                            options={options}
                                                            isMulti
                                                            value={selectedOptions}
                                                            onChange={handleChange}
                                                            className='it-returns '
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">Check Bounds Status</span></Col>
                                                    <Col>
                                                        <Form.Select
                                                            className="check-bounds-loan "
                                                            value={checkBounds}
                                                            onChange={(e) => setCheckBounds(e.target.value)} >
                                                            <option value="">Select</option>
                                                            <option value="Yes">Yes</option>
                                                            <option value="No">No</option>
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">Customer Block Status</span></Col>
                                                    <Col>
                                                        <Form.Select
                                                            className="check-bounds-loan"
                                                            value={blockStatus}
                                                            onChange={(e) => setBlockStatus(e.target.value)} // Uncomment if you want to allow changes
                                                            disabled={blockStatus === 'Active'} // Disable the dropdown if blockStatus is "Active"
                                                        >
                                                            <option value="Inactive">Inactive</option>
                                                        </Form.Select>
                                                    </Col>

                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">Customer File Status</span></Col>
                                                    <Col lg={2}>
                                                        <Form.Control
                                                            as="select"
                                                            value="select"
                                                            onChange={handleFileStatusChange}
                                                            className="check-bounds-loan"


                                                        >
                                                            <option value="">Select</option>

                                                        </Form.Control>
                                                    </Col>
                                                </Row>

                                                {customerDetails.customerType === 'Business' && (
                                                    <>
                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">Monthly Income</span></Col>
                                                            <Col>
                                                                <input
                                                                    type='number'
                                                                    className="box"
                                                                    value={monthlyIncome}
                                                                    onChange={(e) => setMonthlyIncome(e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">MSNE Reg No.</span></Col>
                                                            <Col>
                                                                <input
                                                                    type='number'
                                                                    className="box"
                                                                    value={msneNo}
                                                                    onChange={(e) => setmsneNo(e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">GST No</span></Col>
                                                            <Col>
                                                                <input
                                                                    type='number'
                                                                    className="box"
                                                                    value={gstNo}
                                                                    onChange={(e) => setGstNo(e.target.value)}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">Cibil Record</span></Col>
                                                    <Col>
                                                        <input
                                                            type='number'
                                                            className="box"
                                                            value={cibilRecord}
                                                            onChange={(e) => setCibilRecord(e.target.value)}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col>
                                                        <Button onClick={handleLoanProcessingSave}>Save Loan Processing</Button>
                                                        {successMessage && <div className="success-message">{successMessage}</div>}

                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </>
                                ) : (
                                    <>
                                        <Row className='Row1 view-row-size'>
                                            <Col lg={3}>
                                                <span className="customer-sentence">IT Returns</span>
                                            </Col>
                                            <Col lg={2}>
                                                <div className="box customer-data-font" style={{ width: "100px" }}>
                                                    {selectedOptions.length > 0 ? (
                                                        <span>
                                                            {selectedOptions.map((option, index) => (
                                                                <span key={option.value}>
                                                                    {option.label}
                                                                    {index < selectedOptions.length - 1 && <span>/</span>}
                                                                </span>
                                                            ))}
                                                        </span>
                                                    ) : (
                                                        loanProcessingDetails && loanProcessingDetails.itReturns && (
                                                            <span>
                                                                {loanProcessingDetails.itReturns.map((itReturn, index) => (
                                                                    <span key={index}>
                                                                        {itReturn}
                                                                        {index < loanProcessingDetails.itReturns.length - 1 && <span>/</span>}
                                                                    </span>
                                                                ))}
                                                            </span>
                                                        )
                                                    )}
                                                </div>

                                            </Col>
                                            <Col lg={1}></Col>
                                            <Col lg={2}><span className="customer-sentence" >Rejected Reason</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{ } Null</div></Col>
                                        </Row>

                                        <Row className="Row1 view-row-size">
                                            <Col lg={3}><span className="customer-sentence">Check Bounds Status</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.checkBounds}</div></Col>
                                        </Row>
                                        <Row className="Row1 view-row-size">
                                            <Col lg={3}><span className="customer-sentence">Customer Block Status</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.blockStatus}</div></Col>
                                        </Row>
                                        <Row className="Row1 view-row-size">
                                            <Col lg={3}><span className="customer-sentence">Customer File Status</span></Col>
                                            <Col lg={2}>
                                                <Form.Control

                                                    value={loanProcessingDetails && loanProcessingDetails.fileStatus}
                                                    // onChange={handleFileStatusChange}
                                                    className="box customer-data-font"
                                                    style={{ width: '50px' }}
                                                >
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                           
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="customer-sentence">Cibil Score</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.cibilRecord}</div></Col>
                                                </Row>
                                                {customerDetails.customerType === 'Business' && (
                                                    <>
                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">MSNE Reg.No</span></Col>
                                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.msneNo}</div></Col>
                                                        </Row>

                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">Monthly Income</span></Col>
                                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.monthlyIncome}</div></Col>
                                                        </Row>
                                                        <Row className="Row1 view-row-size">
                                                            <Col lg={3}><span className="customer-sentence">GST No</span></Col>
                                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.gstNo}</div></Col>
                                                        </Row>
                                                    </>)}
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </>
                        )}

                    </Row>


                    {/* CUSTOMER DELETE THE ACCOUNT */}

                    <Row>
                        <div style={{ textAlign: "end" }}>
                            <a href='#' style={{ textDecoration: "none" }} onClick={handleDeleteAccount}>
                                Are you Delete Your Account ?
                            </a>
                        </div>
                    </Row>
                </Col>
            </Row >
        </Container >
    );
}
export default Profile_View;