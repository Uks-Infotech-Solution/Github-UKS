import React, { useState, useEffect } from 'react';
import { Table, Container, DropdownButton, Dropdown, Row, Col } from 'react-bootstrap';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { PiCircleFill } from "react-icons/pi";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import { GrView } from "react-icons/gr";

function DSA_Package_List() {
    const location = useLocation();
    const { uksId } = location.state || {};
    const { isSidebarExpanded } = useSidebar();

    const [packagers, setPackagers] = useState([]);
    const [filteredPackagers, setFilteredPackagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedFilter, setSelectedFilter] = useState('Both');
    const navigate = useNavigate();

    const indexOfLastDsa = currentPage * rowsPerPage;
    const indexOfFirstDsa = indexOfLastDsa - rowsPerPage;

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://localhost:8000/buy/packagers/list');
                const fetchedPackagers = response.data.data || [];
                setPackagers(fetchedPackagers);
                setFilteredPackagers(fetchedPackagers); // Initially display all packages
                setLoading(false);
            } catch (error) {
                console.error('Error fetching package details:', error);
                setLoading(false);
                setError('Error fetching package details.');
            }
        };

        fetchPackages();
    }, []);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleRowsPerPageChange = (selectedRowsPerPage) => {
        setRowsPerPage(parseInt(selectedRowsPerPage));
        setCurrentPage(1);
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);

        if (filter === 'Active') {
            setFilteredPackagers(packagers.filter(pkg => pkg.packageStatus === 'Active'));
        } else if (filter === 'Inactive') {
            setFilteredPackagers(packagers.filter(pkg => pkg.packageStatus === 'Inactive'));
        } else {
            setFilteredPackagers(packagers); // Show all packages
        }

        setCurrentPage(1); // Reset page to 1 on filter change
    };

    const handleActivate = (pkgId, dsaId) => {
        navigate(`/dsa/package/activate`, { state: { uksId, pkgId } });
    };

    return (
        <Container>
            <div className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
                    <span className='dsa-table-container-second-head'>DSA's Package Activation List</span>
                </div>

                <div className="table-responsive">
                    <Row style={{ alignItems: 'center', justifyContent: 'end' }}>
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
                    </Row>
                    <Table striped bordered hover className=''>
                        <thead>
                            <tr>
                                <th className='dsa-table-head'>DSA Number</th>
                                <th className='dsa-table-head'>DSA Name</th>
                                <th className='dsa-table-head'>DSA Company Name</th>
                                <th className='dsa-table-head'>Contact Number</th>
                                <th className='dsa-table-head'>Package Name</th>
                                <th className='dsa-table-head'>Download Access</th>
                                <th className='dsa-table-head'>Package Amount</th>
                                <th className='dsa-table-head'>Package Status</th>
                                <th className='dsa-table-head'>Activate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPackagers.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center">No Record Found</td>
                                </tr>
                            ) : (
                                filteredPackagers.slice(indexOfFirstDsa, indexOfLastDsa).map((pkg) => (
                                    <tr key={pkg._id}>
                                        <td>UKS-DSA-0{pkg.dsaNumber}</td>
                                        <td>{pkg.dsaName}</td>
                                        <td>{pkg.dsaCompanyName}</td>
                                        <td>{pkg.primaryNumber}</td>
                                        <td>{pkg.packageName}</td>
                                        <td>{pkg.downloadAccess}</td>
                                        <td>{pkg.packageAmount}</td>
                                        <td>
                                            <span style={{ color: pkg.packageStatus === 'Active' ? 'green' : 'red', fontWeight: '600' }}>
                                                <PiCircleFill size={10} style={{ marginRight: '1px' }} />
                                                {pkg.packageStatus}
                                            </span>
                                        </td>
                                        <td><GrView style={{ color: 'blue' }} onClick={() => handleActivate(pkg._id, pkg.dsaId)} /></td>
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
                            disabled={indexOfLastDsa >= filteredPackagers.length}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default DSA_Package_List;
