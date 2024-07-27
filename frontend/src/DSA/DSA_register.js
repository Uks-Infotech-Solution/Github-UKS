import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Index_Navbar from "../Indexpage/Navbar/Index-Navbar";
import Popup from './Register_popup'; // Import your Popup component
import './DSA_register.css';
import './New-Customer.css';

function DSA_Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dsaName: "",
        dsaCompanyName: "",
        primaryNumber: "",
        alternateNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        password: ""
    });
    const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
    const [dsaDetails, setDsaDetails] = useState(null); // State to manage DSA details
    const [errors, setErrors] = useState({}); // State to manage form errors

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[A-Za-z\d\W_]{8,}$/
        const newErrors = {};

        if (!emailPattern.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!passwordPattern.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters long and include both letters and numbers";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
<<<<<<< HEAD
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/register', formData);
=======
            const response = await axios.post('https://localhost:8000/api/dsa/register', formData);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
            const dsaDetails = response.data.dsa;
            console.log(response.data.dsa.dsaNumber); // Log the DSA details from the response

            console.log(response.data); // Log the DSA details from the response
            setDsaDetails(dsaDetails); // Set the DSA details to state
            setShowPopup(true); // Show the popup on successful registration
        } catch (error) {
            console.error('Error registering DSA:', error);
            alert("DSA Register Failed");
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        navigate('/dsa/login'); // Navigate to login page
    };

    return (
        <>
            <Container fluid className="Section-1-Container dsa-login-container">
                <Row className="Section-1-Row" style={{ paddingTop: '50px' }}>
                    <Col style={{ padding: '0px', marginRight: '10px' }} xl={5} lg={6} md={5} xs={10} className="New-Customer-container-second">
                        <div className="dsa-index-bg"></div>
                    </Col>
                    <Col xl={5} lg={6} md={5} xs={10} className="New-Customer-container-second">
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <p className="index-customer-head">DSA Registration</p>
                                <hr />
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Name</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        name="dsaName"
                                        value={formData.dsaName}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Company Name</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Company Name"
                                        name="dsaCompanyName"
                                        value={formData.dsaCompanyName}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="Primary Number"
                                        name="primaryNumber"
                                        value={formData.primaryNumber}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="Alternate Number"
                                        name="alternateNumber"
                                        value={formData.alternateNumber}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="text"
                                        placeholder="Whatsapp Number"
                                        name="whatsappNumber"
                                        value={formData.whatsappNumber}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">E-Mail</span></Col>
                                <Col lg={5}>
                                    <input
                                        type="email"
                                        placeholder="E-mail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Website</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="text"
                                        placeholder="Website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                    />
                                </Col>
                            </Row>
                            <Row className="Row1">
                                <Col lg={4}><span className="customer-sentence">Password</span></Col>
                                <Col lg={4}>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </Col>
                            </Row>
                            <Button type="submit" className="New-customer-submit-button contact">Register</Button>
                        </form>
                        <div>Already have an account? <a href="/dsa/login">Login</a></div>
                    </Col>
                </Row>
                {dsaDetails && (
                    <Popup show={showPopup} handleClose={handleClosePopup} dsaNumber={dsaDetails.dsaNumber} />
                )}
            </Container>
        </>
    );
}

export default DSA_Register;
