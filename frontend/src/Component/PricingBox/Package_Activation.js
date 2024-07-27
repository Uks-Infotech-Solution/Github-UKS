import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const Package_Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [transferAmountRefNumber, setTransferAmountRefNumber] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalColor, setModalColor] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => setShowModal(false);

  const activateAccount = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.post(`https://uksinfotechsolution.in:8000/package/activate/${token}`, {
=======
      const response = await axios.post(`https://localhost:8000/package/activate/${token}`, {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
        transferAmountRefNumber,
      });

      if (response.status === 200) {
        setModalMessage('Your package has been activated successfully.');
        setModalColor('green');
        setTransferAmountRefNumber('');
        setShowModal(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setModalMessage('Activation failed: ' + response.data.error);
        setModalColor('red');
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error activating account:', error);
      setModalMessage('An error occurred: ' + error.message);
      setModalColor('red');
      setShowModal(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (transferAmountRefNumber) {
      await activateAccount();
    } else {
      setModalMessage('Please enter Transfer Amount Reference Number.');
      setModalColor('red');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 3000);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor:'grey' }}>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Activation Status</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: modalColor }}>
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ maxWidth: '400px', width: '100%', padding: '20px', backgroundColor: '#f7f7f7', border: '1px solid #ddd', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Activate the DSA-Package</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="transferAmountRefNumber" style={{ fontWeight: 'bold' }}>Transfer Amount Reference Number:</label>
            <input
              id="transferAmountRefNumber"
              type="text"
              style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              value={transferAmountRefNumber}
              onChange={(e) => setTransferAmountRefNumber(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '16px', cursor: 'pointer', borderRadius: '4px' }}>Activate Package</button>
        </form>
      </div>
    </div>
  );
};

export default Package_Activate;
