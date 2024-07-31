import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FiUserCheck } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../DashBoard/DashBoardDesign/Header_Dashboard.css';
import DsaTable from './DSA_Table_view';
import './Customer_Login_Dashboard.css';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import Applied_Loan from './Applied_Loan';

function Last_Div() {
  const { isSidebarExpanded } = useSidebar();
    const [downloadTableCount, setDownloadTableCount] = useState(0);
    const [tableCount, setTableCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);
    useEffect(() => {
        if (customerId) {
            fetchDownloadTableCount(customerId);
            fetchTableCount(customerId);
        }
    }, [customerId]);

    const fetchDownloadTableCount = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/api/customer/applications/count/${customerId}`);
            setDownloadTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching download table count:', error.message);
        }
    };

    const fetchTableCount = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/customer/loan/apply/view/count/${customerId}`);


            setTableCount(response.data.count);
        } catch (error) {
            console.error('Error fetching table count:', error.message);
        }
    };
    useEffect(() => {
        const fetchLoanStatusCounts = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/loan/status/count/customer${customerId}`);
                setApprovedCount(response.data.approvedCount);
                setRejectedCount(response.data.rejectedCount);
            } catch (error) {
                console.error('Error fetching loan status counts:', error);
            }
        };

        if (customerId) {
            fetchLoanStatusCounts();
        }
    }, [customerId]);

    const homepage = () => {
        navigate('/customer');
    };

    return (
       <>                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
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

export default Last_Div;
