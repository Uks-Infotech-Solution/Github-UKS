import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Customer_List.css';
import { MdHome, MdArrowForwardIos, MdEdit, MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { FaUserCircle, FaFileDownload } from 'react-icons/fa';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from 'react-icons/lia';
import { SiBitcoinsv } from 'react-icons/si';
import { GrView } from 'react-icons/gr';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Applied_Customer_List() {
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
  const [allChecked, setAllChecked] = useState(false);
  const { dsaId } = location.state || {};
  const [packages, setPackages] = useState({ loanTypes: [] });
  const { isSidebarExpanded } = useSidebar();


// console.log(dsaId);
  const fetchDSADetails = async (dsaId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
      setDsaData(response.data);
    } catch (error) {
      console.error('Error fetching DSA details:', error);
    }
  };
  useEffect(() => {
    const fetchPackages = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/buy_packages/dsa/${dsaId}`);
            setPackages(response.data);
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    fetchPackages();
}, [dsaId]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`https://uksinfotechsolution.in:8000/dsa/customer/applied/loan/${dsaId}`);
        const customersData = response.data;
        setCustomers(customersData);
  
        const initialCheckedItems = {};
        const addresses = {};
        const profilePictures = {};
  
        for (let customer of customersData) {
          initialCheckedItems[customer._id] = false;
  
          try {
            const addressResponse = await axios.get('https://uksinfotechsolution.in:8000/view-address', {
              params: { customerId: customer.customerId },
            });
            addresses[customer._id] = addressResponse.data;
          } catch (error) {
            console.error(`Error fetching address for customer ${customer._id}:`, error);
          }
  
          try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/api/profile/view-profile-picture?customerId=${customer.customerId}`, {
              responseType: 'arraybuffer',
            });
            const contentType = response.headers['content-type'];
  
            if (contentType && contentType.startsWith('image')) {
              const base64Image = `data:${contentType};base64,${btoa(
                String.fromCharCode(...new Uint8Array(response.data))
              )}`;
              profilePictures[customer._id] = base64Image; // Update profilePictures state
            } else {
              console.error('Response is not an image');
            }
          } catch (err) {
            // console.error('Error retrieving profile picture:', err);
          }
        }
  
        setCheckedItems(initialCheckedItems);
        setAddresses(addresses);
        setProfilePictures(profilePictures); // Update profilePictures state
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err);
        setLoading(false);
      }
    };
  
    if (dsaId) {
      fetchCustomers();
    }
  }, [dsaId]);

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
    if (filterOption === 'District') {
      const customerAddress = addresses[customer._id];
      return customerAddress && customerAddress.aadharDistrict.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterOption === 'Area') {
      const customerAddress = addresses[customer._id];
      return customerAddress && customerAddress.aadharCity.toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  })
  // .filter((customer) => {
  // console.log(customer.loanType);

  //   return Array.isArray(packages.loanTypes) && packages.loanTypes.includes(customer.loanType);
  // });

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
        dsaId,
        loanId: selectedCustomer._id,
        applicationNumber: selectedCustomer.applicationNumber,
        date: currentDate,
      };
  
      await axios.post('https://uksinfotechsolution.in:8000/dsa/customer/apply/view/count', payload);
       navigate('/applied/customer/view', { state: { loanId: selectedCustomer._id, applicationNumber: selectedCustomer.applicationNumber ,dsaId} });
      
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
            <span className='Customer-table-container-second-head'>Applied Customers List</span>
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
                  <th className='Customer-Table-head'>Application No</th>
                  <th className='Customer-Table-head'>Customer No</th>
                  <th className='Customer-Table-head'>Name</th>
                  <th className='Customer-Table-head'>District</th>
                  <th className='Customer-Table-head'>Area</th>
                  <th className='Customer-Table-head'>Type of Loan</th>
                  <th className='Customer-Table-head'>Amount</th>
                  <th className='Customer-Table-head'>Required Days</th>

                  <th className='Customer-Table-head'>Status</th>

                  <th className='Customer-Table-head'>View</th>
                  {/* <th className='Customer-Table-head'>Pdf</th> */}
                </tr>
              </thead>
              <tbody>
  {/* Render only the customers for the current page */}
  {filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer).map((customer, index) => (
    packages.some(pkg => Array.isArray(pkg.loanTypes) && pkg.loanTypes.includes(customer.loanType)) && (
      <tr key={customer._id}>
        {/* <td >
          <input
            type='checkbox'
            className='customer-list-checkbox'
            checked={checkedItems[customer._id]}
            onChange={(e) => handleCheckboxChange(e, customer._id)}
          />
        </td> */}
        <td>{indexOfFirstCustomer + index + 1}</td>
        <td>UKS-Application-00{customer.applicationNumber}</td>
        <td style={{ width: '100px' }}>
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
              marginRight: '10px',
              marginLeft: '3px'
            }}></div>
          ) : (
            <FaUserCircle size={32} className='navbar-profile-icon' style={{ marginRight: '10px' }} />
          )}
          <span style={{ textAlign: 'center' }}>{customer.customerName}</span>
        </td>
        {addresses[customer._id] && (
          <>
            <td>{addresses[customer._id].aadharDistrict || 'No District'}</td>
            <td>{addresses[customer._id].aadharCity || 'No City'}</td>
          </>
        )}
        <td>{customer.loanType}</td>
        <td>{customer.loanAmount}</td>
        <td>{customer.loanRequiredDays}</td>
        <td>{customer.applyLoanStatus}</td>
        <td>
          <GrView onClick={() => handleEditClick(customer._id)} style={{ cursor: 'pointer', color: '#2492eb' }} />
        </td>
      </tr>
    )
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

export default Applied_Customer_List;
