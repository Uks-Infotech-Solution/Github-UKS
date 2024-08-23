import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import Select from 'react-select';

function UKS_Apply_Loan_Customer() {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};
    const { uksId } = location.state || {};

    const [customerDetails, setCustomerDetails] = useState(null);
    const [formData, setFormData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [dsaData, setDsaData] = useState([]);
    const [selectedDsas, setSelectedDsas] = useState([]);
    const { isSidebarExpanded } = useSidebar();
    const [selectedDSAs, setSelectedDSAs] = useState([]);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId }
                });
                setCustomerDetails(response.data);
                setFormData(response.data); // Initialize formData with fetched data
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        };

        fetchCustomerDetails();
    }, [customerId]);

    const handleApplyLoanClick = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/list');
            setDsaData(response.data.dsa);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching DSAs:', error);
        }
    };

    const handleModalClose = () => setShowModal(false);

    const handleConfirmClick = () => {
        // Prepare the data to be sent to the new route
        const dsaDataToSend = selectedDsas.map(dsa => ({
            id: dsa.id,
            name: dsa.dsaName,
            dsaCompanyName:dsa.dsaCompanyName,
            dsaNumber:dsa.dsaNumber
            // Include any other relevant data about the DSAs
        }));
    
        // Navigate to the new route with the selected DSAs
        navigate('/uks/customer/apply/loan/popup', { state: { selectedDSAs: dsaDataToSend,uksId, customerId } });
    
        // Close the modal
        setShowModal(false);
    };
    

    const handleCheckboxChange = (e, dsa) => {
        if (e.target.checked) {
            setSelectedDsas([...selectedDsas, dsa]);
        } else {
            setSelectedDsas(selectedDsas.filter(selectedDsa => selectedDsa.id !== dsa.id));
        }
    };

    if (!customerDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <Row className="Section-1-Row">
                    <Col className="New-Customer-container-second basic-view-col">
                        <Row>
                            <Col lg={8}>
                                <span className="basic-view-head" style={{ marginTop: '50px' }}>Apply Loan</span>
                                {formData.isActive === 'false' ? (
                                    <span style={{ margin: '5px', color: 'red', fontWeight: "500" }}><GoDotFill /> InActive</span>
                                ) : (
                                    <span style={{ margin: '5px', color: 'green', fontWeight: "500" }}><GoDotFill /> Active</span>
                                )}
                            </Col>
                            <hr style={{ margin: "5px", width: "98%" }} />
                        </Row>

                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence">Customer Type</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerFname"
                                    value={formData.customerType || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">First Name</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerFname"
                                    value={formData.customerFname || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Last Name</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerLname"
                                    value={formData.customerLname || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence">Gender</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="gender"
                                    value={formData.gender || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Mobile Number</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customercontact"
                                    value={formData.customercontact || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Email</span></Col>
                            <Col>
                                <input
                                    type="email"
                                    className="box"
                                    name="customermailid"
                                    value={formData.customermailid || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence" style={{ color: 'black' }}>Type of Loan</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="typeofloan"
                                    value={formData.typeofloan || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Loan Required</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="loanRequired"
                                    value={formData.loanRequired || ''}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Button onClick={handleApplyLoanClick}>Confirm to Apply Loan</Button>
                    </Col>
                </Row>
            </Container>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select DSAs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {dsaData.length === 0 ? (
                        <p>Loading DSAs...</p>
                    ) : (
                        dsaData.map(dsa => (
                            <div key={dsa.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <input
                                    type="checkbox"
                                    id={`dsa-${dsa.id}`}
                                    onChange={(e) => handleCheckboxChange(e, dsa)}
                                    style={{ marginRight: '8px' }}
                                />
                                <label htmlFor={`dsa-${dsa.id}`}>
                                    {dsa.dsaName}
                                </label>
                            </div>
                        ))
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleConfirmClick}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default UKS_Apply_Loan_Customer;
