import React, { useState, useEffect } from "react";
import { Col, Container, Row, Card, Table } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import './DSA_Detail_view.css';
import DSA_Loan_Customer from "./DSA_Loan_Customer";
import { MdHome } from 'react-icons/md';
import PathnameUrlPath from "../URL_Path/Url_Path";
import { MdStar } from "react-icons/md";

function DSA_Detail_View() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};
    const { customerId } = location.state || {};
    const [branchDetails, setBranchDetails] = useState([]);

    const homepage = () => {
        navigate('/customer-dashboard', { state: { dsaId, customerId } });
    };

    const [formData, setFormData] = useState({
        _id: "",
        dsaName: "",
        dsa_status: "",
        dsaCompanyName: "",
        primaryNumber: "",
        alternateNumber: "",
        whatsappNumber: "",
        email: "",
        website: "",
        permanentAddress: {
            area: "",
            city: "",
            district: "",
            state: ""
        }
    });

    const [feedbacks, setFeedbacks] = useState([]);
    const [feedbacksLoaded, setFeedbacksLoaded] = useState(false);

    const { isSidebarExpanded } = useSidebar();

    useEffect(() => {
        const fetchDSADetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
                const dsaDetails = response.data;
                // console.log('Fetched DSA Details:', dsaDetails);
                // Fetch branch details
                const branchResponse = await axios.get(`https://uksinfotechsolution.in:8000/dsa/BranchDetails/${dsaId}`);
                setBranchDetails(branchResponse.data.data);
                if (dsaDetails) {
                    const addressResponse = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsaDetails._id}`);
                    const permanentAddress = addressResponse.data.permanentAddress;

                    setFormData({
                        _id: dsaDetails._id || "",
                        dsaName: dsaDetails.dsaName || "",
                        dsa_status: dsaDetails.dsa_status || "",
                        dsaCompanyName: dsaDetails.dsaCompanyName || "",
                        primaryNumber: dsaDetails.primaryNumber || "",
                        alternateNumber: dsaDetails.alternateNumber || "",
                        whatsappNumber: dsaDetails.whatsappNumber || "",
                        email: dsaDetails.email || "",
                        website: dsaDetails.website || "",
                        permanentAddress: permanentAddress || {}
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

        const fetchFeedbacks = async () => {
            try {
                const feedbackResponse = await axios.get(`https://uksinfotechsolution.in:8000/loan/api/feedback/${dsaId}`);
                const { feedbacks } = feedbackResponse.data;
                setFeedbacks(feedbacks || []);
                setFeedbacksLoaded(true);
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
                alert("Failed to fetch feedbacks");
                setFeedbacksLoaded(true); // Mark feedbacks as loaded even on error
            }
        };

        if (dsaId) {
            fetchDSADetails();
            fetchFeedbacks();
        }
    }, [dsaId]);

    return (
        <>
            <Container fluid className={`dsa-detail-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <PathnameUrlPath location={location} homepage={homepage} />
                <Row className="dsa-detail-view-header-row">
                    <Col className="dsa-detail-view-header-col" sm={10} lg={7} style={{ float: 'left' }}>
                        <Row className="dsa-detail-view-header-inner-row">
                            <span className="dsa-detail-view-header">DSA Detail View</span>
                        </Row>
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">DSA CompanyName:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.dsaCompanyName}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">DSA Name:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.dsaName}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        {/* <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Contact Number:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.primaryNumber}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Alternate Number:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.alternateNumber}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Whatsapp Number:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.whatsappNumber}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Email:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.email}
                                    readOnly
                                />
                            </Col>
                        </Row> */}
                        <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Website:</span>
                            </Col>
                            <Col>
                                <input
                                    type="text"
                                    className="dsa-detail-view-input"
                                    value={formData.website}
                                    readOnly
                                />
                            </Col>
                        </Row>
                        {/* <Row className="dsa-detail-view-row">
                            <Col className='dsa-detail-view-label-col' lg={4}>
                                <span className="dsa-detail-view-label">Address:</span>
                            </Col>
                            <Col>
                                <div>
                                    {formData.permanentAddress.area}, {formData.permanentAddress.city}, {formData.permanentAddress.district}, {formData.permanentAddress.state}
                                </div>
                            </Col>
                        </Row> */}

                    </Col>
                    {!feedbacksLoaded ? (
                        <Col sm={10} lg={4}>
                            <div className="feedback-section">
                                <h3>Feedbacks</h3>
                                <p>Null</p>
                            </div>
                        </Col>
                    ) : feedbacks.length > 0 && (
                        <Col sm={10} lg={5}>
                            <div className="feedback-section" >
                                <h3 className="feedback-section-header">Feedbacks</h3>
                                <div className="feedback-list">
                                    <ul>
                                        {feedbacks.map((feedback, index) => (
                                            <li key={index} className="feedback-item">
                                                <div className="feedback-info">
                                                    <Row>

                                                        <div >
                                                            <Col>
                                                                <strong>Rating :
                                                                    {[...Array(feedback.rating)].map((_, i) => (
                                                                        <MdStar key={i} style={{ marginLeft: '2px', marginRight: '2px', marginTop: '-2px' }} size={15} color={'#ffd700'} />
                                                                    ))}</strong>
                                                            </Col>
                                                        </div>
                                                        <Col>
                                                            <strong>Service :</strong> {feedback.serviceQuality}
                                                        </Col>
                                                        <Col lg={5} md={5} sm={6}>
                                                            <strong>Posted :</strong> {new Date(feedback.date).toLocaleDateString('en-GB')}<br />
                                                        </Col>
                                                    </Row>

                                                    <strong>Comments:</strong> {feedback.textFeedback}<br />

                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Col>
                    )}

                </Row>
                <Row className="dsa-detail-view-header-row" style={{ marginTop: '10px' }}>
                    <h5>Another Branch Details</h5>
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
                <DSA_Loan_Customer />
            </Container>
        </>
    );
}

export default DSA_Detail_View;
