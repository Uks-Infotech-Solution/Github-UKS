import React, { useState, useEffect } from 'react';
import { Table, Container, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { PiCircleFill } from "react-icons/pi";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate hook

function DSA_Package_List() {
    const location = useLocation();
    const { uksId } = location.state || {};

    const [packagers, setPackagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate(); // Initialize useNavigate hook

    const indexOfLastDsa = currentPage * rowsPerPage;
    const indexOfFirstDsa = indexOfLastDsa - rowsPerPage;

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await axios.get('http://148.251.230.14:8000/Inactive/packagers');
                setPackagers(response.data.data || []); // Ensure it's an array
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

    const handleActivate = (pkgId, dsaId) => {
        // Navigate to /dsa/package/activate with state containing dsaId and pkgId
        navigate(`/dsa/package/activate`, { state: { uksId, pkgId } });
    };

    return (
        <Container>
            <div className='dsa-table-container-second'>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px' }}>
                    <span className='dsa-table-container-second-head'>DSA's Package Activation List</span>
                </div>
                <div className="table-responsive">
                    <Table striped bordered hover className='dsa-table-line'>
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
                            {packagers.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center">No Record Found</td>
                                </tr>
                            ) : (
                                packagers.map((pkg) => (
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
                                        <td><Button onClick={() => handleActivate(pkg._id, pkg.dsaId)}>Activate</Button></td>
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
                            disabled={indexOfLastDsa >= packagers.length}
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default DSA_Package_List;
