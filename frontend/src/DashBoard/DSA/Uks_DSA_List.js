import React, { useState, useEffect, useRef } from 'react';
import { Table, Container, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { IoFilterSharp } from 'react-icons/io5';
import { LiaSortAlphaDownSolid } from "react-icons/lia";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { PiCircleFill } from "react-icons/pi";
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function UKS_DSA_List() {
  const location = useLocation();
  const navigate = useNavigate();
  const { uksId } = location.state || {};
  const [dsaData, setDsaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState('District');
  const [filterValue, setFilterValue] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortingOrder, setSortingOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const filterDropdownRef = useRef(null);

  const [checkedItems, setCheckedItems] = useState({});
  const [allChecked, setAllChecked] = useState(false);
  const [dsaLoanDetails, setDsaLoanDetails] = useState({});
  const [loadingLoanDetails, setLoadingLoanDetails] = useState({});
  const [dsaAddress, setDsaAddress] = useState({}); // State to hold address details

  const indexOfLastDsa = currentPage * rowsPerPage;
  const indexOfFirstDsa = indexOfLastDsa - rowsPerPage;
  const currentDsas = dsaData.slice(indexOfFirstDsa, indexOfLastDsa);
  const { isSidebarExpanded } = useSidebar();

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const handleRowsPerPageChange = (selectedRowsPerPage) => {
    setRowsPerPage(parseInt(selectedRowsPerPage));
    setCurrentPage(1);
  };

  const fetchDSADetails = async () => {
    try {
      const response = await axios.get(`http://148.251.230.14:8000/api/dsa/list`);
      setDsaData(response.data.dsa);
      setLoading(false);

      // Fetch address details for each DSA
      const addressPromises = response.data.dsa.map(dsa => (
        axios.get(`http://148.251.230.14:8000/api/dsa/address?dsaId=${dsa._id}`)
      ));
      const addressResponses = await Promise.all(addressPromises);
      const addresses = {};
      addressResponses.forEach((addressResponse, index) => {
        const dsaId = response.data.dsa[index]._id;
        addresses[dsaId] = addressResponse.data.permanentAddress;
      });
      setDsaAddress(addresses);
    } catch (error) {
      console.error('Error fetching DSA details:', error);
      setLoading(false);
    }
  };

  const fetchLoanDetails = async (dsaId) => {
    setLoadingLoanDetails((prevLoadingLoanDetails) => ({
      ...prevLoadingLoanDetails,
      [dsaId]: true,
    }));

    try {
      const response = await axios.get(`http://148.251.230.14:8000/api/dsa/getLoanDetails/${dsaId}`);

      setDsaLoanDetails((prevDetails) => ({
        ...prevDetails,
        [dsaId]: response.data.loanDetails,
      }));
    } catch (error) {
      console.error('Error fetching loan details:', error);
    } finally {
      setLoadingLoanDetails((prevLoadingLoanDetails) => ({
        ...prevLoadingLoanDetails,
        [dsaId]: false,
      }));
    }
  };

  const handleFilterOptionChange = (option) => {
    setFilterOption(option);
    setShowFilterDropdown(true);
  };

  useEffect(() => {
    fetchDSADetails();

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

  useEffect(() => {
    currentDsas.forEach(dsa => {
      if (!dsaLoanDetails[dsa._id] && !loadingLoanDetails[dsa._id]) {
        fetchLoanDetails(dsa._id);
      }
    });
  }, [currentDsas, dsaLoanDetails, loadingLoanDetails]);

  const handleViewClick = (dsaId) => {
    navigate(`/dsa/detail/view`, { state: { dsaId, uksId } });
  };

  const handleSort = () => {
    const newSortingOrder = sortingOrder === 'asc' ? 'desc' : 'asc';
    setSortingOrder(newSortingOrder);
    setDsaData([...dsaData].sort((a, b) => {
      if (a.dsaName < b.dsaName) return newSortingOrder === 'asc' ? -1 : 1;
      if (a.dsaName > b.dsaName) return newSortingOrder === 'asc' ? 1 : -1;
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
    currentDsas.forEach(dsa => {
      newCheckedItems[dsa._id] = isChecked;
    });
    setCheckedItems(newCheckedItems);
    setAllChecked(isChecked);
  };
  // Filter appliedLoan based on filterOption and filterValue
  // Filter appliedLoan based on filterOption and filterValue
  const filteredDsas = dsaData.filter((dsa) => {
    if (filterOption === 'District') {
      return dsaAddress[dsa._id]?.district.toLowerCase().includes(filterValue.toLowerCase());
    }
    if (filterOption === 'Area') {
      return dsaAddress[dsa._id]?.area.toLowerCase().includes(filterValue.toLowerCase());
    }
    return true;
  });

  return (
    <>
                   <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <div className='dsa-table-container-second'>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
            <span className='dsa-table-container-second-head'>DSA's List</span>
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
                  {/* <th>
                    <input
                      type="checkbox"
                      className='dsa-checkbox'
                      checked={allChecked}
                      onChange={(e) => {
                        setAllChecked(e.target.checked);
                        handleAllChecked(e);
                      }}
                    />
                  </th> */}
                  <th className='dsa-table-head'>SI.No</th>
                  <th className='dsa-table-head'>DSA No</th>
                  <th className='dsa-table-head'>DSA Name</th>
                  <th className='dsa-table-head'>Company Name</th>
                  <th className='dsa-table-head'>District</th>
                  <th className='dsa-table-head'>Area</th>
                  <th className='dsa-table-head'>Contact</th>
                  <th className='dsa-table-head'>Type Of Loan Provide</th>
                  <th className='dsa-table-head'>Cibil Score</th>
                  <th className='dsa-table-head'>Account Status</th>
                  <th className='dsa-table-head'>View</th>
                </tr>
              </thead>
              <tbody>
                {filteredDsas.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center">No Record Found</td>
                  </tr>
                ) : (
                  filteredDsas.map((dsa, index) => (
                    <tr key={dsa._id}>
                      {/* <td>
                      <input
                        type='checkbox'
                        className='dsa-checkbox'
                        checked={checkedItems[dsa._id] || false}
                        onChange={(e) => handleCheckboxChange(e, dsa._id)}
                      />
                    </td> */}
                      <td>{indexOfFirstDsa + index + 1}</td>
                      <td>UKS-DSA-0{dsa.dsaNumber}</td>
                      <td>{dsa.dsaName}</td>
                      <td>{dsa.dsaCompanyName}</td>
                      <td>{dsaAddress[dsa._id] ? dsaAddress[dsa._id].district : '-'}</td>
                      <td>{dsaAddress[dsa._id] ? dsaAddress[dsa._id].area : '-'}</td>
                      <td>{dsa.primaryNumber}</td>
                      <td>
                        {loadingLoanDetails[dsa._id] ? (
                          'Loading...'
                        ) : (
                          dsaLoanDetails[dsa._id] && dsaLoanDetails[dsa._id].map((loan, index) => (
                            <div key={index}>{loan.typeOfLoan}</div>
                          ))
                        )}
                      </td>
                      <td>
                        {loadingLoanDetails[dsa._id] ? (
                          'Loading...'
                        ) : (
                          dsaLoanDetails[dsa._id] && dsaLoanDetails[dsa._id][0]?.requiredCibilScore
                        )}
                      </td>
                      <td>
                        <span style={{ color: dsa.isActive ? 'green' : 'red', fontWeight: '600', backgroundColor: '' }}>
                          <PiCircleFill size={10} style={{ marginRight: '1px' }} />
                          {dsa.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <GrView
                          size={15}
                          onClick={() => handleViewClick(dsa._id)}
                          style={{ cursor: 'pointer', color: '#2492eb' }}
                        />
                      </td>
                    </tr>
                  ))
                )}
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
              <span>Page {currentPage}</span>
              <MdKeyboardArrowRight
                size={25}
                onClick={() => paginate(currentPage + 1)}
                disabled={indexOfLastDsa >= dsaData.length}
              />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default UKS_DSA_List;
