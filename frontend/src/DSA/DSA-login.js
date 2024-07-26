import React, { useState } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import './DSA-login.css';
import { useNavigate } from 'react-router-dom';

function DSA_Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState("success"); // "success" or "error"

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send a GET request to your backend for authentication
            const response = await axios.get("https://localhost:8000/api/dsa-login", { 
                params: formData 
            });
            const { dsaId } = response.data;

            if (response.data.success) {
                setModalMessage("Login is successful!");
                setModalType("success");
                setShowModal(true);

                // Store login session
                await axios.post('https://localhost:8000/dsa/login/session', {
                    dsaId: dsaId,
                    loginDateTime: new Date()
                });

                setTimeout(() => {
                    setShowModal(false);
                    navigate('/dsa/dashboard', { state: { dsaId } }); 
                }, 2000); // Hide the modal after 2000ms (2 seconds)
            } else {
                setModalMessage(response.data.message);
                setModalType("error");
                setShowModal(true);

                setTimeout(() => {
                    setShowModal(false);
                }, 2000); // Hide the modal after 2000ms (2 seconds)
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setModalMessage('An error occurred during login');
            setModalType("error");
            setShowModal(true);

            setTimeout(() => {
                setShowModal(false);
            }, 2000); // Hide the modal after 2000ms (2 seconds)
        }
    };

    return (
        <>
        <Container fluid className="Customer-login-container">
            <Row className="Customer-login-row">
                <Col xl={3} lg={4} md={5} xs={11} className="dsa-loan">
                </Col>
                <Col className="dsa-login-div" xl={3} lg={4} md={5} xs={11}>
                    <div>
                        <p style={{ color: 'white', fontSize: '20px', fontWeight: '500', padding: "10px" }}>DSA Login</p>
                        <form onSubmit={handleSubmit}>
                            <div className="Customer-login-div">
                                <input
                                    type="text"
                                    className="text-black"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="password-input-container">
                                <input
                                    type="password"
                                    className="text-black"
                                    placeholder="Password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <Button type="submit" className="Customer-login-button">Login</Button>
                        </form>
                        <div className="login-forget-password"><a href="/dsa/forget/password" style={{color:'black'}}>Forget Password?</a></div>
                        <div style={{ textAlign: 'start' ,color:'black'}}>Don't have an account? <a href="/dsa/register" style={{color:'white'}}>Register</a></div>
                    </div>
                </Col>
            </Row>
        </Container>
        <Modal show={showModal} onHide={() => setShowModal(false)} >
            <Modal.Body style={{ color: modalType === "success" ? "green" : "red" }}>
                {modalMessage}
            </Modal.Body>
        </Modal>
        </>
    );
}

export default DSA_Login;
