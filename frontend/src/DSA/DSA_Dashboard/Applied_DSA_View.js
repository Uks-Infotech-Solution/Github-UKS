import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Modal,Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { HiBadgeCheck } from "react-icons/hi";
import { FaCalendarDays } from "react-icons/fa6";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';


function Applied_DSA_View() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId, customerId, loanId } = location.state || {};
    const [appliedLoan, setAppliedLoan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [branchDetails, setBranchDetails] = useState([]);

    const [formData, setFormData] = useState({
        _id: "",
        dsaName: "",
        dsa_status: "",
        dsaCompanyName: "",
        primaryNumber: "",
        alternateNumber: "",
        whatsappNumber: "",
        email: "",
        website: ""
    });
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);
    const { isSidebarExpanded } = useSidebar();

    useEffect(() => {
        const fetchApplyLoanDetails = async () => {
            try {
                console.log("Sending GET request for loanId:", loanId);
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/customer/dsa/loans/${loanId}`);
                if (response.status === 200) {
                    const data = response.data.data;
                    setAppliedLoan(Array.isArray(data) ? data : [data]);
                    setLoading(false);

                }
            } catch (error) {
                console.error('Error fetching loan details:', error);
            }
        };

        if (loanId) {
            fetchApplyLoanDetails();
        }
    }, [loanId]);

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa`, {
                    params: { dsaId }
                });
                const dsaDetails = response.data;
                console.log(response.data);

                if (dsaDetails) {
                    setFormData({
                        _id: dsaDetails._id || "",
                        dsaName: dsaDetails.dsaName || "",
                        dsa_status: dsaDetails.dsa_status || "",
                        dsaCompanyName: dsaDetails.dsaCompanyName || "",
                        primaryNumber: dsaDetails.primaryNumber || "",
                        alternateNumber: dsaDetails.alternateNumber || "",
                        whatsappNumber: dsaDetails.whatsappNumber || "",
                        email: dsaDetails.email || "",
                        website: dsaDetails.website || ""


                    });
                    // Fetch branch details
                    const branchResponse = await axios.get(`https://uksinfotechsolution.in:8000/dsa/BranchDetails/${dsaId}`);
                    setBranchDetails(branchResponse.data.data);
                } else {
                    console.error('No data found for DSA ID:', dsaId);
                    alert("Failed to fetch DSA details");
                }
            } catch (error) {
                console.error('Error fetching DSA details:', error);
                alert("Failed to fetch DSA details");
            }
        };

        if (dsaId) {
            fetchDSADetails();
        }
    }, [dsaId]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toISOString().split('T')[0];
    };

    const calculateDays = (timestamp) => {
        const appliedDate = new Date(timestamp);
        const currentDate = new Date();
        const timeDifference = currentDate - appliedDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference;
    };

    const homepage = () => {
        navigate('/dsa/dashboard', { state: { dsaId } });
    };

    const handleCancelApplication = async (loan) => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/customer/loan/cancel', {
                customerId,
                dsaId,
                loanId
            });

            if (response.data.success) {
                alert("Loan application cancelled successfully");
                navigate('/customer-dashboard', { state: { loanId, dsaId, customerId } }); // Redirect to the dashboard or any other page
            } else {
                alert("Failed to cancel loan application");
            }
        } catch (error) {
            console.error('Error cancelling loan application:', error);
            alert("Failed to cancel loan application");
        }
    };

    const confirmCancelApplication = (loan) => {
        setSelectedLoan(loan);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalConfirm = () => {
        handleCancelApplication(selectedLoan);
        setShowModal(false);
    };

    const handleStatusChange = async (loan) => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/customer/dsa/updateStatus', {
                customerId: loan.customerId,
                dsaId: loan.dsaId,
                loanId: loan._id,
                newStatus,
                dateTime: new Date().toISOString()
            });

            if (response.data.success) {
                alert("Loan status updated successfully");
                setAppliedLoan(appliedLoan.map(loanItem => loanItem.loanId === loan.loanId ? { ...loanItem, applyLoanStatus: newStatus } : loanItem));
            } else {
                alert("Failed to update loan status");
            }
        } catch (error) {
            console.error('Error updating loan status:', error);
            alert("Failed to update loan status");
        }
    };

    return (
        <Container fluid className={`apply-loan-view-container `}>
            <Row>
                <Col>
                    {appliedLoan.map((loan) => (
                        <div key={loan.applicationNumber}>
                            <h5>Customer Application No: <span style={{ paddingLeft: '10px', color: 'green' }}>UKS-00{loan.applicationNumber}</span></h5>
                            <h5 >{loan.dsaCompanyName}</h5>
                            <div className="apply-loan-name">{loan.dsaName} <span className="loan-rating">(UKS-DSA-00{loan.dsaNumber})</span></div>
                        </div>
                    ))}
                </Col>
                <Col>
                    {appliedLoan.map((loan) => (
                        <div key={loan.applicationNumber}>
                            <div style={{ justifyContent: 'end', textAlign: 'end' }}>
                                <HiBadgeCheck size={16} className="loan-icon" color="green" />
                                Loan Status :
                                <span className="loan-rating"> {loan.applyLoanStatus}</span>
                                <FaCalendarDays size={16} color="brown" className="loan-icon" />
                                Applied Date :
                                <span className="loan-rating"> {formatDate(loan.timestamp)} </span>
                            </div>
                            <div style={{ justifyContent: 'end', textAlign: 'end', margin: '5px' }}>
                                <span className="loan-rating" style={{ margin: '3px' }}>
                                    Update Loan Status :

                                </span>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    style={{
                                        borderColor: 'grey',
                                        border: 'none',
                                        backgroundColor: 'lightgrey',
                                        borderRadius: '0.3rem',
                                        padding: '4px',  // Adjust padding as needed
                                        fontSize: '14px',  // Adjust font size as needed
                                        width: '150px',  // Make the select element full width
                                    }}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Waiting List">Waiting List</option>
                                    <option value="Cibil Process">Cibil Process</option>
                                    <option value="Success">Success</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>

                                <div>
                                    <Button style={{ margin: '10px' }} variant="primary" onClick={() => handleStatusChange(loan)}>Submit</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Col>
            </Row>
            <Row className="" >
                <h5 style={{ padding: '10px' }}>Another Branch Details</h5>
                <Col>
                    {branchDetails.length === 0 ? (
                        <div>Null</div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Branch Name</th>
                                    <th>Branch Location</th>
                                    <th>Branch Manager</th>
                                    <th>Contact Number</th>
                                    <th>Branch Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {branchDetails
                                    .filter(branch => branch.branchStatus === "Active")
                                    .map((branch, index) => (
                                        <tr key={index}>
                                            <td>{branch.branchName}</td>
                                            <td>{branch.branchAddress}</td>
                                            <td>{branch.branchManager}</td>
                                            <td>{branch.branchContact}</td>
                                            <td>{branch.branchStatus}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    )}
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Cancellation</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to cancel your application?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleModalConfirm}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Applied_DSA_View;
