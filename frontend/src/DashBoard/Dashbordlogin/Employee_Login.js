import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Modal, Row, Col } from 'react-bootstrap';
import ReactDOM from 'react-dom';
import './Employee_Login.css';
import uksimg from '../employe.png';

const DashbordUserLogin = () => {
  const [uksNumber, setUksNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [autoClose, setAutoClose] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:8000/api/ukslogin', {
        email: uksNumber,
        password,
      });

      if (response.status === 200) {
        setMessage({ text: 'Login successful', type: 'success' });
        setShowModal(true);
        setAutoClose(true);
        const { email, name, uksId, employeeType } = response.data;

        // Redirect to the appropriate dashboard based on employeeType
        setTimeout(() => {
          if (employeeType === 'Sales') {
            navigate('/sales/person/dashboard', { state: { email, name, uksId, employeeType } });
          } else {
            navigate('/uks/dashboard', { state: { email, name, uksId, employeeType } });
          }
        }, 2000); // Delay redirection to allow the modal to be seen
      } else {
        setMessage({ text: response.data.error, type: 'error' });
        setShowModal(true);
        setAutoClose(true); // Do not auto-close on error
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
      setShowModal(true);
      setAutoClose(true); // Do not auto-close on error
    }
  };

  useEffect(() => {
    if (showModal && autoClose) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 2000); // Duration for the auto-close
      return () => clearTimeout(timer);
    }
  }, [showModal, autoClose]);

  // Custom Modal with portal to position it correctly
  const CustomModal = () => (
    ReactDOM.createPortal(
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1050,
          maxWidth: '100px',
          width: '60%',
        }}
      >
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          backdrop="static"
          keyboard={false}
          style={{ margin: 0 }}
        >
          <Modal.Body style={{
            textAlign: 'center',
            color: message.type === 'success' ? 'green' : 'red',
            padding: '10px',
            fontSize: '8px',
          }}>
            <h6>{message.text}</h6>
          </Modal.Body>
        </Modal>
      </div>,
      document.body // Ensure the modal is appended to the body
    )
  );

  return (
    <div>
      <Container fluid>
        <Row className="uks-log">
          <Col lg={3} md={4} sm={5}>
            <div className='employe-login-div'>
              <h2 className="text-center">Employer Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicUksNumber" className="mb-3 mt-5">
                  <Form.Label>Employee Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="UKS-EMP"
                    value={uksNumber}
                    onChange={(e) => setUksNumber(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Login
                </Button>
              </Form>
              <div className="login-forget-password"><a href="/uks/forget/password">Forget Password?</a></div>
              <div className="text-center mt-">
                Don't have an account? <Link to="/uks/register">Register</Link>
              </div>
              <div className='mt-5'></div>
            </div>
          </Col>
          <Col lg={3} md={4} sm={5}>
            <div className='employe-login-div'>
              <img src={uksimg} alt="UKS" className="login-uks" />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Render Custom Modal */}
      {showModal && <CustomModal />}
    </div>
  );
};

export default DashbordUserLogin;
