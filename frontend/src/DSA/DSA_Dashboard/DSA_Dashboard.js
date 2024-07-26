import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { PiCircleFill } from "react-icons/pi";
import PathnameUrlPath from '../../URL_Path/Url_Path';
import DSA_VerticalBoxes from './DSA_Vertical_Box';
import Customer_List from './Customer_List';
import Applied_Customer_List from './Applied_Customers_List';
import DSA_Last_Div from './DSA_Last_div';
import First_Div from './First_Div_';

function DSA_Login_Dashboard() {
    const { isSidebarExpanded } = useSidebar();
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const [lastLoginDateTime, setLastLoginDateTime] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};
    const [DSADetails, setDSADetails] = useState(null);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    const [packages, setPackages] = useState([]);

    useEffect(() => {
        if (dsaId) {
            fetchDownloadTableCount(dsaId);
            fetchTableCount(dsaId);
            fetchDSADetails(dsaId);
            fetchLastLoginSession(dsaId);
        }
    }, [dsaId]);

    const fetchDownloadTableCount = async (dsaId) => {
        try {
            const response = await axios.get(`http://148.251.230.14:8000/dsa/download/count`, {
                params: { dsaId: dsaId }
            });
            setDownloadTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching download table count:', error.message);
        }
    };

    const fetchTableCount = async (dsaId) => {
        try {
            const response = await axios.get(`http://148.251.230.14:8000/dsa/table/count`, {
                params: { dsaId: dsaId }
            });
            setTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching table count:', error.message);
        }
    };

    const fetchDSADetails = async (dsaId) => {
        try {
            const response = await axios.get('http://148.251.230.14:8000/api/dsa', {
                params: { dsaId: dsaId }
            });
            setDSADetails(response.data);
        } catch (error) {
            console.error('Error fetching DSA details:', error.message);
        }
    };
    useEffect(() => {
        const fetchLoanStatusCounts = async () => {
            try {
                const response = await axios.get(`http://148.251.230.14:8000/api/dsa/loan/status/count/${dsaId}`);
                setApprovedCount(response.data.approvedCount);
                setRejectedCount(response.data.rejectedCount);
            } catch (error) {
                console.error('Error fetching loan status counts:', error);
            }
        };

        if (dsaId) {
            fetchLoanStatusCounts();
        }
    }, [dsaId]);
    const fetchLastLoginSession = async (dsaId) => {
        try {
            const response = await axios.get('http://148.251.230.14:8000/dsa/login/last-session', {
                params: { dsaId: dsaId }
            });
            setLastLoginDateTime(response.data.loginDateTime);
            console.log(response.data.loginDateTime);
        } catch (error) {
            console.error('Error fetching last login session:', error.message);
        }
    };

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get(`http://148.251.230.14:8000/buy_packages/dsa/${dsaId}`);
                setPackages(response.data);
                console.log(response.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPackages();
    }, [dsaId]);

    const homepage = () => {
        navigate('/dsa/dashboard');
    };
    const calculateExpiryDate = (purchaseDate) => {
        const date = new Date(purchaseDate);
        date.setMonth(date.getMonth() + 1);
        return date;
    };
    const calculateDaysLeft = (purchaseDate) => {
        const expiryDate = calculateExpiryDate(purchaseDate);
        const currentDate = new Date();
        const timeDifference = expiryDate - currentDate;
        const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        return daysLeft >= 0 ? daysLeft : 0; // Ensure it doesn't return negative days
    };
    return (
        <>
            <div className={`dash-url-expand ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <PathnameUrlPath location={location} homepage={homepage} />
            </div>
            <Container fluid className={`Customer-dash-container Customer-table-container-second ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>

                <DSA_VerticalBoxes />
                <div >
                    <Row className='' style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0px' }}>
                        <div className='Customer-dashboard-head'>
                            <h3>DSA Dashboard</h3>
                        </div>
                        <hr />

                        <div style={{ padding: '20px' }}>
                            {packages.length > 0 ? (
                                packages.map((pkg) => (
                                    <div key={pkg._id} className="package-card" style={{ marginBottom: '20px' }}>

                                        <Card style={{
                                            height: '',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            borderRadius: '10px',
                                            border: 'none',
                                            overflow: 'hidden',
                                        }}>
                                            <Card.Body style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                                                <h6 style={{ textAlign: 'left', marginBottom: '20px', color: '#4A90E2', fontSize: '15px', fontWeight: '600' }}>Purchased Package Details</h6>

                                                <Row>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Package Name</h5>
                                                        <p style={{ color: '#666',fontWeight:'600', fontSize: '15px', margin: '0' }}>{pkg.packageName}</p>
                                                    </Col>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Amount</h5>
                                                        <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>Rs. {pkg.packageAmount}/-</p>
                                                    </Col>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Download Access</h5>
                                                        <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>{pkg.downloadAccess}</p>
                                                    </Col>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Status</h5>
                                                        <p style={{ color: pkg.packageStatus === 'Active' ? 'green' : 'red', fontSize: '14px', margin: '0',fontWeight:'600' }}>{pkg.packageStatus}</p>
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col>
                                                    </Col>
                                                   
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Purchase Date</h5>
                                                        <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>{new Date(pkg.purchaseDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                                    </Col>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Expiry Date</h5>
                                                        <p style={{ color: '#666', fontSize: '12px', margin: '0' }}>{new Date(calculateExpiryDate(pkg.purchaseDate)).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                                    </Col>
                                                    <Col xs={6} md={3} style={{ marginBottom: '20px' }}>
                                                        <h5 style={{ color: '#333', fontSize: '13px', fontWeight: '600' }}>Days Left</h5>
                                                        <p style={{ color: calculateDaysLeft(pkg.purchaseDate) < 5 ? 'red' : '#666', fontSize: '12px', margin: '0' }}>
                                                            {calculateDaysLeft(pkg.purchaseDate)}
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#999' }}>Click Pricing Menu to Purchase Package</p>
                            )}
                        </div>
                        <Col lg={3} xs={12} sm={6} md={3} className='mt-2' >
                            <div className='count-box Customer-table-container-second'>
                                <div>
                                    <p>Customer Download Count</p>
                                    <h3>{downloadTableCount}</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                            <div className='count-box Customer-table-container-second'>
                                <div>
                                    <p>Customer View Count</p>
                                    <h3>{tableCount}</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                            <div className='count-box Customer-table-container-second'>
                                <div>
                                    <p>Customer Rejection Count</p>
                                    <h3>{rejectedCount}</h3>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                            <div className='count-box cus-code Customer-table-container-second' style={{ color: '#145693', padding: '5px' }}>
                                <div>
                                    {DSADetails ? (
                                        <>
                                            <p><span style={{ fontWeight: '500' }}>Code: </span>UKS-DSA-0{DSADetails.dsaNumber}</p>
                                            <p><span style={{ fontWeight: '500' }}>Status: </span>
                                                <span style={{ color: DSADetails.dsa_status ? 'green' : 'red', fontWeight: '700', backgroundColor: '' }}>
                                                    <PiCircleFill size={10} style={{ marginRight: '1px' }} />
                                                    {DSADetails.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                            {lastLoginDateTime && (
                                                <p>
                                                    <span style={{ fontWeight: '500' }}>Last Login: </span>
                                                    <span style={{ fontSize: '13px' }}>
                                                        {new Date(lastLoginDateTime).toLocaleDateString()}-
                                                        {new Date(lastLoginDateTime).toLocaleTimeString('en-US', { hour12: false })}
                                                    </span>
                                                </p>
                                            )}

                                        </>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </div>
                            </div>
                        </Col>
                        <First_Div />
                        <DSA_Last_Div />
                    </Row>
                </div>
            </Container>
        </>
    );
}

export default DSA_Login_Dashboard;
