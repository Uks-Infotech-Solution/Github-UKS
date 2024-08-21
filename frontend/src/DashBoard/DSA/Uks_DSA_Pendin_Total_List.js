import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown, DropdownButton, Row, Col } from 'react-bootstrap';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { useNavigate, useLocation } from 'react-router-dom';

const Dsa_pending_List = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dsas, setDsas] = useState([]);
  const [filteredDsas, setFilteredDsas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missingData, setMissingData] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('Active');
  const { isSidebarExpanded } = useSidebar();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const { uksId } = location.state || {};

  useEffect(() => {
    const fetchDsaDetails = async (dsaId) => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/dsa-pending-details', {
          params: { dsaId },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching DSA details:', error);
        throw error;
      }
    };

    const fetchDsas = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/list');
        const dsaData = response.data.dsa;
        // console.log(dsaData);
        
        setDsas(dsaData);
        // const activeCustomers = dsaData.filter(dsa => dsa.isActive );
        setFilteredDsas(dsaData); // Initially show all DSAs
        setLoading(false);

        const missingDataTemp = {};

        for (const dsa of dsaData) {
          const { missingTables } = await fetchDsaDetails(dsa._id);
          missingDataTemp[dsa._id] = missingTables.length > 0 ? missingTables : [];
        }

        setMissingData(missingDataTemp);
      } catch (err) {
        console.error('Error fetching DSAs:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchDsas();
  }, []);

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter === 'Active') {
      setFilteredDsas(dsas.filter(dsa => dsa.isActive));
    } else if (filter === 'Inactive') {
      setFilteredDsas(dsas.filter(dsa => !dsa.isActive));
    } else {
      setFilteredDsas(dsas); // Show all DSAs (Both Active and Inactive)
    }
    setCurrentPage(1); // Reset page to 1 on filter change
  };

  const indexOfLastDsa = currentPage * rowsPerPage;
  const indexOfFirstDsa = indexOfLastDsa - rowsPerPage;
  const currentDsas = filteredDsas.slice(indexOfFirstDsa, indexOfLastDsa);

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredDsas.length / rowsPerPage);
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRowsPerPageChange = (eventKey) => {
    setRowsPerPage(Number(eventKey));
    setCurrentPage(1); // Reset page to 1 on rows per page change
  };

  const handleEditClick = async (id) => {
    const selectedDsa = dsas.find((dsa) => dsa._id === id);
    if (!selectedDsa) {
      console.error("Selected DSA not found");
      return;
    }
    navigate('/dsa/updation', { state: { dsaId: selectedDsa._id, uksId } });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={{ overflowX: 'auto' }} className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <h3>DSA Updation List</h3>

      <Row style={{ justifyContent: 'center' }}>
        <Col lg={4} xs={12} sm={6} md={3} className='mt-2'>
          <div className='count-box Customer-table-container-second' style={{ height: '170px' }}>
            <div className=''>
              <p>Total DSA Count:
                <span style={{ fontSize: '23px', fontWeight: '600', paddingLeft: '5px' }}>  {filteredDsas.length}</span></p>
            </div>
          </div>
        </Col>
      </Row>

      <Row style={{ alignItems: 'center', justifyContent: 'end' }}>
        <Col lg={1}>
          <DropdownButton
            id="dropdown-basic-button"
            title={`${selectedFilter}`}
            onSelect={handleFilterChange}
            style={{ marginRight: '10px' }}
          >
            <Dropdown.Item eventKey="Active">Active</Dropdown.Item>
            <Dropdown.Item eventKey="Inactive">Inactive</Dropdown.Item>
            <Dropdown.Item eventKey="Both">Both</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={thStyle}>SI.No</th>
            <th style={thStyle}>Dsa No</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Company Name</th>
            <th style={thStyle}>Contact</th>
            <th style={thStyle}>Whatsapp</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Web Site</th>
            <th style={thStyle}>Updation Pending</th>
            <th style={thStyle}>Email Activation</th>
            <th style={thStyle}>View</th>
          </tr>
        </thead>
        <tbody>
          {currentDsas.map((dsa, index) => (
            <tr key={dsa._id} style={{ borderBottom: '1px solid #dddddd' }}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>UKS-DSA-0{dsa.dsaNumber}</td>
              <td style={tdStyle}>{dsa.dsaName}</td>
              <td style={tdStyle}>{dsa.dsaCompanyName}</td>
              <td style={tdStyle}>{dsa.primaryNumber}</td>
              <td style={tdStyle}>{dsa.whatsappNumber}</td>
              <td style={tdStyle}>{dsa.email}</td>
              <td style={tdStyle}>{dsa.website}</td>
              <td style={tdStyle}>
                {missingData[dsa._id] && missingData[dsa._id].length > 0
                  ? missingData[dsa._id].join(', ')
                  : 'Completed'}
              </td>
              <td style={{ ...tdStyle, color: dsa.isActive ? 'green' : 'red' }}>
                {dsa.isActive ? 'Activated' : 'Pending'}
              </td>
              <td style={tdStyle}>
                <GrView onClick={() => handleEditClick(dsa._id)} style={{ cursor: 'pointer', color: '#024F9D', fontSize: '22px' }} />
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
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {Math.ceil(filteredDsas.length / rowsPerPage)}</span>
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
  backgroundColor: 'grey',
  color: 'white',
  padding: '12px',
  textAlign: 'left',
  fontSize: '14px',
  borderBottom: '1px solid #dddddd',
};

const tdStyle = {
  backgroundColor: '#cbb29c',
  padding: '12px',
  textAlign: 'left',
  fontSize: '14px',
  borderBottom: '1px solid #dddddd',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

export default Dsa_pending_List;
