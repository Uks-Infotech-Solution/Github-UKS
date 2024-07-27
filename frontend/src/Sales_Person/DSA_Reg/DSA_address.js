import React, { useState, useEffect } from 'react';
import { Button, Col, Row, Form } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate} from 'react-router-dom';
import { Country, State, City } from "country-state-city";

function DSA_address({onSuccess,dsaId }) {

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
        }
    }, [editingModeAddress, dsaId]);

    useEffect(() => {
        if (dsaId) {
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
<<<<<<< HEAD
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/address', {
=======
            const response = await axios.post('https://localhost:8000/api/dsa/address', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
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
            onSuccess();
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
                </Row>
                <Col className="profile-address-col">
                    <Row>
                        <div className="profile-aadhar-per-head">Permanent Address</div>
                    </Row>
                    <Row className="profile-address-single-row" style={{ paddingTop: '25px' }}>
                        <Col lg={3}>
                            <span className="customer-sentence">State</span>
                        </Col>
                        <Col>
                            <Select
                                name="aadharState"
                                options={statesList}
                                value={statesList.find(state => state.value === addressDetails.aadharState)}
                                onChange={option => handleStateChange(option, 'aadharState')}
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
                            />
                        </Col>
                    </Row>
                </Col>
                <Col className="profile-address-col">
                    <Row className="mb-3">
                        <Col>
                        <Row style={{ padding: '0px' }}><div className="profile-aadhar-per-head">Billing Address</div></Row>

                            <div className="d-flex align-items-center">
                                <Form.Check
                                    type="checkbox"
                                    label="Same as Permanent Address"
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
                                isDisabled={isSameAddress }
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
                                isDisabled={isSameAddress }
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
                                isDisabled={isSameAddress }
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
                                disabled={isSameAddress }
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
                                disabled={isSameAddress }
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
                                disabled={isSameAddress}
                                required
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col>
                    
                        <Button onClick={handleUpdateClick} className="me-2">Submit Address</Button>
                    
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </Col>

            </Row>
        </div>
    );
};

export default DSA_address;
