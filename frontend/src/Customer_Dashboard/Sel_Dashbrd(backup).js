import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiUserCheck } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../DashBoard/DashBoardDesign/Header_Dashboard.css';
import DsaTable from '../DSA/DSA_Table_view';

function Customer_Login_Dashboard() {
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};

    useEffect(() => {
        if (customerId) {
            fetchDownloadTableCount(customerId);
            fetchTableCount(customerId);
        }
    }, [customerId]);

    const fetchDownloadTableCount = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa-customer/downloadtable/count?customerId=${customerId}`);
            setDownloadTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching download table count:', error.message);
        }
    };

    const fetchTableCount = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa-customer/table/count?customerId=${customerId}`);
            setTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching table count:', error.message);
        }
    };

    const homepage = () => {
        navigate('/customer');
    };

    return (
        <Container fluid>
            <Row className='h-section-2' style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h3>Customer Dashboard</h3>
                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FaFileDownload className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{downloadTableCount}</h1>
                            <p>Profile Download</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FiUserCheck className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{tableCount}</h1>
                            <p>Profile View</p>
                        </div>
                    </div>
                </Col>
            </Row>
            <DsaTable/>
        </Container>
    );
}

export default Customer_Login_Dashboard;
