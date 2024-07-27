import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import './DSA_Table_view.css';

function DsaTable() {
  const location = useLocation();
  const { customerId } = location.state || {};
  const { isSidebarExpanded } = useSidebar();
  const [appliedLoan, setAppliedLoan] = useState([]);
  const [dsaAddress, setDsaAddress] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('District');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortingOrder, setSortingOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filterDropdownRef = useRef(null);
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  const indexOfLastLoan = currentPage * rowsPerPage;
  const indexOfFirstLoan = indexOfLastLoan - rowsPerPage;
  const currentLoans = appliedLoan.slice(indexOfFirstLoan, indexOfLastLoan);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (selectedRowsPerPage) => {
    setRowsPerPage(parseInt(selectedRowsPerPage));
    setCurrentPage(1);
  };
  useEffect(() => {
    const fetchLoanDetails = async () => {
      try {
<<<<<<< HEAD
        const response = await axios.get(`https://uksinfotechsolution.in:8000/api/customer/${customerId}/loans`);
=======
        const response = await axios.get(`https://localhost:8000/api/customer/${customerId}/loans`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
        if (response.status === 200) {
          setAppliedLoan(response.data.data);
          setLoading(false);

          // Fetch address details for each DSA
          const addressPromises = response.data.data.map(loan => (
<<<<<<< HEAD
            axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${loan.dsaId}`)
=======
            axios.get(`https://localhost:8000/api/dsa/address?dsaId=${loan.dsaId}`)
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
          ));
          const addressResponses = await Promise.all(addressPromises);
          const addresses = {};
          addressResponses.forEach((addressResponse, index) => {
            const dsaId = response.data.data[index].dsaId;
            if (addressResponse.data) {
              addresses[dsaId] = addressResponse.data.permanentAddress || {};
            }
          });
          setDsaAddress(addresses);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
        setLoading(false);
      }
    };

    if (customerId) {
      fetchLoanDetails();
    }
  }, [customerId]);


  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setShowFilterDropdown(true);
  };

  const handleOutsideClick = (event) => {
    if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
      setShowFilterDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const handleViewClick = (loanId, dsaId, customerId) => {
    navigate(`/Customer/Applied/dsalist`, { state: { loanId, dsaId, customerId } });
  };

  const handleSort = () => {
    const newSortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';
    setSortingOrder(newSortingOrder);
    setAppliedLoan([...appliedLoan].sort((a, b) => {
      if (a.loanType < b.loanType) return newSortingOrder === 'asc' ? -1 : 1;
      if (a.loanType > b.loanType) return newSortingOrder === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const handleCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  const handleAllChecked = (event) => {
    const isChecked = event.target.checked;
    const newCheckedItems = {};

    setCheckedItems(newCheckedItems);
    setAllChecked(isChecked);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // Filter appliedLoan based on filterOption and filterValue
  const filteredLoans = appliedLoan.filter((loan) => {
    if (filterOption === 'District') {
      return dsaAddress[loan.dsaId]?.district.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterOption === 'Area') {
      return dsaAddress[loan.dsaId]?.area.toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  });

  return (
    <>
      <Container style={{ paddingTop: '20px' }}>
        <div className='dsa-table-container-second'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
            <span className='dsa-table-container-second-head'>Applied Loans</span>
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
                    <Dropdown.Item eventKey="District">District</Dropdown.Item>
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
                  <th className='dsa-table-head'>SI.No</th>
                  <th className='dsa-table-head'>Application Number</th>
                  <th className='dsa-table-head'>Loan Type</th>
                  <th className='dsa-table-head'>Amount</th>
                  <th className='dsa-table-head'>Required Days</th>
                  <th className='dsa-table-head'>DSA No</th>
                  <th className='dsa-table-head'>DSA Name</th>
                  <th className='dsa-table-head'>Company Name</th>
                  <th className='dsa-table-head'>District</th>
                  <th className='dsa-table-head'>Area</th>
                  <th className='dsa-table-head'>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No Record Found</td>
                  </tr>
                ) : (
                  filteredLoans.map((loan, index) => (
                    <tr key={loan._id}>
                      <td>{indexOfFirstLoan + index + 1}</td>
                      <td>UKS-Application-0{loan.applicationNumber}</td>
                      <td>{loan.loanType}</td>
                      <td>{loan.loanAmount}</td>
                      <td>{loan.loanRequiredDays}</td>
                      <td>UKS-DSA-0{loan.dsaNumber}</td>
                      <td>{loan.dsaName}</td>
                      <td>{loan.dsaCompanyName}</td>
                      <td>{dsaAddress[loan.dsaId]?.district}</td>
                      <td>{dsaAddress[loan.dsaId]?.area}</td>
                      <td>
                        <GrView
                          size={15}
                          onClick={() => handleViewClick(loan._id, loan.dsaId, loan.customerId)}
                          style={{ cursor: 'pointer', color: '#2492eb' }}
                        />
                      </td>
                    </tr>
                  )))}
              </tbody>
            </Table>
          </div>
          <div className="pagination-container">
            <div className="pagination">
              <span style={{ marginRight: '10px' }}>Rows per page: </span>
              <DropdownButton
                id="rowsPerPageDropdown"
                title={`${rowsPerPage}`}
                onSelect={handleRowsPerPageChange}
                style={{ marginRight: '10px' }}
              >
                <Dropdown.Item eventKey="5">5</Dropdown.Item>
                <Dropdown.Item eventKey="10">10</Dropdown.Item>
                <Dropdown.Item eventKey="15">15</Dropdown.Item>
                <Dropdown.Item eventKey="20">20</Dropdown.Item>
              </DropdownButton>
              <MdKeyboardArrowLeft
                onClick={() => paginate(currentPage === 1 ? currentPage : currentPage - 1)}
                size={20}
                style={{ cursor: 'pointer', marginRight: '5px' }}
              />
              <span style={{ color: 'blue' }}>Page {currentPage}</span>
              <MdKeyboardArrowRight
                onClick={() => paginate(currentPage === Math.ceil(appliedLoan.length / rowsPerPage) ? currentPage : currentPage + 1)}
                size={20}
                style={{ cursor: 'pointer', marginLeft: '5px' }}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default DsaTable;
