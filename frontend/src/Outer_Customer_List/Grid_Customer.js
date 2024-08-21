import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { FaRegAddressCard } from "react-icons/fa";
import './Grid_Customer_List.css';
import { FcDebt } from "react-icons/fc";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { SlLocationPin } from "react-icons/sl";
import CustomerFilter from './CustomerFilter'; // Import the filter component

function Grid_Customer_List() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loanRangeCounts, setLoanRangeCounts] = useState({});
    const [addressDetails, setAddressDetails] = useState({});
    const [districts, setDistricts] = useState([]);

    const loanRanges = [
        { label: "0-3 Lakhs", min: 0, max: 300000 },
        { label: "3-6 Lakhs", min: 300000, max: 600000 },
        { label: "6-10 Lakhs", min: 600000, max: 1000000 },
        { label: "10-15 Lakhs", min: 1000000, max: 1500000 },
        { label: "15-25 Lakhs", min: 1500000, max: 2500000 },
        { label: "25-50 Lakhs", min: 2500000, max: 5000000 },
        { label: "50-75 Lakhs", min: 5000000, max: 7500000 },
        { label: "75-100 Lakhs", min: 7500000, max: 10000000 },
        { label: "1-5 Cr", min: 10000000, max: 50000000 },
        { label: "5-15 Cr", min: 50000000, max: 150000000 },
        { label: "15-50 Cr", min: 150000000, max: 5000000000 }
    ];

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customers');
                const customers = response.data;
                setCustomers(customers);
                setFilteredCustomers(customers);
                setLoanRangeCounts(calculateLoanRangeCounts(customers, loanRanges));
 
                // Extract and set unique districts
                const uniqueDistricts = [...new Set(customers.map(c => c.addressDetails?.permanentDistrict).filter(d => d))];
                setDistricts(uniqueDistricts);

                // Fetch address details for each customer
                customers.forEach(customer => {
                    fetchAddressDetails(customer._id);
                });
            } catch (error) {
                console.error('Error fetching customers:', error);
                alert("Failed to fetch customers");
            }
        };

        fetchCustomers();
    }, []);

    const calculateLoanRangeCounts = (customers, ranges) => {
        const counts = {};
        ranges.forEach(range => {
            counts[range.label] = customers.filter(customer => customer.loanRequired >= range.min && customer.loanRequired < range.max).length;
        });

        // Track counts for districts
        customers.forEach(customer => {
            const district = customer.addressDetails?.permanentDistrict;
            if (district) {
                counts[district] = (counts[district] || 0) + 1;
            }
        });

        return counts;
    };

    const handleFilter = (filters) => {
        const { location, selectedRanges, typeOfLoan, selectedDistricts } = filters;
        const filtered = customers.filter(customer => {
            const matchesLocation = location ? customer.addressDetails?.permanentCity?.toLowerCase().includes(location.toLowerCase()) : true;
            const matchesTypeOfLoan = typeOfLoan ? customer.typeofloan.toLowerCase() === typeOfLoan.toLowerCase() : true;
            const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(customer.addressDetails?.permanentDistrict);
            const matchesLoanRange = selectedRanges.length === 0 || selectedRanges.some(range =>
                customer.loanRequired >= range.min && customer.loanRequired < range.max
            );

            return matchesLocation && matchesTypeOfLoan && matchesDistrict && matchesLoanRange;
        });

        setFilteredCustomers(filtered);
    };

    const fetchAddressDetails = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/view-address`, {
                params: { customerId: customerId }
            });
            if (response.data) {
                setAddressDetails(prevDetails => ({
                    ...prevDetails,
                    [customerId]: response.data
                }));
            }
        } catch (error) {
            console.error('Error fetching address details:', error);
        }
    };

    return (
        <Container >
            <Row>
                <Col md={3}>
                    <CustomerFilter 
                        onFilter={handleFilter} 
                        loanRangeCounts={loanRangeCounts} 
                        districts={districts} 
                    />
                </Col>
                <Col md={9}>
                    {filteredCustomers.map(customer => (
                        <Row key={customer._id} className="outerlist-card">
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="outerlist-header">
                                            <div className="outerlist-name">
                                                {customer.title} {customer.customerFname} {customer.customerLname}
                                                <span className="outerlist-customerNo"> (UKS-CUS-0{customer.customerNo})</span>
                                            </div>
                                            <div className="outerlist-details">
                                                {customer.customerType}
                                            </div>
                                            <div className="outerlist-more-link">
                                                <a href="#">More</a>
                                            </div>
                                        </div>
                                        <div className="outerlist-address">
                                            <FaRegAddressCard color="brown" size={16} className="outerlist-icon" />
                                            {customer.typeofloan}
                                            <RiMoneyRupeeCircleLine size={16} className="outerlist-icon" style={{ marginLeft: '5px' }} />
                                            {formatLoanAmount(customer.loanRequired)}/-
                                        </div>
                                        {addressDetails[customer._id] && (
                                            <div className="outerlist-address">
                                                <SlLocationPin size={16} className="outerlist-icon" />
                                                <div className="outerlist-addressText">
                                                    {addressDetails[customer._id].permanentDistrict || '-'}
                                                </div>
                                            </div>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default Grid_Customer_List;

const formatLoanAmount = (amount) => {
    return amount.toLocaleString('en-IN');
}
