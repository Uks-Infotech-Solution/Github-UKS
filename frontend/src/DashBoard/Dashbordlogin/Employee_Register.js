import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Employee_Register.css';
import uksimg from '../cartoon.jpg';

const DashboardUserRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [employeeType, setEmployeeType] = useState(''); // Default selection
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [employeeCode, setEmployeeCode] = useState(''); // State for employee code
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [error, setError] = useState(null);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email is invalid';
        if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
        if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!employeeType) newErrors.employeeType = 'Employee type is required';

        return newErrors;
    };

    useEffect(() => {
        const fetchEmployeeTypes = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/api/employee-type');
                console.log(response.data);
                setEmployeeTypes(response.data);
            } catch (error) {
                setError('Failed to fetch employee types');
                console.error('Error fetching employee types:', error);
            }
        };

        fetchEmployeeTypes();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            try {
                const response = await axios.post('http://148.251.230.14:8000/api/uksregister', {
                    name,
                    email,
                    password,
                    employeeType // Include employeeType in the request payload
                });
                // Assuming response.data.employeeCode contains the generated employee code
                setEmployeeCode(response.data.formattedEmployeeNumber);
                setShowModal(true); // Show modal upon successful registration
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setEmployeeType(''); // Reset employeeType after successful registration
                setErrors({});
            } catch (error) {
                console.error('Error submitting form: ', error);
                // Handle error message display or logging as needed
            }
        }
    };

    return (
        <div>
            <Container fluid className='uksregisterimage'>
                <Row className="uks-reg">
                    <Col lg={4} sm={6} md={4} style={{ backgroundColor: 'white', color: "black", borderRadius: '0.5rem' }}>
                        <h1 className="uks-h1">Employer Registration Form</h1>
                        <Form className="uks-form" onSubmit={submit}>
                            <Form.Group controlId="employeeType">
                                <Form.Label style={{ paddingRight: '30px' }}>Employee Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={employeeType}
                                    onChange={(e) => setEmployeeType(e.target.value)}
                                    isInvalid={!!errors.employeeType}
                                >
                                    <option value="">Select an employee type</option>
                                    {employeeTypes.map((type) => (
                                        <option key={type._id} value={type.type}>{type.type}</option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.employeeType}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    isInvalid={!!errors.email}
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    isInvalid={!!errors.password}
                                />
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    isInvalid={!!errors.confirmPassword}
                                />
                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                Submit
                            </Button>
                            <div className="uks-routing mt-3">Already have an account? <a href="/uks/login">Login</a></div>
                        </Form>
                        <div className='mt-5'></div>
                    </Col>
                    <Col lg={4} sm={6} md={4}>
                        <div>
                            <img src={uksimg} style={{ height: '490px', borderRadius: "0.5rem" }} alt="UKS Image" />
                        </div>
                    </Col>
                </Row>
            </Container>
            {/* Modal for success message and employee code */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Employee Registration Successful</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <h6 style={{ textAlign: 'center' }}>Employee Code: <span style={{ fontSize: '18px' }}>{employeeCode}</span></h6>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setShowModal(false);
                        window.location.href = '/uks/login'; // Redirect to login page
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DashboardUserRegister;
