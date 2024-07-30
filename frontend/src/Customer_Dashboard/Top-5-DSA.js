import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Grid_Loan.css';
import { MdStar } from "react-icons/md";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../URL_Path/Url_Path';

const Top_5_DSA = () => {
    const [dsaDetails, setDsaDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const { customerId } = location.state || {};

    useEffect(() => {
        fetchAllDSAs();
    }, []);

    const fetchAllDSAs = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/list');
            const dsas = response.data.dsa;

            const dsaWithDetailsPromises = dsas.map(async (dsa) => {
                try {
                    const addressResponse = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsa._id}`);
                    const loanResponse = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/${dsa._id}/loanDetails`);
                    const feedbackResponse = await axios.get(`https://uksinfotechsolution.in:8000/loan/api/feedback/${dsa._id}`);

                    const permanentAddress = addressResponse.data?.permanentAddress || null;
                    const loanDetails = loanResponse.data?.loanDetails || [];
                    const feedbackDetails = feedbackResponse.data?.feedbacks || [];

                    if (!permanentAddress || loanDetails.length === 0) {
                        return null;
                    }

                    return {
                        ...dsa,
                        permanentAddress,
                        loanDetails,
                        feedbackDetails,
                    };
                } catch (err) {
                    console.error(`Error fetching details for DSA ${dsa._id}:`, err);
                    return null;
                }
            });

            const dsaWithDetails = await Promise.all(dsaWithDetailsPromises);
            setDsaDetails(dsaWithDetails.filter(dsa => dsa !== null));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching DSA details:', error);
            setLoading(false);
        }
    };

    const handleReadMore = (dsaId) => {
        navigate(`/dsa/detail/view`, { state: { dsaId, customerId } });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <MdStar key={index} color={index < rating ? '#ffd700' : '#e4e5e9'} />
        ));
    };

    const getAverageRating = (feedbacks) => {
        if (feedbacks.length === 0) return 0;

        const totalRating = feedbacks.reduce((total, feedback) => total + feedback.rating, 0);
        return totalRating / feedbacks.length;
    };

    const getTop5DSAs = () => {
        const dsaRatings = dsaDetails
            .map(dsa => ({
                ...dsa,
                averageRating: getAverageRating(dsa.feedbackDetails)
            }));
        return dsaRatings.sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    const top5DSAs = getTop5DSAs();

    // Group DSAs into sets of 1 (assuming 3 is a typo since it's mentioned to show only 1 at a time)
    const groupedDSAs = [];
    for (let i = 0; i < top5DSAs.length; i += 1) {
        groupedDSAs.push(top5DSAs.slice(i, i + 1));
    }

    return (
        <Container>
            <h4 style={{ color: 'green' }} className="mt-4 mb-4">Top 10 Loan Providers</h4>
            <Carousel interval={2000} indicators={true} controls={true} className='top-5-carousel'>
                {groupedDSAs.map((group, index) => (
                    <Carousel.Item key={index}>
                        <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                            {group.map((dsa, idx) => (
                                <Col key={idx} md={4} className="mb-4">
                                    <Card className="loan-card" style={{ transition: '0.3s' }}>
                                        <Card.Body>
                                            <Card.Title>{dsa.dsaCompanyName}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{dsa.dsaName}</Card.Subtitle>
                                            <Card.Text>
                                                <b>Type of Loan:</b> {dsa.loanDetails[0]?.typeOfLoan || 'N/A'}
                                            </Card.Text>
                                            <Card.Text>
                                                <b>Rating:</b> {renderStars(dsa.averageRating)}
                                            </Card.Text>
                                            <Card.Text>
                                                <b>Address:</b>
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
                    </Carousel.Item>
                ))}
            </Carousel>
            <style jsx>{`
                .carousel-control-prev-icon,
                .carousel-control-next-icon {
                    filter: invert(1);
                }
            `}</style>
        </Container>
    );
};

export default Top_5_DSA;
