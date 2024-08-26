import React, { useState, useEffect } from "react";
import { Col, Container, Row, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import { FaRegAddressCard } from "react-icons/fa6";
import './Grid_Customer_List.css';
import { FcDebt } from "react-icons/fc";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { SlLocationPin } from "react-icons/sl";
import CustomerFilter from './CustomerFilter'; // Import the filter component
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'; // Import pagination icons
import { useNavigate } from 'react-router-dom';

function Grid_Customer_List() {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loanRangeCounts, setLoanRangeCounts] = useState({});
    const [locations, setLocations] = useState([]);
    const [addressDetails, setAddressDetails] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate(); // Initialize useNavigate
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
                const counts = calculateLoanRangeCounts(customers, loanRanges);
                setLoanRangeCounts(counts);

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

    const uniqueLoanTypes = [...new Set(customers.map(customer => customer.typeofloan))];

    const calculateLoanTypeCounts = (customers) => {
        const counts = {};
        customers.forEach(customer => {
            const loanType = customer.typeofloan;
            if (loanType) {
                counts[loanType] = (counts[loanType] || 0) + 1;
            }
        });
        return counts;
    };
    const handleMoreClick = (customerId) => {
        navigate('/customer/view', { state: { customerId } });
    };
    const calculateLoanRangeCounts = (customers, ranges) => {
        const counts = {};
        ranges.forEach(range => {
            counts[range.label] = customers.filter(customer => customer.loanRequired >= range.min && customer.loanRequired < range.max).length;
        });
        return counts;
    };

    const calculateLocationCounts = (customers) => {
        const counts = {};
        customers.forEach(customer => {
            const location = customer.addressDetails?.permanentDistrict;
            if (location) {
                counts[location] = (counts[location] || 0) + 1;
            }
        });
        return counts;
    };

    const handleFilter = (filters) => {
        const { selectedLocations, selectedRanges, typeOfLoan } = filters;

        const filtered = customers.filter(customer => {
            const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(customer.addressDetails?.permanentDistrict);
            const matchesTypeOfLoan = typeOfLoan.length === 0 || typeOfLoan.some((loanType) => customer.typeofloan.toLowerCase() === loanType.toLowerCase());
            const matchesLoanRange = selectedRanges.length === 0 || selectedRanges.some(range =>
                customer.loanRequired >= range.min && customer.loanRequired < range.max
            );

            return matchesLocation && matchesTypeOfLoan && matchesLoanRange;
        });

        setFilteredCustomers(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const fetchAddressDetails = async (customerId) => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/view-address`, {
                params: { customerId }
            });

            if (response.data) {
                setAddressDetails(prevDetails => ({
                    ...prevDetails,
                    [customerId]: response.data
                }));

                setCustomers(prevCustomers => {
                    const updatedCustomers = prevCustomers.map(customer =>
                        customer._id === customerId
                            ? { ...customer, addressDetails: response.data }
                            : customer
                    );

                    const updatedLocations = Array.from(
                        new Set(updatedCustomers
                            .map(customer => customer.addressDetails?.permanentDistrict)
                            .filter(Boolean))
                    );
                    setLocations(updatedLocations);

                    return updatedCustomers;
                });
            }
        } catch (error) {
            console.error('Error fetching address details:', error);
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleRowsPerPageChange = (selectedRowsPerPage) => {
        setRowsPerPage(selectedRowsPerPage);
        setCurrentPage(1); // Reset to first page
    };

    // Pagination calculation
    const indexOfLastCustomer = currentPage * rowsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    return (
        <Container fluid>
            <Row style={{ padding: '10px' }}>
                <Col md={2}>
                    <CustomerFilter
                        onFilter={handleFilter}
                        loanRangeCounts={calculateLoanRangeCounts(customers, loanRanges)}
                        locationCounts={calculateLocationCounts(customers)}
                        locations={locations}
                        customers={customers}
                        loanTypes={uniqueLoanTypes}
                        loanTypeCounts={calculateLoanTypeCounts(customers)}
                    />
                </Col>
                <Col md={5}>
                    {currentCustomers.map(customer => (
                        <Row key={customer._id} className="outerlist-card">
                            <Col>
                                <Row>
                                    <Col>
                                        <div className="outerlist-header">
                                            <div className="outerlist-name">
                                                {customer.title} {customer.customerFname} {customer.customerLname}
                                                <span className="outerlist-customerNo">  (UKS-CUS-0{customer.customerNo})</span>
                                            </div>
                                            <div className="outerlist-details">
                                                {customer.customerType}
                                            </div>
                                            <div className="outerlist-more-link">
                                                <a href="#" onClick={() => handleMoreClick(customer._id)}>More</a>
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
                    <div className="pagination-container">
                        <div className="pagination">
                            <span style={{ marginRight: '10px' }}>Rows per page:  </span>
                            <DropdownButton
                                id="rowsPerPageDropdown"
                                title={`${rowsPerPage}`}
                                onSelect={handleRowsPerPageChange}
                                className='table-row-per-button'
                            >
                                <Dropdown.Item eventKey="5">5</Dropdown.Item>
                                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                                <Dropdown.Item eventKey="15">15</Dropdown.Item>
                                <Dropdown.Item eventKey="20">20</Dropdown.Item>
                            </DropdownButton>
                            <MdKeyboardArrowLeft
                                size={25}
                                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                            />
                            <span>Page {currentPage} of {Math.ceil(filteredCustomers.length / rowsPerPage)}</span>
                            <MdKeyboardArrowRight size={25} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastCustomer >= filteredCustomers.length} />
                        </div>
                    </div>
                    
                </Col>
            </Row>
        </Container>
    );
}

const formatLoanAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default Grid_Customer_List;
