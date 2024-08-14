import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';
import Select from 'react-select';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import { Container, Form } from "react-bootstrap";

const Pricing_Details = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { uksId } = location.state || {};
    const { isSidebarExpanded } = useSidebar();

    const [PackageDetails, setPackageDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); // 'success' or 'error'
    const [editingMode, setEditingMode] = useState(false);
    const [loanTypes, setLoanTypes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    useEffect(() => {
        const getLoanTypes = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/loan-types');
                const loanTypesData = response.data.map(type => ({ value: type.type, label: type.type }));
                setLoanTypes(loanTypesData);
                console.log('Fetched loan types:', loanTypesData); // Debugging line
            } catch (error) {
                console.error('Error fetching loan types:', error);
            }
        };

        getLoanTypes();
    }, []);


    const handleLoanTypeChange = (index, selectedOptions) => {
        const selectedLoanTypes = selectedOptions ? selectedOptions.map(option => option.value) : [];
        handlePackageChange(index, 'loanTypes', selectedLoanTypes);
    };
    const handleAmountChange = (e, index) => {
        const value = e.target.value;
        handlePackageChange(index, 'amount', value);
        setShowDropdown(value !== ''); // Show dropdown if the amount field is not empty
    };

    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/uks/PackageDetails/${uksId}`);
                const packageDetailsWithDefaults = response.data.data.map((packageDetail) => ({
                    ...packageDetail,
                    packageStatus: packageDetail.packageStatus || 'Active',
                    loanTypes: packageDetail.loanTypes || [], // Initialize loanTypes if not present
                }));
                setPackageDetails(packageDetailsWithDefaults);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching package details:', error);
            }
        };

        if (uksId) {
            fetchPackageDetails();
        }
    }, [uksId]);

    const handlePackageChange = (index, name, value) => {
        const updatedPackageDetails = [...PackageDetails];
        updatedPackageDetails[index] = { ...updatedPackageDetails[index], [name]: value };
        setPackageDetails(updatedPackageDetails);
    };

    const deletePackageRow = async (index, packageId) => {
        try {
            const response = await axios.delete(`https://uksinfotechsolution.in:8000/uks/PackageDetails/${packageId}`);
            if (response.status === 200) {
                const updatedPackageDetails = [...PackageDetails];
                updatedPackageDetails.splice(index, 1); // Remove the package from the state
                setPackageDetails(updatedPackageDetails);
                setModalMessage('Package detail deleted successfully.');
                setModalType('success');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
            }
        } catch (error) {
            console.error('Error deleting package detail:', error);
            setModalMessage('Error deleting package detail.');
            setModalType('error');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
        }
    };

    const addPackageRow = () => {
        setPackageDetails([...PackageDetails, { uksId, packageName: '', packageAmount: '', packageStatus: 'Active', loanTypes: [], downloadAccess: '', validity: '', amount: '', comparison: '' }]);
    };

    const handlePackageSave = async () => {
        try {
            console.log('Sending package details:', { uksId, packageDetails: PackageDetails });
            const response = await axios.post('https://uksinfotechsolution.in:8000/uks/savePackageDetails', { uksId, packageDetails: PackageDetails });
            if (response.status === 200) {
                setModalMessage('Package details saved successfully.');
                setModalType('success');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
                setEditingMode(false); // Exit edit mode after saving
            }
        } catch (error) {
            console.error('Error saving package details:', error);
            setModalMessage('Error saving package details.');
            setModalType('error');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
        }
    };

    const addInputBox = (index) => {
        const updatedPackageDetails = [...PackageDetails];
        updatedPackageDetails[index].additionalInputs = updatedPackageDetails[index].additionalInputs || [];
        updatedPackageDetails[index].additionalInputs.push({ value: '' });
        setPackageDetails(updatedPackageDetails);
    };

    const handleInputBoxChange = (packageIndex, inputIndex, event) => {
        const { value } = event.target;
        const updatedPackageDetails = [...PackageDetails];
        updatedPackageDetails[packageIndex].additionalInputs[inputIndex].value = value; // Update 'value' field instead of 'InputStatus'
        setPackageDetails(updatedPackageDetails);
    };


    const removeInputBox = (packageIndex, inputIndex) => {
        const updatedPackageDetails = [...PackageDetails];
        updatedPackageDetails[packageIndex].additionalInputs.splice(inputIndex, 1);
        setPackageDetails(updatedPackageDetails);
    };

    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>

                <Row className="dsa-detail-view-header-row" style={{ padding: '10px' }}>
                    <Row style={{ alignItems: 'center' }}>
                        <Col>
                            <h5>Package Details:</h5>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            {!editingMode && (
                                <Button style={{ width: "80px" }} onClick={() => setEditingMode(true)}>Edit</Button>
                            )}
                        </Col>
                    </Row>
                    <>
                        <Row className='profile-address-single-row'>
                            <Col><span className="profile-finance">Package Name</span></Col>
                            <Col><span className="profile-finance">Package Amount</span></Col>
                            <Col lg={2}><span className="profile-finance">Select Loan Types</span></Col>
                            <Col><span className="profile-finance">Download Access</span></Col>
                            <Col><span className="profile-finance">Validity</span></Col>
                            <Col><span className="profile-finance">View Loan Amount </span></Col>
                            <Col><span className="profile-finance">Comparison </span></Col>
                            <Col><span className="profile-finance">Package Status</span></Col>
                            {editingMode && (
                                <>
                                    <Col><span className="profile-finance">Additional Input </span></Col>
                                    <Col><span className="profile-finance">Delete</span></Col>
                                </>
                            )}
                        </Row>
                        {PackageDetails.map((packageDetail, index) => (
                            <Row key={packageDetail._id || index} className='profile-address-single-row previous-package-delete'>
                                <Col><input disabled={!editingMode} className="input-box-address" placeholder='Package Name' name="packageName" type="text" value={packageDetail.packageName || ''} onChange={(e) => handlePackageChange(index, 'packageName', e.target.value)} /></Col>
                                <Col><input disabled={!editingMode} className="input-box-address" name="packageAmount" placeholder='Package Amount' type="text" value={packageDetail.packageAmount || ''} onChange={(e) => handlePackageChange(index, 'packageAmount', e.target.value)} /></Col>

                                <Col lg={2}>
                                    <Select
                                        isMulti
                                        options={loanTypes}
                                        value={loanTypes.filter(type => packageDetail.loanTypes.includes(type.value))}
                                        onChange={(selectedOptions) => handleLoanTypeChange(index, selectedOptions)}
                                        isDisabled={!editingMode}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        components={{
                                            MultiValueLabel: ({ data }) => (
                                                <div>{data.label}</div>
                                            ),
                                            // Add other components as needed
                                        }}
                                    />

                                </Col>

                                <Col><input disabled={!editingMode} className="input-box-address" placeholder='Download Access' name="downloadAccess" type="number" value={packageDetail.downloadAccess || ''} onChange={(e) => handlePackageChange(index, 'downloadAccess', e.target.value)} /></Col>
                                <Col><input disabled={!editingMode} className="input-box-address" placeholder='Days' name="validity" type="number" value={packageDetail.validity || ''} onChange={(e) => handlePackageChange(index, 'validity', e.target.value)} /></Col>
                                <Col>
                                    <input
                                        disabled={!editingMode}
                                        className="input-box-address"
                                        placeholder='Amount'
                                        name="amount"
                                        type="number"
                                        value={packageDetail.amount || ''}
                                        onChange={(e) => handleAmountChange(e, index)}
                                    />
                                </Col>
                                <Col>
                                    <Form.Select
                                        className="input-box-compare"
                                        name="comparison"
                                        onChange={(e) => handlePackageChange(index, 'comparison', e.target.value)}
                                        value={packageDetail.comparison || ''}
                                    >
                                        <option value="greater">Greater than</option>
                                        <option value="less">Less than</option>
                                        <option value="both">Both</option>
                                    </Form.Select>
                                </Col>
                                <Col>
                                    {editingMode ? (
                                        <select className="input-box-address" name="packageStatus" value={packageDetail.packageStatus || 'Active'} onChange={(e) => handlePackageChange(index, 'packageStatus', e.target.value)}>
                                            <option value="Active">Active</option>
                                            <option value="Inactive">Inactive</option>
                                        </select>
                                    ) : (
                                        <input disabled={!editingMode} className="input-box-address" placeholder='Add On Pack' value={packageDetail.packageStatus || ''} />
                                    )}
                                </Col>
                                {editingMode && (
                                    <Col>
                                        <Button onClick={() => addInputBox(index)}>Add Input</Button>
                                    </Col>
                                )}

                                {editingMode && (
                                    <Col lg={1} style={{ textAlign: 'center' }}>
                                        <IoCloseSharp
                                            style={{ color: 'red', cursor: 'pointer' }}
                                            size={30}
                                            onClick={() => deletePackageRow(index, packageDetail._id)}
                                        />
                                    </Col>
                                )}

                                {packageDetail.additionalInputs && packageDetail.additionalInputs.map((input, inputIndex) => (
                                    <Row className="profile-address-single-row" style={{ marginTop: '5px' }} key={inputIndex}>
                                        <Col lg={5}>
                                            <input
                                                style={{ height: '50px' }}
                                                disabled={!editingMode}
                                                className="input-box-address"
                                                placeholder='Additional Input'
                                                value={input.value}
                                                onChange={(e) => handleInputBoxChange(index, inputIndex, e)}
                                            />
                                        </Col>
                                        <Col lg={2}>
                                            {/* Assuming you want to render InputStatus as a dropdown */}
                                            {editingMode ? (
                                                <select
                                                    style={{ height: '50px' }}
                                                    className="input-box-address"
                                                    name="InputStatus"
                                                    value={input.InputStatus || 'Active'} // Default or initial value
                                                    onChange={(e) => handleInputBoxChange(index, inputIndex, e)}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            ) : (
                                                <input
                                                    style={{ height: '50px' }}
                                                    disabled={!editingMode}
                                                    className="input-box-address"
                                                    placeholder='Input Status'
                                                    value={input.InputStatus || ''}
                                                />
                                            )}
                                        </Col>
                                        {editingMode && (
                                            <Col lg={1} style={{ textAlign: 'center' }}>
                                                <IoCloseSharp
                                                    style={{ color: 'red', cursor: 'pointer' }}
                                                    size={30}
                                                    onClick={() => removeInputBox(index, inputIndex)}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                            </Row>

                        ))}
                        {editingMode && (
                            <Row>

                                <Col>
                                    <Button style={{ marginTop: "10px", width: "200px" }} onClick={addPackageRow}>Add Package</Button>
                                </Col>
                                <Col className="d-flex justify-content-end">
                                    <Button style={{ marginTop: "10px", width: "200px" }} onClick={handlePackageSave}>Save</Button>
                                </Col>
                            </Row>
                        )}
                    </>
                </Row>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalType === 'success' ? 'Success' : 'Error'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ color: modalType === 'success' ? 'green' : 'red' }}>
                        {modalMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </Container>

        </>
    );
};

export default Pricing_Details;
