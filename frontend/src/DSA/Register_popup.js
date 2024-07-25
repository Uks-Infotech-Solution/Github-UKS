import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import successIcon from './DSA_Images/Success.png'; // Add your success icon image path

function Popup({ show, handleClose, dsaNumber }) {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>DSA Registration</Modal.Title>

            </Modal.Header>
            <Modal.Body className="text-center">
                <img src={successIcon} alt="Success Icon" className="mb-3" style={{ width: '50px', height: '50px' }} />
                <h3>Register.No: UKS-DSA- {dsaNumber}</h3>
                <p>DSA Registration is successful</p>
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