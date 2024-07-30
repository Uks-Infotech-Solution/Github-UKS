import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Button, Modal, Form, Row, Col, Container } from 'react-bootstrap';
import './DSA_Loan_Customer.css'; // Import custom CSS for component styling
import { useNavigate } from 'react-router-dom';

const DSA_Loan_Customer = () => {
    const location = useLocation();
    const { dsaId } = location.state || {};
    const { customerId } = location.state || {};

    const [customerDetails, setCustomerDetails] = useState(null);
    const [dsaDetails, setDsaDetails] = useState(null);
    const [application, setApplication] = useState(null);

    const [LoanDetails, setLoanDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loanTypes, setLoanTypes] = useState([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loanLevels, setLoanLevels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // State variables for form inputs
    const [selectedLoanType, setSelectedLoanType] = useState('');
    const [inputLoanAmount, setInputLoanAmount] = useState('');
    const [formattedLoanAmount, setFormattedLoanAmount] = useState('');

    const [inputLoanDuration, setInputLoanDuration] = useState('');
    const [selectedLoanLevel, setSelectedLoanLevel] = useState('');
    const [selectedLoanSecured, setSelectedLoanSecured] = useState('');
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const [selectedDocumentOption, setSelectedDocumentOption] = useState('');
    const [documentTypes, setDocumentTypes] = useState([]);
    const [Unsecured_documentTypes, setUnsecured_DocumentTypes] = useState([]);

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
                setDsaDetails(response.data);
            } catch (error) {
                console.error('Error fetching DSA details:', error);
                alert("Failed to fetch DSA details");
            }
        };
        if (dsaId) { fetchDSADetails(); }
    }, [dsaId]);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/${dsaId}/loanDetails`);
                if (response.status === 200) {
                    setLoanDetails(response.data.loanDetails);
                }
            } catch (error) {
                console.error('Error fetching loan details:', error);
            }
        };

        fetchLoanDetails();
    }, [dsaId]);

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

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowSuccessModal = () => setShowSuccessModal(true);
    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/customer-dashboard', { state: { customerId } });
    };

    const determineLoanLevel = (amount) => {
        if (amount < 100000) return 'Bronze';
        if (amount < 1000000) return 'Silver';
        if (amount < 100000000) return 'Gold';
        return 'Platinum';
    };
    const formatNumber = (value) => {
        if (!value) return '';
        const number = parseFloat(value.replace(/,/g, ''));
        return isNaN(number) ? '' : new Intl.NumberFormat('en-IN').format(number);
    };

    const handleLoanAmountChange = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            setInputLoanAmount(rawValue);
            setFormattedLoanAmount(formatNumber(rawValue));
            const level = determineLoanLevel(rawValue);
            setSelectedLoanLevel(level);
        }
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

    const handleSubmit = async () => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/customer/loan/apply', {
                customerId: customerId,
                customerName: customerDetails.customerFname,
                customerNo: customerDetails.customerNo,
                customerMailId: customerDetails.customermailid,
                loanType: selectedLoanType,
                loanAmount: inputLoanAmount,
                loanRequiredDays: inputLoanDuration,
                dsaId: dsaId,
                dsaName: dsaDetails.dsaName,
                dsaNumber: dsaDetails.dsaNumber,
                dsaCompanyName: dsaDetails.dsaCompanyName,
                applyLoanStatus: "Pending",
                loanLevel: selectedLoanLevel, // Send the selected loan level
                loanSecured: selectedLoanSecured, // Send secured/unsecured status
                documentType: selectedDocumentType, // Send selected document type
                documentOption: selectedDocumentOption // Send selected document option
            });

            if (response.status === 201) {
                setShowModal(false);
                handleShowSuccessModal();
                setApplication(response.data.data); // Make sure the property name matches what is returned by your backend
                console.log(response.data); // Ensure this logs the expected response
            } else {
                console.error('Failed to submit loan application');
                alert("Fill All Inputs")
            }
        } catch (error) {
            console.error('Error submitting loan application:', error);
        }
    };

    return (
        <Container fluid className="dsa-loan-customer-container">
            <div className="dsa-loan-customer-content">
                <h5 className="section-title">Type of Loan Providing</h5>
                <hr />
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Serial No.</th>
                                <th>Type of Loan</th>
                                <th>Required Days</th>
                                <th>Required Document</th>
                                <th>Required Type</th>
                                <th>Required Cibil Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {LoanDetails.map((loan, index) => (
                                <tr key={loan._id || index}>
                                    <td>{index + 1}</td>
                                    <td>{loan.typeOfLoan}</td>
                                    <td>{loan.requiredDays}</td>
                                    <td>{loan.requiredDocument}</td>
                                    <td>{loan.requiredType}</td>
                                    <td>{loan.requiredCibilScore}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    <Button
                        variant="success"
                        onClick={handleShowModal}
                        className="apply-loan-button"
                    >
                        Apply Loan
                    </Button>
                </div>

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
                                    <select className="form-select" value={selectedLoanType} onChange={(e) => setSelectedLoanType(e.target.value)}>
                                        <option value="">Select</option>
                                        {LoanDetails.map((loan, index) => (
                                            <option key={loan._id || index} value={loan.typeOfLoan}>
                                                {loan.typeOfLoan}
                                            </option>
                                        ))}
                                    </select>

                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={4}><strong>Loan Amount:</strong></Form.Label>
                                <Col sm={8}>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter Loan Amount"
                                        value={formattedLoanAmount}
                                        onChange={handleLoanAmountChange}
                                    />
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
                        <Button variant="success" onClick={handleSubmit}>Submit</Button>
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

export default DSA_Loan_Customer;
