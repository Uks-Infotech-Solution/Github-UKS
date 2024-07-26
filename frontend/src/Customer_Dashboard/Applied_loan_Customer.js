import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Modal } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import './Applied_loan_view.css';
import { MdHome, MdArrowForwardIos, MdEdit } from 'react-icons/md';
import { LiaRupeeSignSolid } from "react-icons/lia";
import { HiBadgeCheck } from "react-icons/hi";
import { DiRequirejs } from "react-icons/di";
import { FaCalendarDays } from "react-icons/fa6";

function Applied_Loan_Customer() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId, customerId, loanId } = location.state || {};
    const { isSidebarExpanded } = useSidebar();
    const [appliedLoan, setAppliedLoan] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchApplyLoanDetails = async () => {
            try {
                console.log("Sending GET request for loanId:", loanId);
                const response = await axios.get(`https://localhost:8000/api/customer/dsa/loans/${loanId}`);
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
                const response = await axios.get(`https://localhost:8000/api/dsa`, {
                    params: { dsaId }
                });
                const dsaDetails = response.data;

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
        navigate('/customer-dashboard');
    };

    const handleCancelApplication = async () => {
        try {
            const response = await axios.post('https://localhost:8000/customer/loan/cancel', {
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

    const confirmCancelApplication = () => {
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalConfirm = () => {
        handleCancelApplication();
        setShowModal(false);
    };

    return (
        <Container fluid className={`apply-loan-view-container `}>
            <Row>
                <Col>
                    {appliedLoan.map((loan) => (
                        <div key={loan.applicationNumber}>
                            <h5>Customer Application No: <span style={{ paddingLeft: '10px', color: 'green' }}>UKS-00{loan.applicationNumber}</span></h5>
                            <div className="apply-loan-name">{loan.customerName} <span className="loan-rating">(UKS-CUS-00{loan.customerNo})</span></div>
                            {/* <div className="loan-rating">{loan.customerMailId}</div> */}
                            <div className="loan-amount">
                                <span className="loan-days">Applied Loan: <span className="loan-rating">{loan.loanType}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Loan Amount: <span className="loan-rating"><LiaRupeeSignSolid size={15} />{loan.loanAmount}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Required Days: <span className="loan-rating">{loan.loanRequiredDays}</span></span>
                            </div>
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
                                {/* <DiRequirejs size={16} color="grey" className="loan-icon" />
                                Counting Days :
                                <span className="loan-rating"> {calculateDays(loan.timestamp)}</span> */}
                            </div>
                            <div style={{ position: 'relative', top: '40px', justifyContent: 'end', textAlign: 'end' }}>
                                {loan.applyLoanStatus === "pending" && (
                                    <a
                                        href=""
                                        style={{ color: '', fontStyle: 'none', textDecoration: 'none' }}
                                        onClick={confirmCancelApplication}
                                    >
                                        Cancel your Application?
                                    </a>
                                )}
                            </div>

                        </div>
                    ))}
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

export default Applied_Loan_Customer;
