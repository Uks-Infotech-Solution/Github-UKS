import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Grid_Loan.css';
import { MdStar } from "react-icons/md";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../URL_Path/Url_Path';

const LoanGridView = () => {
    const [dsaDetails, setDsaDetails] = useState([]);
    const [loanDetails, setLoanDetails] = useState([]);
    const [feedbackDetails, setFeedbackDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLoanId, setExpandedLoanId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const { area } = location.state || {};
    const { isSidebarExpanded } = useSidebar();

    useEffect(() => {
        if (area) {
            fetchDSADetails(area);
        }
    }, [area]);

    const fetchDSADetails = async (area) => {
        try {
            const response = await axios.get('http://localhost:8000/api/dsa/list');
            const dsas = response.data.dsa;

            const dsaWithAddressPromises = dsas.map(async (dsa) => {
                const addressResponse = await axios.get(`http://localhost:8000/api/dsa/address?dsaId=${dsa._id}`);
                return {
                    ...dsa,
                    permanentAddress: addressResponse.data.permanentAddress
                };
            });

            const dsaWithAddress = await Promise.all(dsaWithAddressPromises);
            const filteredDSAs = dsaWithAddress.filter(dsa => dsa.permanentAddress.area === area);
            setDsaDetails(filteredDSAs);

            // Fetch loan and feedback details for each DSA
            for (const dsa of filteredDSAs) {
                await fetchLoanDetails(dsa._id);
                await fetchFeedbackDetails(dsa._id);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching DSA details:', error);
            setLoading(false);
        }
    };

    const fetchLoanDetails = async (dsaId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/dsa/${dsaId}/loanDetails`);
            if (response.status === 200) {
                setLoanDetails(prevLoanDetails => [
                    ...prevLoanDetails,
                    ...response.data.loanDetails
                ]);
            }
        } catch (error) {
            console.error('Error fetching loan details:', error);
        }
    };

    const fetchFeedbackDetails = async (dsaId) => {
        try {
            const response = await axios.get(`http://localhost:8000/loan/api/feedback/${dsaId}`);
            if (response.status === 200) {
                setFeedbackDetails(prevFeedbackDetails => [
                    ...prevFeedbackDetails,
                    ...response.data.feedbacks
                ]);
            }
        } catch (error) {
            console.error('Error fetching feedback details:', error);
        }
    };

    const handleReadMore = (dsaId) => {
        navigate(`/dsa/detail/view`, { state: { dsaId } });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <MdStar key={index} color={index < rating ? '#ffd700' : '#e4e5e9'} />
        ));
    };

    const getAverageRating = (dsaId) => {
        const dsaFeedbacks = feedbackDetails.filter(feedback => feedback.dsaId === dsaId);
        if (dsaFeedbacks.length === 0) return 0;

        const totalRating = dsaFeedbacks.reduce((total, feedback) => total + feedback.rating, 0);
        return totalRating / dsaFeedbacks.length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className={`grid-view-page-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
            <PathnameUrlPath location={location} homepage={() => navigate('/customer-dashboard')} />
            <hr/>
            <h4 style={{color:'brown'}} className="mt-4 mb-4">Loan Providers in <span style={{color:'brown', textDecoration:'underline'}}>{area}</span>:</h4>
            <Row style={{justifyContent:'center', alignItems:'center'}}>
                {dsaDetails.map((dsa, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card className="loan-card">
                            <Card.Body>
                                <Card.Title>{dsa.dsaCompanyName}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{dsa.dsaName}</Card.Subtitle>
                                <Card.Text>
                                    <b>Type of Loan:</b> {loanDetails.find(loan => loan.dsaId === dsa._id)?.typeOfLoan || 'N/A'}
                                </Card.Text>
                                <Card.Text>
                                    <b>Rating:</b> {renderStars(getAverageRating(dsa._id))}
                                </Card.Text>
                                {expandedLoanId === dsa._id && (
                                    <Card.Text className="loan-extra-details">
                                        {loanDetails.find(loan => loan.dsaId === dsa._id)?.details || 'No additional details available'}
                                    </Card.Text>
                                )}
                                <Card.Text>
                                    <b>Address: </b> 
                                     {dsa.permanentAddress.area}, {dsa.permanentAddress.city}, {dsa.permanentAddress.state}-{dsa.permanentAddress.postalCode}
                                </Card.Text>
                                <Button variant="link" className="readmore-link" onClick={() => handleReadMore(dsa._id)}>
                                    Read more
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default LoanGridView;
