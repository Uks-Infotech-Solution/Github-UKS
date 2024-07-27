import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { FaUserCircle } from 'react-icons/fa';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Sales_Cus_List() {
  const location = useLocation();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [customerDetails, setCustomerDetails] = useState({});
  const [error, setError] = useState(null);
  const { isSidebarExpanded } = useSidebar();
  const { uksId } = location.state || {};
  

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/sales/person/cus/reg/${uksId}`);
        const customersData = response.data;
        console.log(customersData);
        setCustomers(customersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [uksId]);

  useEffect(() => {
    const fetchAddresses = async () => {
      const newAddresses = {};
      for (let customer of customers) {
        try {
          const response = await axios.get('https://uksinfotechsolution.in:8000/view-address', {
            params: { customerId: customer.customerId },
          });
          if (response.status === 200) {
            newAddresses[customer.customerId] = response.data;
          }
        } catch (error) {
          console.error("Failed to fetch address for" , error);
        }
      }
      setAddresses(newAddresses);
    };

    if (customers.length > 0) {
      fetchAddresses();
    }
  }, [customers]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const customerDetails = {};
      for (let customer of customers) {
        try {
          const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
            params: { customerId: customer.customerId },
          });
          if (response.status === 200) {
            customerDetails[customer.customerId] = response.data;
            console.log(customerDetails);
          }
        } catch (error) {
          console.error`(Error fetching Customer details for ${customer.customerId}:, error)`;
        }
      }
      setCustomerDetails(customerDetails);
    };

    if (customers.length > 0) {
        fetchCustomerDetails();
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
        return base64Image;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  };
  
  useEffect(() => {
    const fetchProfilePictures = async () => {
      const newProfilePictures = {};

      for (let customer of customers) {
        try {
          const base64Image = await fetchProfilePicture(customer.customerId);
          if (base64Image !== null) {
            newProfilePictures[customer.customerId] = base64Image;
          } else {
            newProfilePictures[customer.customerId] = null;
          }
        } catch (error) {
        //   console.error(Error fetching profile picture for ${customer.customerId}:, error);
          newProfilePictures[customer.customerId] = null;
        }
      }

      setProfilePictures(newProfilePictures);
    };

    if (customers.length > 0) {
      fetchProfilePictures();
    }
  }, [customers]);

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

  const handleSort = () => {
    const newSortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';
    setSortingOrder(newSortingOrder);
    setCustomers([...customers].sort((a, b) => {
      if (a.customerName < b.customerName) return newSortingOrder === 'asc' ? -1 : 1;
      if (a.customerName > b.customerName) return newSortingOrder === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const filteredCustomers = customers.filter((customer) => {
    const customerAddress = addresses[customer.customerId];
    if (filterOption === 'District') {
      return customerAddress && customerAddress.aadharDistrict.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterOption === 'Area') {
      return customerAddress && customerAddress.aadharCity.toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  });

  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handleFilterValueChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleRowsPerPageChange = (selectedRowsPerPage) => {
    setRowsPerPage(selectedRowsPerPage);
    setCurrentPage(1);
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setShowFilterDropdown(true);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
                  {/* <th>
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={(e) => {
                        setAllChecked(e.target.checked);
                        handleAllChecked(e);
                      }}
                    />
                  </th> */}
                  <th className='Customer-Table-head'>SI.No</th>
                  <th className='Customer-Table-head'>Customer No</th>
                  <th className='Customer-Table-head'>Name</th>
                  <th className='Customer-Table-head'>Gender</th>
                  <th className='Customer-Table-head'>Type of Loan</th>
                  <th className='Customer-Table-head'>District</th>
                  <th className='Customer-Table-head'>Area</th>
                  <th className='Customer-Table-head'>Register Date</th>
                  <th className='Customer-Table-head'>Customer Status</th>
                  {/* <th className='Customer-Table-head'>Pdf</th> */}
                </tr>
              </thead>
              <tbody>
                {/* Render only the customers for the current page */}
                {filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer).map((customer,index) => (

                  <tr key={customer.customerId}>
                    
                    <td>{indexOfFirstCustomer + index + 1}</td>
                    <td style={{ width: '100px',fontSize:'13px' }}>
                {customerDetails[customer.customerId]?.customerNo
                  ? `UKS-CUS-${customerDetails[customer.customerId]?.customerNo.toString().padStart(3, '0')}`
                  : 'N/A'}
              </td>
                    <td style={{ paddingTop: '0px' }}>
                      {profilePictures[customer.customerId] ? (
                        <div style={{
                          backgroundImage: `url(${profilePictures[customer.customerId]})`,
                          backgroundSize: 'cover',
                          borderRadius: '50%',
                          height: '30px',
                          width: '30px',
                          // borderStyle:'solid',
                          marginRight: '10px',
                          marginLeft:'3px'
                        }}></div>
                      ) : (
                        <FaUserCircle size={32} className='navbar-profile-icon' style={{ marginRight: '10px' }} />
                      )}
                      <span style={{ textAlign: 'center' }}>{customerDetails[customer.customerId]?.customerFname}</span>
                    </td>
                    <td>{customerDetails[customer.customerId]?.gender}</td>
                    <td>{customerDetails[customer.customerId]?.typeofloan}</td>
                    <td>{addresses[customer.customerId]?.aadharDistrict}</td>
                    <td>{addresses[customer.customerId]?.aadharCity}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString()}</td>

                    <td style={{ color: customerDetails[customer.customerId]?.isActive ? 'green' : 'red' }} >
                {customerDetails[customer.customerId]?.isActive ? 'Active' : 'Inactive'}
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
}export default Sales_Cus_List;
