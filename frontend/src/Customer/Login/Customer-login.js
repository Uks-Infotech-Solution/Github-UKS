import React, { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import '../Login/Customer_login.css';

function Customer_login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
<<<<<<< HEAD
            const response = await axios.post('https://uksinfotechsolution.in:8000/login', {
=======
            const response = await axios.post('https://localhost:8000/login', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                email,
                password,
            });

            const { customerId } = response.data;

<<<<<<< HEAD
            const customerResponse = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
=======
            const customerResponse = await axios.get('https://localhost:8000/customer-details', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                params: {
                    customerId,
                },
            });
            console.log(customerResponse.data.customerFname);

            const loginDateTime = new Date().toISOString();
<<<<<<< HEAD
            await axios.post('https://uksinfotechsolution.in:8000/customer/login/session', {
=======
            await axios.post('https://localhost:8000/customer/login/session', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                customerId,
                loginDateTime
            });

            setSuccessMessage("Login is successful!");
            setTimeout(() => {
                navigate('/customer-dashboard', { state: { customerId } });
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response.data.error || 'An error occurred during login.');
            alert(error.response.data.error || 'An error occurred during login.');
        }
    };

    return (
        <>
        <Container fluid className="Customer-login-container">
            <Row className="Customer-login-row">
                <Col xl={3} lg={4} md={5} xs={11} className="customer-loan"></Col>
                <Col className="Customer-login-col" xl={3} lg={4} md={5} xs={11}>
                    <div>
                        <p style={{ color: '#2F4F4F', fontSize: '20px', fontWeight: '500' }}>Customer Login</p>
                        <div className="Customer-login-div">
                            <input
                                type="text"
                                className="login-input"
                                placeholder="Username or Email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="password-input-container">
                            <input
                                type="password"
                                className="login-input"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <Button className="Customer-login-button" onClick={handleSubmit}>Login</Button>
                        {successMessage && <div className="success-message">{successMessage}</div>}
                        <div className="login-forget-password"><a href="/customer/forget/password">Forget Password?</a></div>
                        <div style={{textAlign:'start'}}>Don't have an account? <a href="/customer/register">Register</a></div>
                    </div>
                </Col>
            </Row>
        </Container>
        </>
    );
}

export default Customer_login;
