import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import React, { useState,useEffect } from "react";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import './Customer_reg.css';
import { useLocation } from 'react-router-dom';

function Location({ onSuccess,customerId, customerNo }) {
    const navigate = useNavigate();
    const homepage = () => {
        navigate('/customer');
    };
    console.log(customerNo);
    const { isSidebarExpanded } = useSidebar();
    const [salesPersonName, setSalesPersonName] = useState("");
    const [customerDetails, setCustomerDetails] = useState(null);

    const [customerName, setcustomerName] = useState("");
    const location = useLocation();
    const { uksId } = location.state || {};
    console.log(uksId);
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details',{
                    params: { customerId: customerId }
                });
                setCustomerDetails(response.data)
                console.log(customerDetails);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCustomerDetails();
    }, [customerId]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const saveData = async () => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/sales/person/cus/reg', {
                uksId,
                salesPersonName,
                customerName,
                customerId,
            });
            if (response.status === 200) {
                console.log("Data saved successfully");
                setShowSuccessModal(true);
            } else {
                console.error("Error saving data: ", response.status);
            }
        } catch (error) {
            console.error("Error saving data: ", error);
        }
    };

    // Modal function to render success modal
    const renderSuccessModal = () => {
        return (
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="modal-message">Customer Registration Completed.
                    <p>Customer Code {customerDetails.customerNo}</p>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowSuccessModal(false);
                        navigate('/uks/dashboard', { state: { uksId } });
                    }}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <>
            <Container fluid >
                <Row className="mt-3">
                    <Col>
                        <input 
                            type="text" 
                            placeholder="Customer Name" 
                            value={customerName}
                            onChange={(e) => setcustomerName(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <input 
                            type="text" 
                            placeholder="Sales Person Name" 
                            value={salesPersonName}
                            onChange={(e) => setSalesPersonName(e.target.value)}
                        />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Button onClick={saveData}>Save Data</Button>
                    </Col>
                </Row>
            </Container>

            {/* Render the success modal */}
            {renderSuccessModal()}
        </>
    );
}

export default Location;
