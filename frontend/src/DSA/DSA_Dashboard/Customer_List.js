import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
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

  // Fetch customers and initialize checked items
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/');
        const customersData = response.data;
        setCustomers(customersData);
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



  const fetchProfilePicture = async (customerId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/profile/view-profile-picture?customerId=${customerId}`, {
        responseType: 'arraybuffer'
      });
      const contentType = response.headers['content-type'];

      if (contentType && contentType.startsWith('image')) {
        const base64Image = `data:${contentType};base64,${btoa(
          String.fromCharCode(...new Uint8Array(response.data))
        )}`;
        return base64Image; // Return base64 image data
      } else {
        console.error('Response is not an image');
        return null; // Handle case where response is not an image
      }
    } catch (err) {
      // console.error('Error retrieving profile picture:', err);
      return null; // Handle error case
    }
  };

  useEffect(() => {
    const fetchProfilePictures = async () => {
      const newProfilePictures = {};

      for (let customer of customers) {
        try {
          const base64Image = await fetchProfilePicture(customer._id);
          if (base64Image !== null) {
            newProfilePictures[customer._id] = base64Image;
          } else {
            // Handle case where image fetching failed
            newProfilePictures[customer._id] = null;
          }
        } catch (error) {
          console.error(`Error fetching profile picture for ${customer._id}:`, error);
          newProfilePictures[customer._id] = null; // Set to null on error
        }
      }

      setProfilePictures(newProfilePictures);
    };

    if (customers.length > 0) {
      fetchProfilePictures();
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
    if (filterOption === 'District') {
      const customerAddress = addresses[customer._id];
      return customerAddress && customerAddress.aadharDistrict.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterOption === 'Area') {
      const customerAddress = addresses[customer._id];
      return customerAddress && customerAddress.aadharCity.toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  });

  // Pagination
  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  // Handle checkbox change
  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

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
        dsaId: dsaData._id,
        customerId: selectedCustomer._id,
      });

      if (response.status === 201) {
        console.log(response.data.message); // Data stored successfully
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
  const [allChecked, setAllChecked] = useState(false);

  const handleAllChecked = (event) => {
    const isChecked = event.target.checked;
    const newCheckedItems = {};
    customers.forEach((customer) => {
      newCheckedItems[customer._id] = isChecked;
    });
    setCheckedItems(newCheckedItems);
    setAllChecked(isChecked);
  };
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>-</div>;
  }
  return (
    <>
      <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
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
                      {customer.customerNo ? `UKS-CU-${customer.customerNo.toString().padStart(3, '0')}` : 'N/A'}
                    </td>
                    <td style={{ display: 'flex', paddingTop: '0px' }}>
                      {profilePictures[customer._id] ? (
                        <div style={{
                          backgroundImage: `url(${profilePictures[customer._id]})`,
                          backgroundSize: 'cover',
                          borderRadius: '50%',
                          height: '30px',
                          width: '30px',
                          // borderStyle:'solid',
                          marginRight: '10px',
                          marginLeft: '3px'
                        }}></div>
                      ) : (
                        <FaUserCircle size={32} className='navbar-profile-icon' style={{ marginRight: '10px' }} />
                      )}
                      <span style={{ textAlign: 'center' }}>{customer.customerFname}</span>
                    </td>
                    <td>{addresses[customer._id]?.aadharDistrict}</td>
                    <td>{addresses[customer._id]?.aadharCity}</td>
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

              <span>Page {currentPage}</span>
              <MdKeyboardArrowRight size={25} onClick={() => paginate(currentPage + 1)} disabled={indexOfLastCustomer >= filteredCustomers.length} />


            </div>
          </div>

        </Container>
      </Container>
    </>
  );
}

export default CustomerTable;
