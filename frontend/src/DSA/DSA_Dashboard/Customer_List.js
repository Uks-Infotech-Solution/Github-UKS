import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdHome, MdArrowForwardIos, MdEdit } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { SiBitcoinsv } from "react-icons/si";
import { FaFileDownload } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Document, Page, View, Text, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { GrView } from "react-icons/gr";

import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function CustomerTable() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dsaData, setDsaData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [addresses, setAddresses] = useState({});
  const [profilePictures, setProfilePictures] = useState({});
  const [filterOption, setFilterOption] = useState('District');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [customerStatuses, setCustomerStatuses] = useState({});
  const [sortingOrder, setSortingOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filterDropdownRef = useRef(null);
  const [loanProcessingDetails, setLoanProcessingDetails] = useState({});
  const [error, setError] = useState(null);
  const { isSidebarExpanded } = useSidebar();

  const { dsaId } = location.state || {};
  const [packages, setPackages] = useState({});

  // Fetch DSA details
  const fetchDSADetails = async (dsaId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
      setDsaData(response.data);
    } catch (error) {
      console.error('Error fetching DSA details:', error);
    }
  };

  useEffect(() => {
    if (dsaId) {
      fetchDSADetails(dsaId);
    }
  }, [dsaId]);


  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/buy_packages/dsa/${dsaId}`);
        setPackages(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPackages();
  }, [dsaId]);

  // Fetch customers and initialize checked items
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/customers?dsaId=${dsaId}`);
        const customersData = response.data;
        const activeCustomers = customersData.filter(customer => customer.isActive && !customer.block_status);
        setCustomers(activeCustomers);
        // console.log(response.data);
        setLoading(false);
        const initialCheckedItems = {};
        response.data.forEach((customer) => {
          initialCheckedItems[customer._id] = false;
        });
        setCheckedItems(initialCheckedItems);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Fetch addresses for each customer
  useEffect(() => {
    const fetchAddresses = async () => {
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
    };

    if (customers.length > 0) {
      fetchAddresses();
    }
  }, [customers]);

  // Fetch loan processing details
  useEffect(() => {
    const fetchLoanProcessingDetails = async () => {
      const newLoanProcessingDetails = {};
      for (let customer of customers) {
        try {
          const response = await axios.get('https://uksinfotechsolution.in:8000/get-loan-processing', {
            params: { customerId: customer._id },
          });
          if (response.status === 200) {
            newLoanProcessingDetails[customer._id] = response.data;
          }
        } catch (error) {
          console.error(`Error fetching loan processing details for ${customer._id}:`, error);
        }
      }
      setLoanProcessingDetails(newLoanProcessingDetails);
    };

    if (customers.length > 0) {
      fetchLoanProcessingDetails();
    }
  }, [customers]);

  // Handle outside click for filter dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Handle sorting
  const handleSort = () => {
    const newSortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';
    setSortingOrder(newSortingOrder);
    setCustomers([...customers].sort((a, b) => {
      if (a.customerFname < b.customerFname) return newSortingOrder === 'asc' ? -1 : 1;
      if (a.customerFname > b.customerFname) return newSortingOrder === 'asc' ? 1 : -1;
      return 0;
    }));
  };
  // Handle filtering
  const filteredCustomers = customers.filter((customer) => {
    const packageAmount = packages.amount;
    const comparison = packages.comparison;
    const amountUnit = packages.amountUnit;
    const loantypes = packages.loanTypes || [];
    const cibil = packages.cibil;
    const cibilcomparison = packages.cibilcomparison;
    let showCustomer = true;
  
    if (cibilcomparison) {
      if (loanProcessingDetails[customer._id] && loanProcessingDetails[customer._id].cibilRecord) {
        const customerCibil = loanProcessingDetails[customer._id].cibilRecord;
        if (cibilcomparison === 'greater') {
          if(customerCibil){
            showCustomer = showCustomer && customerCibil >= cibil;

          }
        } else if (cibilcomparison === 'less') {
          if(customerCibil){
          showCustomer = showCustomer && customerCibil <= cibil;
          }
          console.log("cibl less");
  
        } 
      }
    }
  
    if (loantypes.length > 0) {
      showCustomer = showCustomer && loantypes.some(loanType => loanType === customer.typeofloan);
    }
  
    if (amountUnit === 'Lakh') {
      if (comparison === 'greater') {
        showCustomer = showCustomer && customer.loanRequired >= packageAmount * 100000;
      } else if (comparison === 'less') {
        showCustomer = showCustomer && customer.loanRequired <= packageAmount * 100000;
      } 
    } else if (amountUnit === 'Crore') {
      if (comparison === 'greater') {
        showCustomer = showCustomer && customer.loanRequired >= packageAmount * 10000000;
      } else if (comparison === 'less') {
        showCustomer = showCustomer && customer.loanRequired <= packageAmount * 10000000;
      } 
    }
  
    if (filterOption === 'District') {
      const customerAddress = addresses[customer._id];
      if(customerAddress){
        showCustomer = showCustomer && customerAddress && customerAddress.aadharDistrict.toLowerCase().includes(filterValue.toLowerCase());

      }
    }
  
    if (filterOption === 'Area') {
      const customerAddress = addresses[customer._id];
      if(customerAddress){
      showCustomer = showCustomer && customerAddress && customerAddress.aadharCity.toLowerCase().includes(filterValue.toLowerCase());
    }}
  
    return showCustomer;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Handle edit button click
  const handleEditClick = async (id) => {
    const selectedCustomer = customers.find((customer) => customer._id === id);
    if (!selectedCustomer) {
      console.error("Selected customer not found");
      return;
    }
    if (!dsaData) {
      console.error("DSA data is not available");
      return;
    }

    try {
      const response = await axios.post('https://uksinfotechsolution.in:8000/dsa-customer/table', {
        dsaId: dsaId,
        customerId: selectedCustomer._id,
      });

      if (response.status === 201 || response.status === 200) {
        // console.log(response.data.message); 
      } else {
        console.error('Failed to store data:', response.statusText);
      }
    } catch (error) {
      console.error('Error storing data:', error.response ? error.response.data : error.message);
    }

    navigate('/dsa/customer/download', { state: { dsaId: dsaData._id, customerId: selectedCustomer._id, } });
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (selectedRowsPerPage) => {
    setRowsPerPage(selectedRowsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setShowFilterDropdown(true);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const formatLoanAmount = (amount) => {
    if (amount >= 10000000) { // 1 Crore or more
      return `${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh or more
      return `${(amount / 100000).toFixed(2)} Lakh`;
    } else if (amount >= 1000) { // 1 Thousand or more
      return `${(amount / 1000).toFixed(2)} K`;
    }
    return amount.toString();
  };

  if (loading) {
    return <div>-</div>;
  }
  return (
    <>
      <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <Row style={{ justifyContent: 'center' }}>
          <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
            <div className='count-box Customer-table-container-second' style={{ height: '170px' }}>
              <div className=''>
                <p>Total Customers Count
                  <span style={{ fontSize: '23px', fontWeight: '600', paddingLeft: '5px' }}>  {filteredCustomers.length}</span></p>
              </div>
            </div>
          </Col>
          <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
            <div className='count-box Customer-table-container-second' style={{ height: '170px' }}>
              <div className=''>
                <p>Total Loan Amount Value
                  <span style={{ fontSize: '23px', fontWeight: '600', paddingLeft: '5px' }}>  {formatLoanAmount(filteredCustomers.reduce((total, customer) => total + customer.loanRequired, 0))}</span></p>
              </div>
            </div>
          </Col>
        </Row>
        <Container className='Customer-table-container-second'>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className='Customer-table-container-second-head'>Customers List</span>
            <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <IoFilterSharp
                size={30}
                style={{ paddingRight: "10px", cursor: 'pointer' }}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              />
              <LiaSortAlphaDownSolid
                size={30}
                style={{ paddingRight: "10px", cursor: 'pointer' }}
                onClick={handleSort}
              />

              {showFilterDropdown && (
                <div ref={filterDropdownRef} className="filter-dropdown" style={{ width: "400px", display: 'flex', alignItems: 'center', right: 0, top: '100%', zIndex: 1, marginRight: "0px" }}>
                  <FormControl
                    type="text"
                    placeholder="Filter value"
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    style={{ marginLeft: "15px", marginRight: "20px" }}
                  />
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={filterOption}
                    onSelect={(eventKey) => handleFilterOptionChange(eventKey)}
                    style={{ marginRight: '10px' }}
                  >
                    <Dropdown.Item eventKey="District" style={{}}>District</Dropdown.Item>
                    <Dropdown.Item eventKey="Area">Area</Dropdown.Item>
                  </DropdownButton>
                </div>
              )}
            </span>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover className='dsa-table-line'>
              <thead>
                <tr>
                  <th className='Customer-Table-head'>SI.No</th>
                  <th className='Customer-Table-head'>Customer No</th>
                  <th className='Customer-Table-head'>Name</th>
                  <th className='Customer-Table-head'>Loan Type</th>
                  <th className='Customer-Table-head'>Loan Amount</th>
                  <th className='Customer-Table-head'>District</th>
                  <th className='Customer-Table-head'>Area</th>
                  <th className='Customer-Table-head'>Cibil Score</th>
                  <th className='Customer-Table-head'>Customer Status</th>
                  <th className='Customer-Table-head'>View</th>
                </tr>
              </thead>
              <tbody>
                {/* Render only the customers for the current page */}
                {filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer).map((customer, index) => (

                  <tr key={customer._id}>

                    <td>{indexOfFirstCustomer + index + 1}</td>
                    <td style={{ width: '100px', fontSize: '12px' }}>
                      {customer.customerNo ? `UKS-CUS-${customer.customerNo.toString().padStart(3, '0')}` : 'N/A'}
                    </td>
                    <td style={{ display: '', paddingTop: '' }}>

                      <span style={{ textAlign: 'center' }}>{customer.customerFname}</span>
                    </td>
                    <td >{customer.typeofloan}</td>
                    <td >{formatLoanAmount(customer.loanRequired)}</td>
                    <td>{addresses[customer._id]?.aadharDistrict ?? '-'}</td>
                    <td>{addresses[customer._id]?.aadharCity ?? '-'}</td>
                      <td>
                        {loanProcessingDetails[customer._id] && loanProcessingDetails[customer._id].cibilRecord ? (
                          loanProcessingDetails[customer._id].cibilRecord
                        ) : (
                          '-'
                        )}
                      </td>
                    <td style={{ color: customer.isActive ? 'green' : 'red' }}>
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </td>


                    <td>
                      <GrView onClick={() => handleEditClick(customer._id)} style={{ cursor: 'pointer', color: '#2492eb' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
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
              <MdKeyboardArrowLeft size={25} onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

              <span>Page {currentPage}  of {Math.ceil(filteredCustomers.length / rowsPerPage)}</span>
              <MdKeyboardArrowRight size={25} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastCustomer >= filteredCustomers.length} />


            </div>
          </div>

        </Container>
      </Container>
    </>
  );
}

export default CustomerTable;
