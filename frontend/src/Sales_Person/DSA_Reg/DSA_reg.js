import React, { useState,useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function DSA_reg({ onSuccess }) {
    const location = useLocation();
    const { contactId, contactNumber } = location.state || {};

    const [formData, setFormData] = useState({
        dsaName: "",
        dsaCompanyName: "",
        primaryNumber: contactNumber || '',
        alternateNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        password: ""
    });
// console.log(formData.primaryNumber);
 // Set the primaryNumber if contactNumber is available
 useEffect(() => {
    if (contactNumber) {
        setFormData(prevFormData => ({
            ...prevFormData,
            primaryNumber: contactNumber
        }));
    }
}, [contactNumber]);
    const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
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
        const passwordPattern = /^(?=.*[A-Z])(?=.*[\W_])(?=.*\d)[A-Za-z\d\W_]{8,}$/;
        const newErrors = {};

        if (!emailPattern.test(formData.email)) {
            newErrors.email = "Enter a valid email address";
        }

        if (!passwordPattern.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters long and include both Uppercase Lowercase letters and numbers";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
    
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/register', formData);
            const dsaDetails = response.data.dsa;    
            setShowPopup(true);
           alert(`DSA Registeration Successfully.\nDSA No: UKS-DSA-0${dsaDetails.dsaNumber}`);

            onSuccess(dsaDetails.id, dsaDetails.dsaNumber); // Pass the correct values to onSuccess
            if (location.state && location.state.contactId) {
                handleConvert({
                    contactId: location.state.contactId,
                    contactNumber: contactNumber
                });
            }
        } catch (error) {
            console.error('Error registering DSA:', error);
            alert("DSA Register Failed");
        }
    };
    
  const handleConvert = () => {
    if (!contactId) {
        console.error('Contact ID is undefined');
        return;
    }

    axios.put(`https://uksinfotechsolution.in:8000/api/dsa/enquiries/convert/${contactId}`)
        .then(response => {
            // console.log('Contact converted successfully!', response.data);
            alert('DSA Contact converted successfully!')
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


    return (
        <>
            <Container fluid className=" ">
                <Row className="">
                    <Col className="">
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <p className="index-customer-head">Register</p>
                            </Row>
                            <Row className="Row1">
                                <Col xl={2}><span className="customer-sentence">Name</span></Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">Company Name</span></Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col xl={2}>
                                    <input
                                        type="text"
                                        placeholder="Primary Number"
                                        name="primaryNumber"
                                        value={formData.primaryNumber}
                                        onChange={handleChange}
                                    />
                                </Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">E-Mail</span></Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">Website</span></Col>
                                <Col xl={2}>
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
                                <Col xl={2}><span className="customer-sentence">Password</span></Col>
                                <Col xl={2}>
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && <span style={{color:'red'}} className="error-message">{errors.password}</span>}
                                </Col>
                            </Row>
                            <Button type="submit" className="New-customer-submit-button contact">Register</Button>
                        </form>
                    </Col>
                </Row>

            </Container>
        </>
    );
}

export default DSA_reg;
