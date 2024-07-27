import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import { MdPeople } from "react-icons/md";
import { FiUserCheck, FiUserX } from "react-icons/fi";
import { FaFileDownload } from "react-icons/fa";
import axios from 'axios';
import '../DashBoardDesign/Header_Dashboard.css'
function HeaderDashboard() {
    const [customerCounts, setCustomerCounts] = useState({ total: 0, active: 0, inactive: 0 });

    useEffect(() => {
        fetchCustomerCounts();
    }, []);

    const fetchCustomerCounts = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/customer/status`);
            const { totalcustomer, activestatus, inactivestatus } = response.data;
            setCustomerCounts({ total: totalcustomer, active: activestatus, inactive: inactivestatus });
        } catch (error) {
            console.error('Error fetching customer counts:', error.message);
        }
    };

    return (
        <Container fluid>
            <Row className='d-flex mt-5' >
                <Col className='overview'>Overview</Col>
                <Col className='header-button'>
                    <DropdownButton id="dropdown-basic-button" className='dropdownbtn' title="Dropdown button">
                        <Dropdown.Item>This Month</Dropdown.Item>
                        <Dropdown.Item>Last Month</Dropdown.Item>
                        <Dropdown.Item>Six Month</Dropdown.Item>
                        <Dropdown.Item>Last Year</Dropdown.Item>
                    </DropdownButton>
                </Col>
            </Row>

            <Row className='h-section-2'>
                <Col xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <MdPeople className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.total}</h1>
                            <p>New Customer</p>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FiUserCheck className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.active}</h1>
                            <p>Active Customer</p>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FiUserX className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{customerCounts.inactive}</h1>
                            <p>Inactive Customer</p>
                        </div>
                    </div>
                </Col>
                <Col xs={12} sm={6} md={3} className='mt-2'>
                    <div className='h-card'>
                        <div className='h-people'>
                            <FaFileDownload className='MdPeople' />
                        </div>
                        <div className='h-amount'>
                            <h1>{/* You can add here the length of the downloaded customer array */}</h1>
                            <p>Customer Download</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default HeaderDashboard;
