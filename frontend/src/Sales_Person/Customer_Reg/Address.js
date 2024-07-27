import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { Country, State, City } from "country-state-city";
import Select from 'react-select';

function Address({ onSuccess, customerId }) {
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [addressDetails, setAddressDetails] = useState({});
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);

    useEffect(() => {
        const updatedStates = State.getStatesOfCountry('IN').map(state => ({
            label: state.name,
            value: state.isoCode
        }));
        setStatesList(updatedStates);
    }, []);

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

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressDetails(prevState => {
            const updatedAddress = { ...prevState, [name]: value };

            if (isSameAddress && name.startsWith('aadhar')) {
                const permanentField = name.replace('aadhar', 'permanent');
                updatedAddress[permanentField] = value;
            }

            return updatedAddress;
        });
    };

    const handleCityChange = (selectedOption, fieldPrefix) => {
        setAddressDetails(prevState => ({
            ...prevState,
            [`${fieldPrefix}`]: selectedOption.value
        }));
    };

    const validateAddressDetails = () => {
        const fields = [
            'aadharState', 'aadharDistrict', 'aadharCity', 'aadharStreet', 'aadharDoorNo', 'aadharZip',
            'permanentState', 'permanentDistrict', 'permanentCity', 'permanentStreet', 'permanentDoorNo', 'permanentZip'
        ];

        for (let field of fields) {
            if (!addressDetails[field]) {
                return false;
            }
        }
        return true;
    };

    // ADDRESS SAVING
    const handleAddressSave = async () => {
        if (!validateAddressDetails()) {
            alert('Please fill out all required fields.');
            return;
        }
        try {
            await axios.post(`https://uksinfotechsolution.in:8000/add-address`, {
                customerId: customerId, // Replace with actual customerId logic
                address: addressDetails,
            });
            alert('Address saved successfully');
            onSuccess(); // Call onSuccess to switch to the next tab
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };

    return (
        <>
            <Container fluid>
                <Row className="">
                    <Row style={{ paddingLeft: '0px' }}>
                        <Col className="" style={{ paddingTop: '10px' }}>
                            <Row style={{ paddingBottom: '35px' }}><div className="profile-aadhar-per-head">Aadhar Address</div></Row>
                            <Row className="">
                                <Col lg={4}><span className="customer-sentence">State</span></Col>
                                <Col>
                                    <Select
                                        name="aadharState"
                                        options={statesList}
                                        value={statesList.find(state => state.value === addressDetails.aadharState)}
                                        onChange={(option) => handleStateChange(option, 'aadharState')}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">District</span></Col>
                                <Col>
                                    <Select
                                        name="aadharDistrict"
                                        options={citiesList}
                                        value={citiesList.find(city => city.value === addressDetails.aadharDistrict)}
                                        onChange={(option) => handleCityChange(option, 'aadharDistrict')}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">City</span></Col>
                                <Col>
                                    <Select
                                        name="aadharCity"
                                        options={citiesList}
                                        value={citiesList.find(city => city.value === addressDetails.aadharCity)}
                                        onChange={(option) => handleCityChange(option, 'aadharCity')}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Area</span></Col>
                                <Col><input className="input-box-address" name="aadharStreet" type="text" value={addressDetails.aadharStreet} onChange={handleAddressChange} /></Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Door No</span></Col>
                                <Col><input className="input-box-address" name="aadharDoorNo" type="text" value={addressDetails.aadharDoorNo} onChange={handleAddressChange} /></Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Postal Code</span></Col>
                                <Col><input className="input-box-address" name="aadharZip" type="text" value={addressDetails.aadharZip} onChange={handleAddressChange} /></Col>
                            </Row>
                        </Col>
                        <Col className="profile-address-col">
                            <Row className="mb-3">
                                <Col>
                                    <Row style={{ padding: '0px' }}><div className="profile-aadhar-per-head">Permanent Address</div></Row>
                                    <div className="d-flex align-items-center">
                                        <Form.Check
                                            type="checkbox"
                                            label="Same as Aadhaar Address"
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
                                <Col lg={4}><span className="customer-sentence">State</span></Col>
                                <Col>
                                    <Select
                                        name="permanentState"
                                        options={statesList}
                                        value={statesList.find(state => state.value === addressDetails.permanentState)}
                                        onChange={(option) => handleStateChange(option, 'permanentState')}
                                        isDisabled={isSameAddress}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">District</span></Col>
                                <Col>
                                    <Select
                                        name="permanentDistrict"
                                        options={citiesList}
                                        value={citiesList.find(city => city.value === addressDetails.permanentDistrict)}
                                        onChange={(option) => handleCityChange(option, 'permanentDistrict')}
                                        isDisabled={isSameAddress}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">City</span></Col>
                                <Col>
                                    <Select
                                        name="permanentCity"
                                        options={citiesList}
                                        value={citiesList.find(city => city.value === addressDetails.permanentCity)}
                                        onChange={(option) => handleCityChange(option, 'permanentCity')}
                                        isDisabled={isSameAddress}
                                    />
                                </Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Area</span></Col>
                                <Col><input className="input-box-address" name="permanentStreet" type="text" value={addressDetails.permanentStreet} onChange={handleAddressChange} disabled={isSameAddress} /></Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Door No</span></Col>
                                <Col><input className="input-box-address" name="permanentDoorNo" type="text" value={addressDetails.permanentDoorNo} onChange={handleAddressChange} disabled={isSameAddress} /></Col>
                            </Row>
                            <Row className="profile-address-single-row">
                                <Col lg={4}><span className="customer-sentence">Postal Code</span></Col>
                                <Col><input className="input-box-address" name="permanentZip" type="text" value={addressDetails.permanentZip} onChange={handleAddressChange} disabled={isSameAddress} /></Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={4} className="customer-apply-loan-box-button">
                            <Button className="profile-edit-button" onClick={handleAddressSave}>Save Address</Button>
                        </Col>
                    </Row>
                </Row>
            </Container>
        </>
    );
}

export default Address;
