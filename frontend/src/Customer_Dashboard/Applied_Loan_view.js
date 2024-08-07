


import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form, Button, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import './Applied_loan_view.css';
import PathnameUrlPath from "../URL_Path/Url_Path";
import { MdStar } from "react-icons/md";
import { BiSolidContact } from "react-icons/bi";
import { MdEmail } from "react-icons/md";
import { FaPeopleArrows, FaRegAddressCard } from "react-icons/fa6";
import Applied_Loan_Customer from "./Applied_loan_Customer";
import { MdFeedback } from "react-icons/md";

function Applied_Loan_View() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId, customerId } = location.state || {};
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const [LoanDetails, setLoanDetails] = useState([]);
    const [feedbackDetails, setFeedbackDetails] = useState([]);
    const { isSidebarExpanded } = useSidebar();
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
    const [addressDetails, setAddressDetails] = useState({
        permanentState: '',
        permanentDistrict: '',
        permanentArea: ''
    });
    const [feedbackData, setFeedbackData] = useState({
        rating: '',
        textFeedback: '',
        serviceQuality: ''
    });

    const homepage = () => {
        navigate('/customer-dashboard', { state: { customerId } });
    };

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
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

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/${dsaId}/loanDetails`);
                if (response.status === 200) {
                    setLoanDetails(response.data.loanDetails);
                }
            } catch (error) {
                console.error('Error fetching loan details:', error);
            }
        };

        if (dsaId) {
            fetchLoanDetails();
        }
    }, [dsaId]);

    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsaId}`);
                const fetchedAddress = response.data;

                if (fetchedAddress) {
                    setAddressDetails({
                        permanentState: fetchedAddress.permanentAddress.state || '',
                        permanentDistrict: fetchedAddress.permanentAddress.district || '',
                        permanentArea: fetchedAddress.permanentAddress.area || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
            }
        };

        if (dsaId) {
            fetchAddressDetails();
        }
    }, [dsaId]);

    const fetchDownloadTableCount = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa/download/count?dsaId=${dsaId}`);
            setDownloadTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching download table count:', error.message);
        }
    };

    const fetchTableCount = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa/table/count?dsaId=${dsaId}`);
            setTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching table count:', error.message);
        }
    };

    useEffect(() => {
        if (dsaId) {
            fetchDownloadTableCount();
            fetchTableCount();
        }
    }, [dsaId]);

    const handleFeedbackChange = (e) => {
        const { name, value } = e.target;
        setFeedbackData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleFeedbackSubmit = async () => {
        try {
            const feedback = {
                customerId,
                dsaId,
                rating: feedbackData.rating,
                textFeedback: feedbackData.textFeedback,
                serviceQuality: feedbackData.serviceQuality,
                date: new Date().toISOString()
            };

            await axios.post('https://uksinfotechsolution.in:8000/loan/api/feedback', feedback);
            alert("Feedback submitted successfully!");
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert("Failed to submit feedback");
        }
    };

    const fetchFeedbackDetails = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/loan/api/feedback/${dsaId}`);
            if (response.status === 200) {
                setFeedbackDetails(response.data.feedbacks);
            }
        } catch (error) {
            console.error('Error fetching feedback details:', error);
        }
    };

    useEffect(() => {
        if (dsaId) {
            fetchFeedbackDetails();
        }
    }, [dsaId]);

    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <PathnameUrlPath location={location} homepage={homepage} />
                <Row className="apply-loan-view-header-row">
                    <Col className="apply-loan-view-header-col">
                        <Applied_Loan_Customer />
                        <hr />
                        <Row>
                            <Col>
                                <Row className="apply-loan-view-row">
                                    <Col>
                                        <div className="apply-loan-cname">{formData.dsaCompanyName}
                                            <span className="apply-loan-name">
                                                <span style={{ paddingLeft: '10px', color: 'green' }}>
                                                    {formData.dsa_status}
                                                </span>
                                            </span>
                                        </div>
                                        <div className="apply-loan-name">{formData.dsaName}
                                            <span>
                                                <MdStar style={{ marginLeft: '2px', marginRight: '2px', marginTop: '-1px' }} size={15} color={'#ffd700'} />
                                            </span>
                                            <span className="loan-rating">{feedbackDetails.length > 0 ? feedbackDetails[0].rating : ''} </span>
                                            <span className="loan-rating" style={{ fontWeight: '400', fontSize: '11px', marginLeft: '3px', marginRight: '3px' }}>|</span>
                                            <span className="loan-rating">{tableCount} Views</span>
                                            <span className="loan-rating" style={{ fontWeight: '400', fontSize: '11px', marginLeft: '3px', marginRight: '3px' }}>|</span>
                                            <span className="loan-rating">{downloadTableCount} Downloads</span>
                                        </div>
                                    </Col>
                                </Row>
{/* 
                                <div className="loan-contact">
                                    <Row>
                                        <Col>
                                            <div className="loan-amount">
                                                <span className="loan-days">
                                                    <BiSolidContact size={18} style={{ color: 'blue' }} className="loan-icon" />
                                                    Contact:
                                                    <span className="loan-rating"> {formData.primaryNumber} </span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <div className="loan-amount">
                                                <span className="loan-days">
                                                    <MdEmail color="orange" size={18} className="loan-icon" />
                                                    E-Mail:
                                                    <span className="loan-rating"> {formData.email}</span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div> */}

                                {/* <div className="loan-days">
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <FaRegAddressCard color="brown" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                            Address:
                                            <span className="loan-rating" style={{ paddingLeft: '5px' }}>
                                                {addressDetails.permanentState}
                                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>,</span>
                                                {addressDetails.permanentDistrict}
                                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>,</span>
                                                {addressDetails.permanentArea}
                                            </span>
                                        </Col>
                                    </Row>
                                </div> */}

                                <div className="loan-days">
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <FaPeopleArrows color="green" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                            Website:
                                            <span className="loan-rating" style={{ paddingLeft: '5px' }}>{formData.website}</span>
                                        </Col>
                                    </Row>
                                </div>
                                <div style={{ paddingTop: '20px' }}>
                                    <Row style={{ paddingTop: '10px' }}>
                                        <Col>
                                            <div className="loan-amount">
                                                <span className="loan-days">
                                                    <FaPeopleArrows color="pink" style={{ marginTop: '-5px' }} size={16} className="loan-icon" />
                                                    <span className="loan-provide">
                                                        Loans Provide:
                                                    </span>
                                                    <span className="loan-rating" style={{ paddingLeft: '5px' }}>
                                                        {LoanDetails.map((loan, index) => (
                                                            <span key={index}>
                                                                {loan.typeOfLoan}
                                                                {index < LoanDetails.length - 1 && " / "}
                                                            </span>
                                                        ))}
                                                    </span>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                            <Col className="loan-feedback" lg={3}>
                                <Form className="feedback-form">
                                    {/* <MdFeedback style={{ marginLeft: '2px', marginRight: '2px', marginTop: '-1px' }} size={17} color={''} /> */}
                                    <h6 >Feedback</h6>
                                    <Form.Group controlId="formRating" className="mb-1">
                                        <Form.Label className="d-inline-block me-2">
                                            <span>Rating (1-5)
                                                <MdStar style={{ marginLeft: '2px', marginRight: '2px', marginTop: '-1px' }} size={15} color={'#ffd700'} />
                                            </span></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="rating"
                                            value={feedbackData.rating}
                                            onChange={handleFeedbackChange}
                                            min="1"
                                            max="5"
                                            className="apply-loan-view-rating-input d-inline-block"
                                            style={{ width: '55px', height: '25px' }}
                                        />
                                        {feedbackData.rating < 1 || feedbackData.rating > 5 ? (
                                            <Form.Text className="text-danger"></Form.Text>
                                        ) : null}
                                    </Form.Group>
                                    <Form.Group controlId="formTextFeedback" className="mb-1">
                                        <Form.Label className=" d-inline-block"></Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="textFeedback"
                                            value={feedbackData.textFeedback}
                                            onChange={handleFeedbackChange}
                                            className=" d-inline-block"
                                            placeholder="Comments"
                                            style={{ height: '55px' }}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formServiceQuality" className="mb-3">
                                        <Form.Label>Service</Form.Label>
                                        <Form.Select
                                            name="serviceQuality"
                                            value={feedbackData.serviceQuality}
                                            onChange={handleFeedbackChange}
                                            className="apply-loan-view-service-quality"
                                        >
                                            <option value="">Select</option>
                                            <option value="Very Good">Very Good</option>
                                            <option value="Good">Good</option>
                                            <option value="Poor">Poor</option>
                                            <option value="Very Poor">Very Poor</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Button style={{ backgroundColor: 'green', border: 'none' }} onClick={handleFeedbackSubmit}>
                                        Submit Feedback
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                        <Row className="" style={{ marginTop: '10px' }}>
                            <h5 style={{ padding: '10px' }}>Another Branch Details</h5>
                            <Col>
                                {branchDetails.length === 0 ? (
                                    <div>Null</div>
                                ) : (
                                    <Table striped bordered hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Branch Name</th>
                                                {/* <th>Branch Location</th> */}
                                                <th>Branch Manager</th>
                                                {/* <th>Contact Number</th> */}
                                                <th>Branch Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {branchDetails
                                                .filter(branch => branch.branchStatus === "Active")
                                                .map((branch, index) => (
                                                    <tr key={index}>
                                                        <td>{branch.branchName}</td>
                                                        {/* <td>{branch.branchAddress}</td> */}
                                                        <td>{branch.branchManager}</td>
                                                        {/* <td>{branch.branchContact}</td> */}
                                                        <td>{branch.branchStatus}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Col>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Applied_Loan_View;
