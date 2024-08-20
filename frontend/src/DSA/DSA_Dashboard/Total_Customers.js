import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { useNavigate, useLocation } from 'react-router-dom';

const Dsa_Total_Customers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingData, setMissingData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('Both');
  const { isSidebarExpanded } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const { dsaId } = location.state || {};


  useEffect(() => {
    const fetchCustomerDetails = async (customerId) => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/customer-pending-details', {
          params: { customerId },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        throw error;
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/');
        const customersData = response.data;
        const activeCustomers = customersData.filter(customer => customer.isActive && !customer.block_status);
        setCustomers(activeCustomers);
        setFilteredCustomers(activeCustomers); // Initially show all customers
        setLoading(false);

        const missingDataTemp = {};

        for (const customer of customersData) {
          const { missingTables } = await fetchCustomerDetails(customer._id);
          missingDataTemp[customer._id] = missingTables.length > 0 ? missingTables : [];
        }

        setMissingData(missingDataTemp);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleFilterChange = (filter) => {
    
    setSelectedFilter(filter);
    if (filter === 'Active') {
      setFilteredCustomers(customers.filter(customer => customer.isActive));
    } else if (filter === 'Inactive') {
      setFilteredCustomers(customers.filter(customer => !customer.isActive));
    } else {
      setFilteredCustomers(customers); // Show all customers
    }
    setCurrentPage(1); // Reset page to 1 on filter change
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

  const indexOfLastCustomer = currentPage * rowsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - rowsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRowsPerPageChange = (eventKey) => {
    setRowsPerPage(Number(eventKey));
    setCurrentPage(1); // Reset page to 1 on rows per page change
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleEditClick = async (id) => {
    const selectedCustomer = customers.find((customer) => customer._id === id);
    if (!selectedCustomer) {
      console.error("Selected customer not found");
      return;
    }
    // navigate('/uks/customer/detail/view', { state: { customerId: selectedCustomer._id } });
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ overflowX: 'auto' }} className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <h3>Total Customers List</h3>


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
      {/* <Row style={{ alignItems: 'center', justifyContent: 'end' }}>
        <Col lg={1}>
          <DropdownButton
            id="dropdown-basic-button"
            title={`Filter`}
            onSelect={handleFilterChange}
            style={{ marginRight: '10px' }}
          >
            <Dropdown.Item eventKey="Both">Both</Dropdown.Item>
            <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
            <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row> */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={thStyle}>SI.No</th>
            <th style={thStyle}>Customer No</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Customer Type</th>
            <th style={thStyle}>Refered By</th>
            <th style={thStyle}>Type of Loan</th>
            <th style={thStyle}>Loan Amount</th>
            <th style={thStyle}>Updation Pending</th>
            <th style={thStyle}>Activation</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer, index) => (
            <tr key={customer._id} style={{ borderBottom: '1px solid #dddddd' }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>UKS-CUS-0{customer.customerNo}</td>
              <td style={tdStyle}>{customer.customerFname}</td>
              <td style={tdStyle}>{customer.customerType}</td>
              <td style={tdStyle}>{customer.ReferedBy}</td>
              <td style={tdStyle}>{customer.typeofloan}</td>
              <td style={tdStyle}>{formatLoanAmount(customer.loanRequired)}</td>
              <td style={tdStyle}>
                {missingData[customer._id] && missingData[customer._id].length > 0
                  ? missingData[customer._id].join(', ')
                  : 'Completed'}
              </td>
              <td style={{ ...tdStyle, color: customer.isActive ? 'green' : 'red' }}>
                {customer.isActive ? 'Activated' : 'Pending'}
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
        <DropdownButton
          id="rowsPerPageDropdown"
          title={`${rowsPerPage} Rows/Page`}
          onSelect={handleRowsPerPageChange}
          className='table-row-per-button'
        >
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="10">10</Dropdown.Item>
          <Dropdown.Item eventKey="15">15</Dropdown.Item>
          <Dropdown.Item eventKey="20">20</Dropdown.Item>
        </DropdownButton>
        <MdKeyboardArrowLeft
          size={24}
          onClick={handlePrevPage}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        />
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {Math.ceil(filteredCustomers.length / rowsPerPage)}</span>
        <MdKeyboardArrowRight
          size={24}
          onClick={handleNextPage}
          style={{ cursor: 'pointer', margin: '0 10px' }}
        />
      </div>
    </div>
  );
};

const thStyle = {
  backgroundColor: '#cbb29c',
  color: 'white',
  padding: '12px',
  textAlign: 'left',
  fontSize: '14px',
  borderBottom: '1px solid #dddddd',
};

const tdStyle = {
  backgroundColor: '#f2f2f2',
  padding: '12px',
  textAlign: 'left',
  fontSize: '14px',
  borderBottom: '1px solid #dddddd',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export default Dsa_Total_Customers;
