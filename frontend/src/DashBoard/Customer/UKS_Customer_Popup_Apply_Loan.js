import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button, Modal, Form, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UKS_POPUP_Apply_Loan = () => {
    const location = useLocation();
    const { selectedDSAs, customerId, uksId } = location.state || {};

    // console.log(selectedDSAs);

    const [customerDetails, setCustomerDetails] = useState(null);
    const [application, setApplication] = useState(null);

    const [LoanDetails, setLoanDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loanTypes, setLoanTypes] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loanLevels, setLoanLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showAddressModal, setShowAddressModal] = useState(false);
    // State variables for form inputs
    const [inputLoanAmount, setInputLoanAmount] = useState('');
    const [formattedLoanAmount, setFormattedLoanAmount] = useState('');
    let successfulSubmissions = 0;

    const [inputLoanDuration, setInputLoanDuration] = useState('');
    const [selectedLoanLevel, setSelectedLoanLevel] = useState('');
    const [selectedLoanSecured, setSelectedLoanSecured] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [selectedDocumentOption, setSelectedDocumentOption] = useState('');
    const [documentTypes, setDocumentTypes] = useState([]);
    const [Unsecured_documentTypes, setUnsecured_DocumentTypes] = useState([]);

    const [dsaIndex, setDsaIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dsaDetails, setDsaDetails] = useState({});


    useEffect(() => {
        handleShowModal();
    }, []);

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                const dsaId = selectedDSAs[dsaIndex].id;
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
                setDsaDetails(response.data);
                console.log(response.data);

            } catch (error) {
                console.error('Error fetching DSA details:', error);
                alert("Failed to fetch DSA details");
            }
        };
        if (dsaIndex < selectedDSAs.length) {
            fetchDSADetails();
        }
    }, [dsaIndex, selectedDSAs]);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId: customerId }
                });
                setCustomerDetails(response.data);
            } catch (error) {
                console.error('Error fetching customer details:', error.message);
            }
        };

        if (customerId) {
            fetchCustomerDetails();
        }
    }, [customerId]);

    useEffect(() => {
        const fetchLoanLevels = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/loan-levels');
                setLoanLevels(response.data);
                // console.log(response.data);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchLoanLevels();
    }, []);

    useEffect(() => {
        const fetchDocumentTypes = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/document-type');
                setDocumentTypes(response.data);
            } catch (error) {
                console.error('Error fetching document types:', error);
            }
        };

        fetchDocumentTypes();
    }, []);

    useEffect(() => {
        const fetchUnsecured_DocumentTypes = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/unsecured/document-type');
                setUnsecured_DocumentTypes(response.data);
            } catch (error) {
                console.error('Error fetching document types:', error);
            }
        };

        fetchUnsecured_DocumentTypes();
    }, []);

    const handleShowModal = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/loanapply/address/check', {
                params: { customerId }
            });

            if (response.data) {
                // If address is found, show the apply loan modal
                setShowModal(true);

            } else {
                // If address not found, show the address update modal
                setShowAddressModal(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // If address not found, show the address update modal
                setShowAddressModal(true);
            } else {
                console.error('Server error', error);
            }
        }
    };
    const handleCloseAddressModal = () => {
        setShowAddressModal(false);
        navigate('/uks/customer/detail/view', { state: { customerId,uksId } });
    };
    const handleCloseModal = () => setShowModal(false);
    const handleShowSuccessModal = () => setShowSuccessModal(true);
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/uks/customer/list', { state: { uksId } });
    };

    const determineLoanLevel = (amount) => {
        if (amount < 100000) return 'Bronze';
        if (amount < 1000000) return 'Silver';
        if (amount < 100000000) return 'Gold';
        return 'Platinum';
    };
    const formatNumber = (value) => {
        if (typeof value === 'number') {
            return new Intl.NumberFormat('en-IN').format(value);
        }
        return '';
    };
    useEffect(() => {
        const loanAmount = customerDetails?.loanRequired;
        if (loanAmount) {
            const event = { target: { value: loanAmount } };
            handleLoanAmountChange(event);
        }
    }, [customerDetails]);
    const handleLoanAmountChange = (loanAmount) => {
        setInputLoanAmount(loanAmount);
        setFormattedLoanAmount(formatNumber(loanAmount));
        const level = determineLoanLevel(loanAmount);
        setSelectedLoanLevel(level);
    };


    const handleSecuredChange = (e) => {
        setSelectedLoanSecured(e.target.value);
        setSelectedDocumentType(''); // Reset selected document type when loan type changes
    };

    const handleDocumentTypeChange = (event) => {
        setSelectedDocumentType(event.target.value);
    };

    const handleDocumentOptionChange = (event) => {
        setSelectedDocumentOption(event.target.value);
    };

    const handleSubmit = async (dsaId) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/customer/loan/apply', {
                customerId: customerId,
                customerName: customerDetails.customerFname,
                customerNo: customerDetails.customerNo,
                customerMailId: customerDetails.customermailid,
                loanType: customerDetails.typeofloan,
                loanAmount: customerDetails.loanRequired,
                loanRequiredDays: inputLoanDuration,
                dsaId: dsaId,
                dsaName: selectedDSAs.find((dsa) => dsa.id === dsaId).name,
                dsaNumber: selectedDSAs.find((dsa) => dsa.id === dsaId).dsaNumber,
                dsaCompanyName: selectedDSAs.find((dsa) => dsa.id === dsaId).dsaCompanyName,

                applyLoanStatus: "Pending",
                loanLevel: selectedLoanLevel, // Send the selected loan level
                loanSecured: selectedLoanSecured, // Send secured/unsecured status
                documentType: selectedDocumentType, // Send selected document type
                documentOption: selectedDocumentOption // Send selected document option
            });

            if (response.status === 201) {
                console.log('Loan application submitted successfully');
                // alert('Successfully submited applications')      

            } else if (response.status === 200 && response.data.message.includes('Loan with the same details already exists')) {
                // Extract details from the response
                successfulSubmissions--;

                const { customerName, dsaName } = response.data.data;
                // Format the alert message
                const alertMessage = `Already: ${customerName} applied for the same loan with ${dsaName}`;
                // Display the alert with the formatted message
                alert(alertMessage);
                // console.log('Existing loan:', response.data.data);
            } else {
                console.error('Unexpected response:', response);
                successfulSubmissions--;

                alert("Failed to submit loan application");
            }
        } catch (error) {
            console.error('Error submitting loan application:', error);
            successfulSubmissions--;
            alert('Failed to submit applications', error)

        } finally {
            setIsSubmitting(false);
        }
    };
    const handleApplyLoan = async () => {
        if (selectedDSAs.length === 0) return;


        for (let i = 0; i < selectedDSAs.length; i++) {
            const dsaId = selectedDSAs[i].id;
            //   console.log(dsaId);

            try {
                await handleSubmit(dsaId);
                successfulSubmissions++;
            } catch (error) {
                console.error('Error submitting loan application:', error);
            }
        }

        if (successfulSubmissions === selectedDSAs.length) {
            handleShowSuccessModal(); // Show success modal when all DSA IDs are processed successfully
        }
        else{
        navigate('/uks/customer/list', { state: { uksId } });

        }
    };
    return (
        <Container fluid className="dsa-loan-customer-container">
            <div className="dsa-loan-customer-content">
                {/* <div>Confirmation Page
                    <Button
                        variant="success"
                        onClick={handleShowModal}
                        className="apply-loan-button"
                    >
                        Apply Loan
                    </Button>
                </div> */}
                {/* Address Update Modal */}
                <Modal show={showAddressModal} onHide={handleCloseAddressModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Address</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Please update the Customer address to proceed with the Loan application.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleCloseAddressModal}>
                            Update Address
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-success">Apply Loan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Label column sm={4}><strong>Customer Name:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={customerDetails?.customerFname} readOnly />
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Form.Label column sm={4}><strong>Customer ID:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={customerDetails?.customerNo} readOnly />
                                </Col>
                            </Row>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Applied For:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={customerDetails?.typeofloan} readOnly />

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Amount:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={customerDetails?.loanRequired} readOnly />
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Required Days:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="number" placeholder="Enter Required Days" value={inputLoanDuration} onChange={(e) => setInputLoanDuration(e.target.value)} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Level:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control type="text" value={selectedLoanLevel} readOnly />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Security:</strong></Form.Label>
                                <Col sm={8}>
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="radio"
                                            label="Secured"
                                            name="loanSecured"
                                            className='me-3'
                                            value="Secured"
                                            onChange={handleSecuredChange}
                                            checked={selectedLoanSecured === 'Secured'}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="Unsecured"
                                            name="loanSecured"
                                            className='me-3'
                                            value="Unsecured"
                                            onChange={handleSecuredChange}
                                            checked={selectedLoanSecured === 'Unsecured'}
                                        />

                                    </div>
                                </Col>
                            </Form.Group>

                            {(selectedLoanSecured === 'Secured') && (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}><strong>Document Type:</strong></Form.Label>
                                    <Col sm={8}>
                                        <select value={selectedDocumentType} onChange={handleDocumentTypeChange} className='form-select'>
                                            <option value="">Select Document Type</option>
                                            {
                                                documentTypes.map((docType) => (
                                                    <option key={docType._id} value={docType.type}>{docType.type}</option>
                                                ))
                                            }
                                        </select>
                                    </Col>

                                </Form.Group>
                            )}
                            {(selectedLoanSecured === 'Unsecured') && (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}><strong>Document Type</strong></Form.Label>
                                    <Col sm={8}>
                                        <select value={selectedDocumentType} onChange={handleDocumentTypeChange} className='form-select'>
                                            <option value={documentTypes} >Select Document Type</option>
                                            {Unsecured_documentTypes.map((docType) => (
                                                <option key={docType._id} value={docType.type} >
                                                    {docType.type}
                                                </option>
                                            ))}
                                        </select>

                                    </Col>
                                </Form.Group>
                            )}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Document </strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select" value={selectedDocumentOption} onChange={handleDocumentOptionChange}>
                                        <option value="" disabled>Select</option>
                                        <option value="In Hand">In Hand</option>
                                        <option value="In Bank">In Bank</option>
                                        <option value="In Private Finance">In Private Finance</option>
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                        <Button variant="success" onClick={handleApplyLoan}>Submit</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className="text-success">Application Submitted</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Your loan application has been successfully submitted.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={handleCloseSuccessModal}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </Container>
    );
};

export default UKS_POPUP_Apply_Loan;
