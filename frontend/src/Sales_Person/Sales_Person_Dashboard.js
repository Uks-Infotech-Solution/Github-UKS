import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

function Sales_Person_dashboard() {
    const [uksIdCount, setUksIdCount] = useState(0);
    const [uksIdcusCount, setUksIdcusCount] = useState(0);
    const [dsaCreatedDates, setDsaCreatedDates] = useState([]);
    const [cusCreatedDates, setCusCreatedDates] = useState([]);
    const [filteredDsaDates, setFilteredDsaDates] = useState([]);
    const [filteredCusDates, setFilteredCusDates] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('This Month');
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId, uksId } = location.state || {};
    const { isSidebarExpanded } = useSidebar();
    const [lastLoginDateTime, setLastLoginDateTime] = useState(null);

    useEffect(() => {
        const fetchUksIdCount = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get(`https://uksinfotechsolution.in:8000/sales/person/dsa/count/${uksId}`);
=======
                const response = await axios.get(`https://localhost:8000/sales/person/dsa/count/${uksId}`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                setUksIdCount(response.data.count);
                setDsaCreatedDates(response.data.createdDates);
            } catch (err) {
                console.error('Error fetching uksId count:', err);
            }
        };

        if (uksId) {
            fetchUksIdCount();
        }
    }, [uksId]);

    useEffect(() => {
        const fetchUksIdDsaCount = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get(`https://uksinfotechsolution.in:8000/sales/person/cus/count/${uksId}`);
=======
                const response = await axios.get(`https://localhost:8000/sales/person/cus/count/${uksId}`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                setUksIdcusCount(response.data.count);
                setCusCreatedDates(response.data.createdDates);
            } catch (err) {
                console.error('Error fetching uksId count:', err);
            }
        };

        if (uksId) {
            fetchUksIdDsaCount();
        }
    }, [uksId]);

    useEffect(() => {
        const filterDates = (dates, filter) => {
            const currentDate = new Date();
            return dates.filter(date => {
                const appDate = new Date(date.createdAt);
                switch (filter) {
                    case 'Today':
                        return (
                            appDate.getDate() === currentDate.getDate() &&
                            appDate.getMonth() === currentDate.getMonth() &&
                            appDate.getFullYear() === currentDate.getFullYear()
                        );
                    case 'Yesterday':
                        const yesterday = new Date(currentDate);
                        yesterday.setDate(yesterday.getDate() - 1);
                        return (
                            appDate.getDate() === yesterday.getDate() &&
                            appDate.getMonth() === yesterday.getMonth() &&
                            appDate.getFullYear() === yesterday.getFullYear()
                        );
                    case 'This Month':
                        return (
                            appDate.getMonth() === currentDate.getMonth() &&
                            appDate.getFullYear() === currentDate.getFullYear()
                        );
                    case 'Previous Month':
                        const previousMonth = new Date(currentDate);
                        previousMonth.setMonth(previousMonth.getMonth() - 1);
                        return (
                            appDate.getMonth() === previousMonth.getMonth() &&
                            appDate.getFullYear() === previousMonth.getFullYear()
                        );
                    default:
                        return true;
                }
            });
        };

        setFilteredDsaDates(filterDates(dsaCreatedDates, selectedFilter));
        setFilteredCusDates(filterDates(cusCreatedDates, selectedFilter));
    }, [dsaCreatedDates, cusCreatedDates, selectedFilter]);

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };
    const fetchLastLoginSession = async (dsaId) => {
        try {
<<<<<<< HEAD
            const response = await axios.get('https://uksinfotechsolution.in:8000/dsa/login/last-session', {
=======
            const response = await axios.get('https://localhost:8000/dsa/login/last-session', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                params: { dsaId: dsaId }
            });
            setLastLoginDateTime(response.data.loginDateTime);
            console.log(response.data.loginDateTime);
        } catch (error) {
            console.error('Error fetching last login session:', error.message);
        }
    };
    return (
        <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`} style={{backgroundColor:''}}>
            <span style={{justifyContent: 'start',textAlign: 'start', paddingLeft: '25px', color: 'blue' }}>
                    <h3>Filter</h3>
                </span>
            <Row style={{ justifyContent: 'end', textAlign: 'end' }}>
                <DropdownButton
                    id="dropdown-basic-button"
                    title={selectedFilter}
                    onSelect={handleFilterChange}
                    className="custom-first-div-dropdown"
                    style={{ marginRight: '10px' }}
                >
                    <Dropdown.Item eventKey="Today">Today</Dropdown.Item>
                    <Dropdown.Item eventKey="Yesterday">Yesterday</Dropdown.Item>
                    <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
                    <Dropdown.Item eventKey="Previous Month">Last Month</Dropdown.Item>
                </DropdownButton>

            </Row>
            <div className='dsa-First-div-container'>

                <Row>
                    <Col lg={4} xs={12} sm={6} md={3} className='mt-2 align-iems-center'>
                        <div className='count-box Customer-table-container-second' style={{ height: '170px' }}>
                            <div>
                                <p>Total DSA
                                    <p style={{ fontSize: '23px', fontWeight: '600', paddingLeft: '5px' }}>  {filteredDsaDates.length}</p></p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
                        <div className='count-box Customer-table-container-second' style={{ height: '170px' }}>
                            <div>
                                <p>Total Customers
                                    <p style={{ fontSize: '23px', fontWeight: '600', paddingLeft: '5px' }}> {filteredCusDates.length}</p></p>
                            </div>
                        </div>
                    </Col>
                    {/* <Col lg={3} xs={12} sm={6} md={3} className='mt-2'>
                            <div className='count-box cus-code Customer-table-container-second' style={{ color: '#145693', padding: '5px' }}>
                                <div>
                                    {DSADetails ? (
                                        <>
                                            <p><span style={{ fontWeight: '600' }}>DSA Code: </span>UKS-DSA-00{DSADetails.dsaNumber}</p>
                                            <p><span style={{ fontWeight: '600' }}>DSA Status: </span>
                                                <span style={{ color: DSADetails.dsa_status ? 'green' : 'red', fontWeight: '700', backgroundColor: '' }}>
                                                    <PiCircleFill size={10} style={{ marginRight: '1px' }} />
                                                    {DSADetails.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </p>
                                            {lastLoginDateTime && (
                                                <p>
                                                    <span style={{ fontWeight: '600' }}>Last Login: </span>
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
                        </Col> */}
                </Row>
            </div>
        </Container>
    );
}

export default Sales_Person_dashboard;
