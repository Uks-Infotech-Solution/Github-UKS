import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../../URL_Path/Url_Path';
import { MdEmail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";
import { BiSolidContact } from "react-icons/bi";
import { FaGenderless } from "react-icons/fa";
import { GrStatusGoodSmall } from "react-icons/gr";
import { IoPersonSharp } from "react-icons/io5";

const DSA_LoanGridView = () => {
    const [customers, setCustomers] = useState([]);
    const [addresses, setAddresses] = useState({});
    const [customerDetails, setCustomerDetails] = useState({});
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { area, dsaId } = location.state || {};
    const { isSidebarExpanded } = useSidebar();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/'); // Adjust the URL as needed
            const customersData = response.data;
            setCustomers(customersData);
            await fetchAddresses(customersData);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setLoading(false);
        }
    };

    const fetchAddresses = async (customers) => {
        const newAddresses = {};
        for (let customer of customers) {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/view-address', {
                    params: { customerId: customer._id },
                });
                if (response.status === 200) {
                    newAddresses[customer._id] = response.data;
                }
            } catch (error) {
                console.error(`Failed to fetch address for ${customer._id}:`, error);
            }
        }
        setAddresses(newAddresses);
        fetchCustomerDetails(customers);
    };

    const fetchCustomerDetails = async (customers) => {
        const newCustomerDetails = {};
        for (let customer of customers) {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId: customer._id },
                });
                if (response.status === 200) {
                    newCustomerDetails[customer._id] = response.data;
                }
            } catch (error) {
                console.error(`Failed to fetch details for ${customer._id}:`, error);
            }
        }
        setCustomerDetails(newCustomerDetails);
        setLoading(false);
    };

    useEffect(() => {
        if (Object.keys(addresses).length > 0 && Object.keys(customerDetails).length > 0) {
            const combinedData = customers.map(customer => ({
                ...customer,
                permanentAddress: addresses[customer._id],
                details: customerDetails[customer._id]
            }));
            const filteredData = combinedData.filter(customer => customer.permanentAddress?.permanentCity === area);
            setFilteredCustomers(filteredData);
        }
    }, [addresses, customerDetails, customers, area]);

    const handleReadMore = (customerId) => {
        navigate('/dsa/customer/download', { state: { dsaId, customerId } });
    };

    if (loading) {
        return <div></div>;
    }

    return (
        <Container fluid className={`grid-view-page-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
            {/* <PathnameUrlPath location={location} homepage={() => navigate('/customer-dashboard')} /> */}
            <hr />
            <h4 style={{ color: 'brown' }} className="mt-4 mb-4">Customers in <span style={{ color: 'brown', textDecoration: 'underline' }}>{area}</span>:</h4>
            <Row style={{ justifyContent: 'center', alignItems: 'center' }}>
                {filteredCustomers.map((customer, index) => (
                    <Col key={index} md={4} className="mb-4">
                        <Card className="loan-card">
                            <Card.Body>
                                <Card.Title>{customer.details?.customerFname || 'Unknown Name'}
                                    <span style={{ fontWeight: '500', fontSize: '13px' }}> (UKS-CUS-00{customer.details?.customerNo || 'Unknown Number'})</span>
                                </Card.Title>
                                
                                    <Card.Text>
                                    <div className="loan-amount">
                                        <span className="loan-days">Status:
                                            {customer.details?.isActive ? (
                                                <>
                                                    <GrStatusGoodSmall color="green" style={{ marginTop: '-5px' }} size={12} className="loan-icon" />
                                                    <span style={{ color: 'green', marginLeft: '0px' }}>Active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <GrStatusGoodSmall color="red" style={{ marginTop: '-5px' }} size={12} className="loan-icon" />
                                                    <span style={{ color: 'red', marginLeft: '0px' }}>Inactive</span>
                                                </>
                                            )}
                                        </span>
                                    </div>
                                    <div className="loan-amount">
                                        <span className="loan-days">
                                            <FaGenderless size={20} style={{ color: 'blue' }} className="loan-icon" />
                                            Gender:
                                            <span className="loan-rating"> {customer.details?.gender || 'Unknown Number'}
                                            </span>
                                        </span>
                                    </div>
                                    
                                    {/* <span>Address: </span>
                                    <span className="loan-rating">
                                        {customer.permanentAddress?.permanentCity || 'Unknown City'},
                                        {customer.permanentAddress?.permanentState || 'Unknown State'}
                                        -{customer.permanentAddress?.permanentZip || 'Unknown Zip Code'}
                                    </span> */}
                                </Card.Text>

                                <Card.Subtitle className="mb-2 text-muted">
                                    <IoPersonSharp  color="orange" size={15} className="loan-icon" />
                                    {customer.details?.customerType || 'Unknown Type'}</Card.Subtitle>
                               
                                <Button variant="link" className="readmore-link" onClick={() => handleReadMore(customer._id)}>
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

export default DSA_LoanGridView;
