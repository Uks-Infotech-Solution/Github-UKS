import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import '../Section-1/Section-1.css';
import axios from "axios";
import React, { useState, useEffect } from "react";
import Popup from './Popup'; // Import the Popup component
import index from '../Images/hero.png';
import './New-Customer.css';
const Section_1 = () => {
    const [customerType, setCustomerType] = useState('');
    const [title, setTitle] = useState('');
    const [customerFname, setCustomerFname] = useState('');
    const [customerLname, setCustomerLname] = useState('');
    const [gender, setGender] = useState('');
    const [customercontact, setCustomerContact] = useState('');
    const [customeralterno, setCustomerAlterNo] = useState('');
    const [customerwhatsapp, setCustomerWhatsapp] = useState('');
    const [customermailid, setCustomerMailId] = useState('');
    const [typeofloan, setTypeOfLoan] = useState('');
    const [loanRequired, setLoanRequired] = useState('');
    const [userpassword, setUserPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState('');
    const [loanTypes, setLoanTypes] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [customerNo, setCustomerNo] = useState('');
    const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

    useEffect(() => {
        // Fetch loan types from the backend
        axios.get('http://148.251.230.14:8000/api/loan-types')
            .then(response => {
                setLoanTypes(response.data.map(type => ({
                    value: type.id,
                    label: type.type
                })));
            })
            .catch(error => {
                console.error('Error fetching loan types:', error);
            });
    }, []);

    const handleChange = setter => e => {
        setter(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!customerType) newErrors.customerType = 'Customer type is required';
        if (!title) newErrors.title = 'Title is required';
        if (!customerFname) newErrors.customerFname = 'First name is required';
        if (!customerLname) newErrors.customerLname = 'Last name is required';
        if (!gender) newErrors.gender = 'Gender is required';
        if (!customercontact) newErrors.customercontact = 'Primary contact number is required';
        if (!customermailid) newErrors.customermailid = 'Email is required';
        if (!typeofloan) newErrors.typeofloan = 'Loan type is required';
        if (!loanRequired) newErrors.loanRequired = 'Loan amount is required';
        if (!userpassword) newErrors.userpassword = 'Password is required';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await axios.post('http://148.251.230.14:8000/api/customer/register', {
                    customerType,
                    title,
                    customerFname,
                    customerLname,
                    gender,
                    customercontact,
                    customeralterno,
                    customerwhatsapp,
                    customermailid,
                    typeofloan,
                    loanRequired,
                    userpassword,
                });

                setCustomerNo(response.data.customerNo);
                setShowPopup(true);
                setMessage('Customer registered successfully!');
            } catch (error) {
                setMessage('Error registering customer: ' + error.message);
            }
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
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
