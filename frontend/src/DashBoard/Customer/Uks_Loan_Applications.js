import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from 'react-icons/lia';
import { FaUserCircle } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Uks_Loan_Applications() {
  const location = useLocation();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [addresses, setAddresses] = useState({});
  const [profilePictures, setProfilePictures] = useState({});
  const [filterOption, setFilterOption] = useState('District');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortingOrder, setSortingOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filterDropdownRef = useRef(null);
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/customer/loan/application');
        const customersData = response.data;
        setCustomers(customersData);

        const initialCheckedItems = {};
        const addressesData = {};

        for (const customer of customersData) {
          initialCheckedItems[customer._id] = false;

          try {
            const addressResponse = await axios.get('https://uksinfotechsolution.in:8000/view-address', {
              params: { customerId: customer.customerId },
            });
            addressesData[customer._id] = addressResponse.data;
          } catch (error) {
            console.error(`Error fetching address for customer ${customer._id}:`, error);
          }
        }

        setCheckedItems(initialCheckedItems);
        setAddresses(addressesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

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
    const customerAddress = addresses[customer._id];
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

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  const handleEditClick = async (id) => {
    const selectedCustomer = customers.find((customer) => customer._id === id);
    if (!selectedCustomer) {
      console.error('Selected customer not found');
      return;
    }

    try {
      const currentDate = new Date().toISOString();
      const payload = {
        customerId: selectedCustomer.customerId,
        loanId: selectedCustomer._id,
        applicationNumber: selectedCustomer.applicationNumber,
        date: currentDate,
      };

      await axios.post('https://uksinfotechsolution.in:8000/dsa/customer/apply/view/count', payload);
      navigate('/applied/customer/view', { state: { loanId: selectedCustomer._id, applicationNumber: selectedCustomer.applicationNumber } });
    } catch (error) {
      console.error('Error storing data:', error.response ? error.response.data : error.message);
    }
  };

  const handleRowsPerPageChange = (selectedRowsPerPage) => {
    setRowsPerPage(selectedRowsPerPage);
    setCurrentPage(1);
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setShowFilterDropdown(true);
  };

  const handleAllChecked = (event) => {
    const isChecked = event.target.checked;
    const newCheckedItems = {};
    customers.forEach((customer) => {
      newCheckedItems[customer._id] = isChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <Container className='Customer-table-container-second'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className='Customer-table-container-second-head'>Customer- Loan Applied List</span>
            <span style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              {/* <IoFilterSharp
                size={30}
                style={{ paddingRight: "10px", cursor: 'pointer' }}
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              /> */}
              <LiaSortAlphaDownSolid
                size={30}
                style={{ paddingRight: "10px", cursor: 'pointer' }}
                onClick={handleSort}
              />

              {/* {showFilterDropdown && (
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
              )} */}
            </span>
          </div>
          <div className="table-responsive">
            <Table striped bordered hover className='dsa-table-line'>
              <thead>
                <tr>
                  <th className='Customer-Table-head'>SI.No</th>
                  <th className='Customer-Table-head'>Application No</th>
                  <th className='Customer-Table-head'>Customer No</th>
                  <th className='Customer-Table-head'>Name</th>
                  {/* <th className='Customer-Table-head'>District</th>
                  <th className='Customer-Table-head'>Area</th> */}
                  <th className='Customer-Table-head'>Type of Loan</th>
                  <th className='Customer-Table-head'>Amount</th>
                  <th className='Customer-Table-head'>Required Days</th>
                  <th className='Customer-Table-head'>DSA No</th>
                  <th className='Customer-Table-head'>DSA Name</th>
                  <th className='Customer-Table-head'>Company Name</th>
                  <th className='Customer-Table-head'>Applied Date</th>
                  <th className='Customer-Table-head'>Status</th>

                  <th className='Customer-Table-head'>View</th>
                  {/* <th className='Customer-Table-head'>Pdf</th> */}
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((customer, index) => {
                  const customerAddress = addresses[customer._id];
                  return (
                    <tr key={customer._id}>
                      <td>{indexOfFirstCustomer + index + 1}</td>
                      <td>UKS-Application-00{customer.applicationNumber}</td>
                      <td style={{ width: '100px' }}>
                        {customer.customerNo ? `UKS-CUS-${customer.customerNo.toString().padStart(3, '0')}` : 'N/A'}
                      </td>
                      <td style={{ display: 'flex', paddingTop: '0px' }}>
                        {/* {profilePictures[customer._id] ? (
                          <div style={{
                            backgroundImage: `url(${profilePictures[customer._id]})`,
                            backgroundSize: 'cover',
                            borderRadius: '50%',
                            height: '30px',
                            width: '30px',
                            marginRight: '10px',
                            marginLeft: '3px'
                          }}></div>
                        ) : (
                          <FaUserCircle size={32} className='navbar-profile-icon' style={{ marginRight: '10px' }} />
                        )} */}
                        <span style={{ textAlign: 'center' }}>{customer.customerName}</span>
                      </td>
                      {/* {addresses[customer._id] && (
                        <>
                          <td>{addresses[customer._id].aadharDistrict || 'No District'}</td>
                          <td>{addresses[customer._id].aadharCity || 'No City'}</td>
                        </>
                      )} */}
                      <td>{customer.loanType}</td>
                      <td>{customer.loanAmount}</td>
                      <td>{customer.loanRequiredDays}</td>
                      <td>UKS-DSA-0{customer.dsaNumber}</td>
                      <td>{customer.dsaName}</td>
                      <td>{customer.dsaCompanyName}</td>
                      <td>{new Date(customer.timestamp).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}</td>

                      <td>{customer.applyLoanStatus}</td>
                      <td>
                        <GrView onClick={() => handleEditClick(customer._id)} style={{ cursor: 'pointer', color: '#2492eb' }} />
                      </td>
                    </tr>
                  );
                })}
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

export default Uks_Loan_Applications;
