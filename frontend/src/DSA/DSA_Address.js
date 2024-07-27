import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Country, State, City } from "country-state-city";

const DSA_AddressForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};

    const [addressDetails, setAddressDetails] = useState({
        aadharState: '',
        aadharDistrict: '',
        aadharCity: '',
        aadharStreet: '',
        aadharDoorNo: '',
        aadharZip: '',
        permanentState: '',
        permanentDistrict: '',
        permanentCity: '',
        permanentStreet: '',
        permanentDoorNo: '',
        permanentZip: ''
    });

    const [initialAddressDetails, setInitialAddressDetails] = useState(null); // To store initial address details for cancel action

    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [editingModeAddress, setEditingModeAddress] = useState(false); // Initially set to false for viewing mode
    // Dummy success message state for demonstration
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const updatedStates = State.getStatesOfCountry('IN').map(state => ({
            label: state.name,
            value: state.isoCode
        }));
        setStatesList(updatedStates);
    }, []);

    useEffect(() => {
        if (editingModeAddress && dsaId) {
            fetchAddressDetails();
        }
    }, [editingModeAddress, dsaId]);

    useEffect(() => {
        if (dsaId) {
            fetchAddressDetails();
        } else {
            // Initialize address details with empty values or null
            setAddressDetails({
                aadharState: '',
                aadharDistrict: '',
                aadharCity: '',
                aadharStreet: '',
                aadharDoorNo: '',
                aadharZip: '',
                permanentState: '',
                permanentDistrict: '',
                permanentCity: '',
                permanentStreet: '',
                permanentDoorNo: '',
                permanentZip: ''
            });
        }
    }, [dsaId]);
    // Function to fetch address details from API
    const fetchAddressDetails = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/address?dsaId=${dsaId}`);
            const fetchedAddress = response.data;
            console.log(response.data);
            if (fetchedAddress.aadharAddress.state) {
                const updatedCities = City.getCitiesOfState('IN', fetchedAddress.aadharAddress.state).map(city => ({
                    label: city.name,
                    value: city.name
                }));
                setCitiesList(updatedCities);
            }
            setAddressDetails({
                aadharState: fetchedAddress.aadharAddress.state || '',
                aadharDistrict: fetchedAddress.aadharAddress.district || '',
                aadharCity: fetchedAddress.aadharAddress.city || '',
                aadharStreet: fetchedAddress.aadharAddress.area || '',
                aadharDoorNo: fetchedAddress.aadharAddress.doorNo || '',
                aadharZip: fetchedAddress.aadharAddress.postalCode || '',
                permanentState: fetchedAddress.permanentAddress.state || '',
                permanentDistrict: fetchedAddress.permanentAddress.district || '',
                permanentCity: fetchedAddress.permanentAddress.city || '',
                permanentStreet: fetchedAddress.permanentAddress.area || '',
                permanentDoorNo: fetchedAddress.permanentAddress.doorNo || '',
                permanentZip: fetchedAddress.permanentAddress.postalCode || ''
                
            });
        } catch (error) {
            console.error('Error fetching address details:', error);
            // Handle error fetching address details
        }
    };
    const handleStateChange = (selectedOption, fieldPrefix) => {
        const updatedCities = City.getCitiesOfState('IN', selectedOption.value).map(city => ({
            label: city.name,
            value: city.name
        }));
        setCitiesList(updatedCities);

        setAddressDetails(prevState => ({
            ...prevState,
            [`${fieldPrefix}`]: selectedOption.value,
            [`${fieldPrefix}District`]: '',
            [`${fieldPrefix}City`]: ''
        }));
    };

    const handleCityChange = (selectedOption, fieldPrefix) => {
        setAddressDetails(prevState => ({
            ...prevState,
            [`${fieldPrefix}`]: selectedOption.value
        }));
    };

    const handleAddressChange = e => {
        const { name, value } = e.target;
        setAddressDetails(prevState => ({
            ...prevState,
            [name]: value
        }));

        // If addresses are same, sync permanent address fields with aadhar address fields
        if (isSameAddress && name.startsWith('aadhar')) {
            const permanentField = name.replace('aadhar', 'permanent');
            setAddressDetails(prevState => ({
                ...prevState,
                [permanentField]: value
            }));
        }
    };

    const handleEditClick = () => {
        setEditingModeAddress(true);
    };

    const handleUpdateClick = async () => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/address', {
                dsaId: dsaId,
                aadharAddress: {
                    state: addressDetails.aadharState,
                    district: addressDetails.aadharDistrict,
                    city: addressDetails.aadharCity,
                    area: addressDetails.aadharStreet,
                    doorNo: addressDetails.aadharDoorNo,
                    postalCode: addressDetails.aadharZip
                },
                permanentAddress: {
                    state: addressDetails.permanentState,
                    district: addressDetails.permanentDistrict,
                    city: addressDetails.permanentCity,
                    area: addressDetails.permanentStreet,
                    doorNo: addressDetails.permanentDoorNo,
                    postalCode: addressDetails.permanentZip
                }
            });
            console.log(response.data); // Log response data
            setSuccessMessage('Address updated successfully');
            alert("Address updated successfully") // Set success message
            setEditingModeAddress(false); // Exit editing mode after successful update
        } catch (error) {
            console.error('Error updating address:', error);
            alert("Error updating address") 
            // Handle error updating address
        }
    };

    const handleCancelClick = () => {
        setAddressDetails(initialAddressDetails); // Restore initial address details
        setEditingModeAddress(false); // Exit editing mode without saving changes
    };

    return (
        <div >
            <Row style={{ paddingLeft: '0px' }}>
                <Row style={{ padding: '10px', alignItems: 'center' }}>
                    <Col>
                        <h6>Address Details</h6>
                    </Col>
                    {!editingModeAddress && (
                        <Col className="d-flex justify-content-end">
                            <Button 
                            style={{ width: "80px", marginTop: "-5px" }} onClick={handleEditClick}>Edit</Button>
                        </Col>
                    )}
                </Row>
                <Col className="profile-address-col">
                    <Row>
                        <div className="profile-aadhar-per-head">Permanent Address</div>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">State</span>
                        </Col>
                        <Col>
                            <Select
                                name="aadharState"
                                options={statesList}
                                value={statesList.find(state => state.value === addressDetails.aadharState)}
                                onChange={option => handleStateChange(option, 'aadharState')}
                                isDisabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">District</span>
                        </Col>
                        <Col>
                            <Select
                                name="aadharDistrict"
                                options={citiesList}
                                value={citiesList.find(city => city.value === addressDetails.aadharDistrict)}
                                onChange={option => handleCityChange(option, 'aadharDistrict')}
                                isDisabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">City</span>
                        </Col>
                        <Col>
                            <Select
                                name="aadharCity"
                                options={citiesList}
                                value={citiesList.find(city => city.value === addressDetails.aadharCity)}
                                onChange={option => handleCityChange(option, 'aadharCity')}
                                isDisabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Area</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="aadharStreet"
                                type="text"
                                value={addressDetails.aadharStreet}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Door No</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="aadharDoorNo"
                                type="text"
                                value={addressDetails.aadharDoorNo}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Postal Code</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="aadharZip"
                                type="text"
                                value={addressDetails.aadharZip}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="profile-address-col">
                    <Row className="mb-3">
                        <Col>
                            <div className="d-flex align-items-center">
                                <span className="profile-aadhar-per-head">Billing Address</span>
                                <Form.Check
                                    type="checkbox"
                                    label="Same as Permanent     Address"
                                    checked={isSameAddress}
                                    onChange={() => {
                                        setIsSameAddress(!isSameAddress);
                                        if (!isSameAddress) {
                                            setAddressDetails({
                                                ...addressDetails,
                                                permanentState: addressDetails.aadharState,
                                                permanentDistrict: addressDetails.aadharDistrict,
                                                permanentCity: addressDetails.aadharCity,
                                                permanentStreet: addressDetails.aadharStreet,
                                                permanentDoorNo: addressDetails.aadharDoorNo,
                                                permanentZip: addressDetails.aadharZip
                                            });
                                        } else {
                                            setAddressDetails({
                                                ...addressDetails,
                                                permanentState: '',
                                                permanentDistrict: '',
                                                permanentCity: '',
                                                permanentStreet: '',
                                                permanentDoorNo: '',
                                                permanentZip: ''
                                            });
                                        }
                                    }}
                                    className="ms-2"
                                    disabled={!editingModeAddress}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">State</span>
                        </Col>
                        <Col>
                            <Select
                                name="permanentState"
                                options={statesList}
                                value={statesList.find(state => state.value === addressDetails.permanentState)}
                                onChange={option => handleStateChange(option, 'permanentState')}
                                isDisabled={isSameAddress || !editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">District</span>
                        </Col>
                        <Col>
                            <Select
                                name="permanentDistrict"
                                options={citiesList}
                                value={citiesList.find(city => city.value === addressDetails.permanentDistrict)}
                                onChange={option => handleCityChange(option, 'permanentDistrict')}
                                isDisabled={isSameAddress || !editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">City</span>
                        </Col>
                        <Col>
                            <Select
                                name="permanentCity"
                                options={citiesList}
                                value={citiesList.find(city => city.value === addressDetails.permanentCity)}
                                onChange={option => handleCityChange(option, 'permanentCity')}
                                isDisabled={isSameAddress || !editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Area</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="permanentStreet"
                                type="text"
                                value={addressDetails.permanentStreet}
                                onChange={handleAddressChange}
                                disabled={isSameAddress || !editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Door No</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="permanentDoorNo"
                                type="text"
                                value={addressDetails.permanentDoorNo}
                                onChange={handleAddressChange}
                                disabled={isSameAddress || !editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Postal Code</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="permanentZip"
                                type="text"
                                value={addressDetails.permanentZip}
                                onChange={handleAddressChange}
                                disabled={isSameAddress || !editingModeAddress}
                                required
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    {editingModeAddress && (
                        <Button onClick={handleUpdateClick} className="me-2">Update Address</Button>
                    )}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </Col>

            </Row>
        </div>
    );
};

export default DSA_AddressForm;
