import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { MdPeople } from "react-icons/md";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';
import '../DashBoard/DashBoardDesign/Header_Dashboard.css'
import CustomerTable from '../Customer/Table/Table';
import { MdHome, MdArrowForwardIos, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import DsaTable from './DSA_Table_view';



function Customer_Dashboard() {
    const [customerCounts, setCustomerCounts] = useState({ total: 0, active: 0, inactive: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomerCounts();
    }, []);

    const fetchCustomerCounts = async () => {
        try {
<<<<<<< HEAD
            const response = await axios.get(`https://uksinfotechsolution.in:8000/customer/status`);
=======
            const response = await axios.get(`https://localhost:8000/customer/status`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
            const { totalcustomer, activestatus, inactivestatus } = response.data;
            setCustomerCounts({ total: totalcustomer, active: activestatus, inactive: inactivestatus });
        } catch (error) {
            console.error('Error fetching customer counts:', error.message);
        }
    };
    const homepage = () => {
        navigate('/customer');
    };
    return (
        <Container fluid>
            {/* <Row className='d-flex mt-5' >
                <Col className='overview'>Overview</Col>
                <Col className='header-button'>
                    <DropdownButton id="dropdown-basic-button" className='dropdownbtn' title="Dropdown button">
                        <Dropdown.Item>This Month</Dropdown.Item>
                        <Dropdown.Item>Last Month</Dropdown.Item>
                        <Dropdown.Item>Six Month</Dropdown.Item>
                        <Dropdown.Item>Last Year</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row> */}
            {/* <div style={{ paddingBottom: '18px' }}>
                <div className='Customer-top-nav-div'>
                    <span className='Customer-top-navi-head'>Customer List</span>
                    |
                    <MdHome size={25} className='Customer-top-nav-home' onClick={homepage} />
                    <MdArrowForwardIos className='Customer-top-nav-arrow' />
                    <span className='Cutomer-top-navi'><a href='/customer' style={{ color: 'rgb(142, 143, 144)', textDecoration: 'none' }}>Pages</a>
                    </span>
                    <MdArrowForwardIos className='Customer-top-nav-arrow' />
                    <span className='Cutomer-top-navi'>Customer List</span>
                </div>
            </div> */}
            <Row className='h-section-2' style={{alignItems:'center', justifyContent:'center', textAlign:'center'}}>
            <h3>DSA DashBoard</h3>

                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <MdPeople className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.total}</h1>
                            <p>All Customers</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FiUserCheck className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.active}</h1>
                            <p>Active Customers</p>
                        </div>
                    </div>
                </Col>
                <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FiUserX className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.inactive}</h1>
                            <p>Inactive Customers</p>
                        </div>
                    </div>
                </Col>
                {/* <Col xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FaFileDownload className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <p>Customer Download</p>
                        </div>
                    </div>
                </Col> */}
            </Row>
        </Container>
    )
}

export default Customer_Dashboard;
