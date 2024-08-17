import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import React, { useState, useEffect } from "react";
import './Customer_reg.css'
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import Address from "./Address";
import Loan_process from "./Loan_Processing";

function Customer_reg({ onSuccess }) {
    const navigate = useNavigate();
    const location = useLocation();
    const homepage = () => {
        navigate('/customer');
    }
    const { isSidebarExpanded } = useSidebar();
    const { contactNumber } = location.state || {}; // Extract contactNumber from location state
    const [customerFname, setCustomerFname] = useState('');
    const [customerLname, setCustomerLname] = useState('');
    const [customercontact, setCustomerContact] = useState(contactNumber || ''); // Set default value if contactNumber is available
    const [customeralterno, setCustomerAlterNo] = useState('');
    const [customerwhatsapp, setCustomerWhatsapp] = useState('');
    const [customermailid, setCustomerMailId] = useState('');
    const [typeofloan, setTypeOfLoan] = useState('');
    const [loanRequired, setLoanRequired] = useState('');
    const [ReferedBy, setReferedby] = useState('');
    const [userpassword, setUserPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [customerType, setCustomerType] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [customerNo, setCustomerNo] = useState('');
    const [loanTypes, setLoanTypes] = useState([]);
    const [gender, setGender] = useState('');
    const [level, setLevel] = useState('');
    const [Loanlevel, setLoanlevel] = useState('');
    const [customerId, setCustomerId] = useState('');
    const { contactId } = location.state || {};
  


    const handleChange = (setValue) => (e) => {
        let { value } = e.target;
        // Remove all characters except digits, alphabets, and "@" symbol
        value = value.replace(/[^A-Za-z0-9@.]/g, '');
        setValue(value);
    };

    useEffect(() => {
        axios.get('https://uksinfotechsolution.in:8000/api/loan-types')
            .then(response => {
                setLoanTypes(response.data.map(type => ({
                    value: type.id,
                    label: type.type
                })));
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    const validate = () => {
        const newErrors = {};
        const mobileNumberPattern = /^[0-9]{10}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!customerFname) newErrors.customerFname = "First Name is required";
        if (!customerLname) newErrors.customerLname = "Last Name is required";

        if (!customercontact) {
            newErrors.customercontact = "Contact is required";
        } else if (!mobileNumberPattern.test(customercontact)) {
            newErrors.customercontact = "Type a valid 10-digit number";
        }

        if (customeralterno && !mobileNumberPattern.test(customeralterno)) {
            newErrors.customeralterno = "Type a valid 10-digit number";
        }

        if (!customerwhatsapp) {
            newErrors.customerwhatsapp = "Whatsapp number is required";
        } else if (!mobileNumberPattern.test(customerwhatsapp)) {
            newErrors.customerwhatsapp = "Type a valid 10-digit number";
        }

        if (!customermailid) {
            newErrors.customermailid = "E-Mail ID is required";
        } else if (!emailPattern.test(customermailid)) {
            newErrors.customermailid = "Enter valid email address";
        }
        if (!typeofloan) newErrors.typeofloan = "Loan Type is required";
        if (!loanRequired) newErrors.loanRequired = "Loan Amount is required";
        if (!customerType) newErrors.customerType = "Customer Type is required";

        if (!userpassword) {
            newErrors.userpassword = "Password is required";
        } else if (!passwordPattern.test(userpassword)) {
            newErrors.userpassword = "Password must be at least 8 characters long and contain uppercase, lowercase, digits, and special characters";
        }

        if (!title) newErrors.title = "Select Title";
        if (!gender) newErrors.gender = "Select a Gender";

        return newErrors;
    };

    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            setShowPopup(true);
        }
    };

    const handleConfirmSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {


            try {
                const customerData = {
                    customerFname,
                    customerLname,
                    gender,
                    customercontact,
                    customerwhatsapp,
                    customeralterno,
                    customermailid,
                    typeofloan,
                    ReferedBy,
                    userpassword,
                    loanRequired,
                    customerType,
                    title,
                };
                const response = await axios.post('https://uksinfotechsolution.in:8000/register', customerData);
                const customerId = response.data.customerId; // Assume the response contains the new customer ID
                const customerNo = response.data.customerNo
                setCustomerId(customerId); // Set the customer ID
                console.log(customerId);
                console.log(customerNo);
                setErrors({});
                setCustomerFname('');
                setCustomerLname('');
                setGender('');
                setCustomerContact('');
                setCustomerAlterNo('');
                setCustomerWhatsapp('');
                setCustomerMailId('');
                setTypeOfLoan('');
                setLoanRequired('');
                setUserPassword('');
                setCustomerType('');
                setCustomerNo(customerNo); // Set the customer number if needed
                setShowPopup(false);

                // Close modal after successful submission
                onSuccess(customerId, customerType, customerNo); // Call onSuccess to switch to the next tab
                if (location.state && location.state.contactId) {
                    handleConvert({
                        contactId: location.state.contactId,
                        contactNumber: customercontact
                    });
                }
                alert(`Customer Basic Details Registered. \n Customer No: UKS-CUS-${customerNo}`);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    alert('Email already exists');
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        }
    };
// console.log(location.state.contactId);

  const handleConvert = () => {
        if (!contactId) {
            console.error('Contact ID is undefined');
            return;
        }

        axios.put(`https://uksinfotechsolution.in:8000/api/enquiries/convert/${contactId}`)
            .then(response => {
                // console.log('Contact converted successfully!', response.data);
                alert('Contact converted successfully!')
                // Add any additional logic here, such as redirecting or updating the UI
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                    alert(`Error converting contact: ${error.response.data.error}`);
                } else if (error.request) {
                    console.error('Error request data:', error.request);
                    alert('No response received from the server.');
                } else {
                    console.error('Error message:', error.message);
                    alert('Error converting contact');
                }
            });
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <>
            <Container fluid >
                <Row className="">
                    <Col xl={10} lg={6} md={5} xs={10} className={`New-Customer-container-second ${isNavbarExpanded ? 'content-expanded' : ''}`}>
                        <form onSubmit={handleSubmit}>

                            {message && <p className="message">{message}</p>}
                            <Row>
                                <Col lg={3}><span className="customer-sentence">Customer Type</span></Col>
                                <Col lg={2}>
                                    <input
                                        type="radio"
                                        value="Business"
                                        className="radio-btn"
                                        checked={customerType === 'Business'}
                                        onChange={() => setCustomerType('Business')}
                                    /> Business
                                    <Row>
                                        {errors.customerType && <span className="error">{errors.customerType}</span>}
                                    </Row>
                                </Col>
                                <Col>
                                    <input
                                        type="radio"
                                        value="Salaried Person"
                                        className="radio-btn"
                                        checked={customerType === 'Salaried Person'}
                                        onChange={() => setCustomerType('Salaried Person')}
                                    /> Salaried Person
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Title</span></Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Mr"
                                        className="radio-btn"
                                        checked={title === 'Mr'}
                                        onChange={() => setTitle('Mr')}
                                    /> Mr
                                    <Row>
                                        {errors.title && <span className="error">{errors.title}</span>}
                                    </Row>
                                </Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Ms"
                                        className="radio-btn"
                                        checked={title === 'Ms'}
                                        onChange={() => setTitle('Ms')}
                                    /> Ms
                                </Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Mrs"
                                        className="radio-btn"
                                        checked={title === 'Mrs'}
                                        onChange={() => setTitle('Mrs')}
                                    /> Mrs
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Primary Contact</span></Col>
                                <Col lg={3}>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={customerFname}
                                        onChange={handleChange(setCustomerFname)}
                                    />
                                    {errors.customerFname && <span className="error">{errors.customerFname}</span>}
                                </Col>
                                <Col lg={2}>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={customerLname}
                                        onChange={handleChange(setCustomerLname)}
                                    />
                                    {errors.customerLname && <span className="error">{errors.customerLname}</span>}
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}>
                                    <span className="customer-sentence">Gender</span>
                                </Col>
                                <Col lg={1}>
                                    <input
                                        type="radio"
                                        value="Male"
                                        className="radio-btn"
                                        checked={gender === 'Male'}
                                        onChange={() => setGender('Male')}
                                    /> Male
                                    <Row>
                                        {errors.gender && <span className="error">{errors.gender}</span>}
                                    </Row>
                                </Col>
                                <Col lg={2}>
                                    <input
                                        type="radio"
                                        value="Female"
                                        className="radio-btn"
                                        checked={gender === 'Female'}
                                        onChange={() => setGender('Female')}
                                    /> Female
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={3}>
                                    <input
                                        type="text"
                                        placeholder="Primary Number"
                                        value={customercontact}
                                        onChange={handleChange(setCustomerContact)}
                                    />
                                    {errors.customercontact && <span className="error">{errors.customercontact}</span>}
                                </Col>
                                <Col lg={3}>
                                    <input
                                        type="text"
                                        placeholder="Alternative Number"
                                        value={customeralterno}
                                        onChange={handleChange(setCustomerAlterNo)}
                                    />
                                    {errors.customeralterno && <span className="error">{errors.customeralterno}</span>}
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="Whatsapp Number"
                                        value={customerwhatsapp}
                                        onChange={handleChange(setCustomerWhatsapp)}
                                    />
                                    {errors.customerwhatsapp && <span className="error">{errors.customerwhatsapp}</span>}
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">E-Mail Id</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="E-Mail Id"
                                        value={customermailid}
                                        onChange={handleChange(setCustomerMailId)}
                                    />
                                    {errors.customermailid && <span className="error">{errors.customermailid}</span>}
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Type Of Loan</span></Col>
                                <Col lg={5}>
                                    <select
                                        value={typeofloan}
                                        onChange={(e) => setTypeOfLoan(e.target.value)}
                                        className="dropdown Section-1-dropdown"
                                    >
                                        <option value="">Select Loan Type</option>
                                        {loanTypes.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                    <Row>
                                        {errors.typeofloan && <span className="error">{errors.typeofloan}</span>}
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Loan Required</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="number"
                                        placeholder="Loan Required"
                                        value={loanRequired}
                                        onChange={handleChange(setLoanRequired)}
                                    />
                                    <Row>
                                        {errors.loanRequired && <span className="error">{errors.loanRequired}</span>}
                                    </Row>
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Refered By</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Refered By"
                                        value={ReferedBy}
                                        onChange={handleChange(setReferedby)}
                                    />

                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}><span className="customer-sentence">Password</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="password"
                                        placeholder="Example: Abc@1234"
                                        value={userpassword}
                                        onChange={handleChange(setUserPassword)}
                                    />
                                    {errors.userpassword && <span className="error">{errors.userpassword}</span>}
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={3}>
                                    <button type="submit" className="btn btn-primary" onClick={handleConfirmSubmit}>Submit</button>
                                </Col>
                            </Row>
                            {error && <p className="error">{error}</p>}
                        </form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Customer_reg;
