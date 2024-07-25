import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import successIcon from '../Images/Success.png'; // Add your success icon image path

function Popup({ show, handleClose, customerNo }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Customer Registration</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={successIcon} alt="Success Icon" className="mb-3" style={{ width: '50px', height: '50px' }} />
                <h3>Customer No: UKS-CU-{customerNo}</h3>
                <p>Check Your Email to Activate Your Account </p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Popup;
