import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Country, State, City } from "country-state-city";

const Customer_AddressForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};

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
    const [aadharCitiesList, setAadharCitiesList] = useState([]);
    const [permanentCitiesList, setPermanentCitiesList] = useState([]);
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
        if (editingModeAddress && customerId) {
            fetchAddressDetails();
        }
    }, [editingModeAddress, customerId]);

    useEffect(() => {
        if (customerId) {
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
    }, [customerId]);

    // Function to fetch address details from API
    const fetchAddressDetails = async () => {
        try {
            const response = await axios.get(`https://uksinfotechsolution.in:8000/view-address?customerId=${customerId}`);
            const fetchedAddress = response.data;
            // console.log(response.data);

            if (fetchedAddress.aadharState) {
                const updatedAadharCities = City.getCitiesOfState('IN', fetchedAddress.aadharState).map(city => ({
                    label: city.name,
                    value: city.name
                }));
                setAadharCitiesList(updatedAadharCities);
            }

            if (fetchedAddress.permanentState) {
                const updatedPermanentCities = City.getCitiesOfState('IN', fetchedAddress.permanentState).map(city => ({
                    label: city.name,
                    value: city.name
                }));
                setPermanentCitiesList(updatedPermanentCities);
            }

            setAddressDetails(fetchedAddress);
            setInitialAddressDetails(fetchedAddress); // Store initial address details for cancel action
        } catch (error) {
            // console.error('Error fetching address details:', error);
            // Handle error fetching address details
        }
    };

    const handleStateChange = (selectedOption, fieldPrefix) => {
        const updatedCities = City.getCitiesOfState('IN', selectedOption.value).map(city => ({
            label: city.name,
            value: city.name
        }));

        if (fieldPrefix === 'aadharState') {
            setAadharCitiesList(updatedCities);
        } else if (fieldPrefix === 'permanentState') {
            setPermanentCitiesList(updatedCities);
        }

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
            const response = await axios.post('https://uksinfotechsolution.in:8000/add-address', {
                customerId: customerId,
                address: {
                    aadharState: addressDetails.aadharState,
                    aadharDistrict: addressDetails.aadharDistrict,
                    aadharCity: addressDetails.aadharCity,
                    aadharStreet: addressDetails.aadharStreet,
                    aadharDoorNo: addressDetails.aadharDoorNo,
                    aadharZip: addressDetails.aadharZip,
                    permanentState: addressDetails.permanentState,
                    permanentDistrict: addressDetails.permanentDistrict,
                    permanentCity: addressDetails.permanentCity,
                    permanentStreet: addressDetails.permanentStreet,
                    permanentDoorNo: addressDetails.permanentDoorNo,
                    permanentZip: addressDetails.permanentZip
                }
            });
            console.log(response.data); // Log response data
            alert("Address updated successfully"); // Set success message
            setEditingModeAddress(false); // Exit editing mode after successful update
    window.location.reload();

        } catch (error) {
            console.error('Error updating address:', error);
            alert("Error updating address");
            // Handle error updating address
        }
    };

    const handleCancelClick = () => {
        setAddressDetails(initialAddressDetails); // Restore initial address details
        setEditingModeAddress(false); // Exit editing mode without saving changes
    };

    const handleCheckboxChange = () => {
        setIsSameAddress(!isSameAddress);
        if (!isSameAddress) {
            // Copy Aadhaar address to permanent address
            setAddressDetails(prevState => ({
                ...prevState,
                permanentState: prevState.aadharState,
                permanentDistrict: prevState.aadharDistrict,
                permanentCity: prevState.aadharCity,
                permanentStreet: prevState.aadharStreet,
                permanentDoorNo: prevState.aadharDoorNo,
                permanentZip: prevState.aadharZip
            }));
            const updatedPermanentCities = City.getCitiesOfState('IN', addressDetails.aadharState).map(city => ({
                label: city.name,
                value: city.name
            }));
            setPermanentCitiesList(updatedPermanentCities);
        } else {
            // Clear permanent address fields
            setAddressDetails(prevState => ({
                ...prevState,
                permanentState: '',
                permanentDistrict: '',
                permanentCity: '',
                permanentStreet: '',
                permanentDoorNo: '',
                permanentZip: ''
            }));
            setPermanentCitiesList([]);
        }
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
                                style={{ width: "80px", marginTop: "-5px" }}
                                onClick={handleEditClick}
                            >
                                Edit
                            </Button>
                        </Col>
                    )}
                </Row>
                <Col className="profile-address-col">
                    <Row>
                        <div className="profile-aadhar-per-head">Aadhar Address</div>
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
                                options={aadharCitiesList}
                                value={aadharCitiesList.find(city => city.value === addressDetails.aadharDistrict)}
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
                                options={aadharCitiesList}
                                value={aadharCitiesList.find(city => city.value === addressDetails.aadharCity)}
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
                            <span className="customer-sentence">Door Number</span>
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
                            <span className="customer-sentence">Pin code</span>
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
                    <div className="d-flex align-items-center ">
                        <span className="profile-aadhar-per-head">Permanent Address</span>
                        <Form.Check
                            type="checkbox"
                            className="profile-aadhar-per-head"
                            label="Same as Aadhaar"
                            checked={isSameAddress}
                            onChange={handleCheckboxChange}
                            disabled={!editingModeAddress}
                        />

                    </div>

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
                                name="permanentDistrict"
                                options={permanentCitiesList}
                                value={permanentCitiesList.find(city => city.value === addressDetails.permanentDistrict)}
                                onChange={option => handleCityChange(option, 'permanentDistrict')}
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
                                name="permanentCity"
                                options={permanentCitiesList}
                                value={permanentCitiesList.find(city => city.value === addressDetails.permanentCity)}
                                onChange={option => handleCityChange(option, 'permanentCity')}
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
                                name="permanentStreet"
                                type="text"
                                value={addressDetails.permanentStreet}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Door Number</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="permanentDoorNo"
                                type="text"
                                value={addressDetails.permanentDoorNo}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                    <Row className="profile-address-single-row">
                        <Col lg={3}>
                            <span className="customer-sentence">Pin code</span>
                        </Col>
                        <Col>
                            <input
                                className="input-box-address"
                                name="permanentZip"
                                type="text"
                                value={addressDetails.permanentZip}
                                onChange={handleAddressChange}
                                disabled={!editingModeAddress}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row >

            {editingModeAddress && (
                <Row>
                    <Col className="d-flex ">
                        <Button
                            style={{ width: "80px", marginTop: "10px", marginRight: "10px" }}
                            onClick={handleUpdateClick}
                        >
                            Update
                        </Button>
                        <Button
                            style={{ width: "80px", marginTop: "10px" }}
                            onClick={handleCancelClick}
                        >
                            Cancel
                        </Button>
                    </Col>
                </Row>
            )}

            {/* Display success message */}
            {
                successMessage && (
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )
            }
        </div >
    );
};

export default Customer_AddressForm;
