import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../Section-1/Section-1.css';
import axios from "axios";
import React, { useState } from "react";
import Popup from './Popup'; // Import the Popup component
import index from '../Images/hero.png';
import { useEffect } from "react";
import './New-Customer.css';

function Section_1() {
    const navigate = useNavigate();
    const homepage = () => {
        navigate('/customer');
    }

    const [customerFname, setCustomerFname] = useState('');
    const [customerLname, setCustomerLname] = useState('');
    const [customercontact, setCustomerContact] = useState('');
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
            console.log(response.data);
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

        if (!userpassword) {
            newErrors.userpassword = "Password is required";
        } else if (!passwordPattern.test(userpassword)) {
            newErrors.userpassword = "Password must be at least 8 characters with one capital letter one number one symbol";
        }


        if (!title) newErrors.title = "Select Tittle";


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
                    userpassword,
                    loanRequired,
                    ReferedBy,
                    customerType,
                    title,
                };
                const response = await axios.post('https://uksinfotechsolution.in:8000/register', customerData);
                console.log(customerData);
                const customerNo = response.data.customerNo; // Assume the response contains the new customer number
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
                setTitle('');
                setCustomerNo(customerNo); // Set the customer number
                setShowPopup(true);
            }
            catch (error) {
                if (error.response && error.response.status === 400) {
                    alert('Email already exists');
                    navigate('/customer/login');
                    // console.log(level);
                } else {
                    setError('An error occurred. Please try again.');
                }
            }
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        navigate('/customer/login');
    };
    const handleSelectChange = (setValue) => (e) => {
        setValue(e.target.value);
    };

    return (
        <>
            <Container fluid className={`Section-1-Container ${showPopup ? 'blur' : ''}`}>
                <Row className="Section-1-Row">
                    <Col xl={5} lg={6} md={5} xs={10} className={`New-Customer-container-second ${isNavbarExpanded ? 'content-expanded' : ''}`}>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <p className="index-customer-head">Customer Registration</p>
                                <hr />
                            </Row>

                            {message && <p className="message">{message}</p>}

                            <Row>
                                <Col lg={4}><span className="customer-sentence">Customer Type</span></Col>
                                <Col lg={3}>
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
                                <Col >
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
                                <Col lg={4}><span className="customer-sentence">Title</span></Col>
                                <Col lg={2}>
                                    <input
                                        type="radio"
                                        value="Mr"
                                        className="radio-btn"
                                        checked={title === 'Mr'}
                                        onChange={() => setTitle('Mr')}
                                    /> Mr <Row>
                                        {errors.title && <span className="error">{errors.title}</span>}

                                    </Row>
                                </Col>
                                <Col lg={2}>
                                    <input
                                        type="radio"
                                        value="Ms"
                                        className="radio-btn"
                                        checked={title === 'Ms'}
                                        onChange={() => setTitle('Ms')}
                                    /> Ms
                                </Col>
                                <Col lg={2}>
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
                                <Col lg={4}><span className="customer-sentence">Primary Contact</span></Col>
                                <Col lg={4}>
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
                                <Col lg={4}>
                                    <span className="customer-sentence">Gender</span>
                                </Col>
                                <Col lg={6}>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="dropdown Section-1-dropdown"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Transgender">Transgender</option>
                                    </select>
                                    <Row>
                                        {errors.gender && <span className="error">{errors.gender}</span>}

                                    </Row>
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="Primary Number"
                                        value={customercontact}
                                        onChange={handleChange(setCustomerContact)}
                                    />
                                    <Row>
                                        {errors.customercontact && <span className="error">{errors.customercontact}</span>}

                                    </Row>
                                </Col>
                                <Col lg={3}>

                                    <input
                                        type="text"
                                        placeholder="Alternate Number"
                                        value={customeralterno}
                                        onChange={handleChange(setCustomerAlterNo)}

                                    ></input>
                                    <Row>
                                        {errors.customeralterno && <span className="error">{errors.customeralterno}</span>}

                                    </Row>
                                </Col>

                            </Row>

                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Whatsapp Number"
                                        value={customerwhatsapp}
                                        onChange={handleChange(setCustomerWhatsapp)}
                                    />
                                    <Row>
                                        {errors.customerwhatsapp && <span className="error">{errors.customerwhatsapp}</span>}

                                    </Row>
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">E-Mail</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        value={customermailid}
                                        onChange={handleChange(setCustomerMailId)}
                                    />
                                    <Row>
                                        {errors.customermailid && <span className="error">{errors.customermailid}</span>}

                                    </Row>
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Type Of Loan</span></Col>
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
                                <Col lg={4}><span className="customer-sentence">Loan Required</span></Col>
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
                                <Col lg={4}><span className="customer-sentence">Refered By</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Refered By"
                                        value={ReferedBy}
                                        onChange={handleChange(setReferedby)}
                                    />
                                    <Row>
                                        {errors.loanRequired && <span className="error">{errors.loanRequired}</span>}
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">User Password</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={userpassword}
                                        onChange={handleChange(setUserPassword)}
                                    />
                                    {errors.userpassword && <span className="error">{errors.userpassword}</span>}
                                </Col>
                            </Row>

                            <Button type="submit" className="New-customer-submit-button contact">Register</Button>
                        </form>

                        <div>Already have an account? <a href="/customer/login">Login</a></div>

                    </Col>
                    <Col xl={5} md={5}>
                        <img src={index} alt="" className="Section-1-image" />
                    </Col>
                </Row>

                <Popup show={showPopup} handleClose={handleClosePopup} customerNo={customerNo} />
            </Container>
        </>
    );
}

export default Section_1;
