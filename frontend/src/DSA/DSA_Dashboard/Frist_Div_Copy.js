import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Customer_List.css';
import { FaUserCircle } from 'react-icons/fa';
import { GrView } from 'react-icons/gr';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from 'react-icons/lia';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import './First_Div.css'
import { LiaRupeeSignSolid } from "react-icons/lia";

function First_Div() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dsaData, setDsaData] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [addresses, setAddresses] = useState({});
  const [profilePictures, setProfilePictures] = useState({});
  const [filterOption, setFilterOption] = useState('This Month');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortingOrder, setSortingOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filterDropdownRef = useRef(null);
  const { dsaId } = location.state || {};

  const fetchDSADetails = async (dsaId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
      setDsaData(response.data);
    } catch (error) {
      console.error('Error fetching DSA details:', error);
    }
  };

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
              profilePictures[customer._id] = base64Image;
            } else {
              console.error('Response is not an image');
            }
          } catch (err) {
            console.error('Error retrieving profile picture:', err);
          }
        }

        setCheckedItems(initialCheckedItems);
        setAddresses(addresses);
        setProfilePictures(profilePictures);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
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
        dsaId,
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
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
};

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Container fluid className={`applied-first-div-container`}>
        <Container className='applied-first-div-inner-container'>
          <div className='d-flex justify-content-between align-items-center'>
            <span className='applied-first-div-header'>Applied Customer List</span>
            <span className='d-flex align-items-center position-relative'>
              <LiaSortAlphaDownSolid
                size={30}
                style={{ paddingRight: "10px", cursor: 'pointer' }}
                onClick={handleSort}
              />
                  <DropdownButton
                    id="dropdown-basic-button"
                    title={filterOption}
                    onSelect={(eventKey) => handleFilterOptionChange(eventKey)}
                    style={{width:'50px' }}
                  >
                    <Dropdown.Item eventKey="This Month">This Month</Dropdown.Item>
                    <Dropdown.Item eventKey="Today">Today</Dropdown.Item>
                    <Dropdown.Item eventKey="Yesterday">Yesterday</Dropdown.Item>
                    <Dropdown.Item eventKey="Yesterday">Previous Month</Dropdown.Item>
                  </DropdownButton>             
            </span>
          </div>
          <div className="applied-first-div-customer-list">
            {currentCustomers.map((customer) => (
              <div key={customer._id} className="applied-first-div-customer-item">
                <div className="applied-first-div-customer-details">
                  <div className="applied-first-div-customer-avatar">
                    {profilePictures[customer._id] ? (
                      <img src={profilePictures[customer._id]} alt="Profile"  className="" />
                    ) : (
                      <FaUserCircle size={50} className='navbar-profile-icon' />
                    )}
                  </div>
                  <div className="applied-first-div-customer-info">
                  <div className="apply-loan-cname">
                                        {customer?.title} {customer?.customerName}
                                        <span className="loan-rating"> (UKS-CUS-00{customer?.customerNo})</span>
                                        <span className="apply-loan-name">
                                            <span style={{ paddingLeft: '10px', color: 'green' }}>
                                                {customer?.customerLoanStatus}
                                            </span>
                                        </span>
                                    </div>
                        
                    {/* <div><strong>District:</strong> {addresses[customer._id]?.aadharDistrict || 'N/A'}</div>
                    <div><strong>Area:</strong> {addresses[customer._id]?.aadharCity || 'N/A'}</div>
                    <div><strong>Type of Loan:</strong> {customer.loanType}</div> */}
                    <div className="loan-amount">
                                <span className="loan-days">Applied Loan: <span className="loan-rating">{customer.loanType}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Applied Date: <span className="loan-rating">{formatDate(customer.timestamp)}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Loan Amount: <span className="loan-rating"><LiaRupeeSignSolid size={15} />{customer.loanAmount}</span></span>
                                <span className="loan-rating" style={{ fontWeight: '400', fontSize: '12px', marginLeft: '5px', marginRight: '5px' }}>|</span>
                                <span className="loan-days">Required Days: <span className="loan-rating">{customer.loanRequiredDays}</span></span>
                            
                            </div>
                    <div><strong>Status:</strong> {customer.applyLoanStatus}</div>
                  </div>
                </div>
                {/* <div className="applied-first-div-customer-actions">
                  <Button variant='primary' style={{height:'30px', width:'52px', fontSize:'12px'}} onClick={() => handleEditClick(customer._id)}>
                     View
                  </Button>
                </div> */}
              </div>

            ))}
          </div>
          <div className="applied-first-div-pagination-container">
            <div className="applied-first-div-pagination" >
              <span style={{ marginRight: '10px' }}>Rows per page: </span>
              <DropdownButton
                id="rowsPerPageDropdown"
                title={`${rowsPerPage}`}
                onSelect={handleRowsPerPageChange}
                className='applied-first-div-table-row-per-button'
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

export default First_Div;
