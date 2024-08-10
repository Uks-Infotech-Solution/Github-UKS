import React, { useEffect, useState } from 'react';
import { Container, Row, Card, Col } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../../URL_Path/Url_Path';

function Purchased_Package() {
    const { isSidebarExpanded } = useSidebar();
    const [latestPackage, setLatestPackage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};

    useEffect(() => {
        if (dsaId) {
            fetchLatestPackage(dsaId);
        }
    }, [dsaId]);

    const fetchLatestPackage = async (dsaId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/buy_packages/dsa/${dsaId}`);
            setLatestPackage(response.data); // Assuming the backend returns the latest active package
            // console.log(response.data); 

        } catch (err) {
            console.log(err);
        }
    };

    const homepage = () => {
        navigate('/dsa/dashboard', { state: { dsaId } });
    };

    const calculateExpiryDate = (purchaseDate) => {
        const date = new Date(purchaseDate);
        date.setMonth(date.getMonth() + 1);
        return date;
    };

    const calculateDaysLeft = (purchaseDate) => {
        const currentDate = new Date();
        const timeDifference = latestPackage.expiryDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 ? daysLeft : 0; // Ensure it doesn't return negative days
    };

    return (
        <>
            <div className={`dash-url-expand ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <PathnameUrlPath location={location} homepage={homepage} />
            </div>
            <Container fluid className={`Customer-dash-container Customer-table-container-second ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>

                <div style={{ padding: '20px', width: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    {latestPackage ? (
                        <div key={latestPackage._id} className="" style={{ marginBottom: '20px', width: '100%' }}>
                            <Card style={{
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                borderRadius: '10px',
                                border: 'none',
                                width: '100%',
                                overflow: 'hidden',
                            }}>
                                <Card.Body style={{ padding: '20px', width: '100%', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                    <Row>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Package Name</h5>
                                            <p style={{ color: '#666', fontWeight: '600', fontSize: '15px', margin: '0' }}>{latestPackage.packageName}</p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Amount</h5>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>Rs. {latestPackage.packageAmount}/-</p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Download Access</h5>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>{latestPackage.downloadAccess}</p>
                                        </Col>
                                        
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Purchase Date</h5>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>{new Date(latestPackage.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Activation Date</h5>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>
                                                {latestPackage.expiryDate
                                                    ? new Date(latestPackage.activationDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                    : '-'}
                                            </p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Expiry Date</h5>
                                            <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>
                                                {latestPackage.expiryDate
                                                    ? new Date(latestPackage.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                                                    : '-'}
                                            </p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Days Left</h5>
                                            <p style={{ color: calculateDaysLeft(latestPackage.purchaseDate) < 5 ? 'red' : '#666', fontSize: '12px', margin: '0' }}>
                                                {calculateDaysLeft(latestPackage.purchaseDate)}
                                            </p>
                                        </Col>
                                        <Col style={{ marginBottom: '20px' }}>
                                            <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Status</h5>
                                            <p style={{ color: latestPackage.packageStatus === 'Active' ? 'green' : 'red', fontSize: '14px', margin: '0', fontWeight: '600' }}>{latestPackage.packageStatus}</p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999' }}>Click Packages Menu to Purchase Package</p>
                    )}
                </div>

            </Container >
        </>
    );
}

export default Purchased_Package;
