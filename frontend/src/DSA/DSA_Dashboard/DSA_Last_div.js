import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function DSA_Last_Div() {
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};
    const [loanApplications, setLoanApplications] = useState([]);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    
    useEffect(() => {
        const fetchLoanApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/dsa/applications/count/${dsaId}`);
                setDownloadTableCount(response.data.count);
            } catch (error) {
                console.error('Error fetching loan application count:', error);
            }
        };

        if (dsaId) {
            fetchLoanApplications();
        }
    }, [dsaId]);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dsa/customer/apply/view/count/${dsaId}`);
                setTableCount(response.data.count);
                console.log(response.data.count);
            } catch (error) {
                console.error('Error fetching apply view count:', error);
            }
        };

        if (dsaId) {
            fetchCount();
        }
    }, [dsaId]);
    useEffect(() => {
        const fetchLoanStatusCounts = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/dsa/loan/status/count/${dsaId}`);
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
    return (
        <>
            <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                <div className='count-box Customer-table-container-second'>
                    <div className=''>
                        <p>Total Loan Applied</p>
                        <h3>{downloadTableCount}</h3>
                    </div>
                </div>
            </Col>
            <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                <div className='count-box Customer-table-container-second'>
                    <div className=''>
                        <p>Applied Count View</p>
                        <h3>{tableCount}</h3>
                    </div>
                </div>
            </Col>
            <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                <div className='count-box Customer-table-container-second'>
                    <div className=''>
                        <p>Applied Loan Approved</p>
                        <h3>{approvedCount}</h3>
                    </div>
                </div>
            </Col>
            <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                <div className='count-box Customer-table-container-second'>
                    <div className=''>
                        <p>Applied Loan Reject</p>
                        <h3>{rejectedCount}</h3>
                    </div>
                </div>
            </Col>
        </>
    );
}

export default DSA_Last_Div;
