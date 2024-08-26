import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import '../Customer-Dashboard/Customer-Profile/Basic_View.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import '../Customer-Dashboard/Customer-Profile/Profile_Download.css';
import { useLocation } from 'react-router-dom';
import { Country, State, City } from "country-state-city";



function Outer_Customer_View() {

    const location = useLocation();
    const customerId = location.state?.customerId;

    // console.log("DSA ID:", dsaId);
    // console.log("Customer ID:", customerId);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [addressDetails, setAddressDetails] = useState({});
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [packages, setPackages] = useState([]);
    const [previousLoanDetails, setPreviousLoanDetails] = useState([{
        financeName: '',
        yearOfLoan: '',
        loanAmount: '',
        outstandingAmount: ''
    }]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [editingModeAddress, setEditingModeAddress] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const formatAmountWithCommas = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the amount
    };

    // BASIC DETAILS UPDATE
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId: customerId }
                });
                setCustomerDetails(response.data);
                // handleActivateAccount();
                setAddressDetails(response.data.address || {});
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer details:', error);
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [customerId, setCustomerDetails]);

    // LOAN PROCESSING
    const [loanProcessingDetails, setLoanProcessingDetails] = useState(null);

    const fetchLoanProcessingDetails = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-loan-processing', {
                params: { customerId: customerId }
            });
            setLoanProcessingDetails(response.data)
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Loan processing details not found
            } else {
                // console.error('Error fetching loan processing details:', error);
                // alert('Failed to fetch loan processing details');
            }
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchLoanProcessingDetails();
        }
    }, [customerId]);

    const fetchPreviousLoans = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-previous-loans', {
                params: { customerId: customerId }
            });
            setPreviousLoanDetails(response.data);
        } catch (error) {
            console.error('Error fetching previous loans:', error);
        }
    };

    useEffect(() => {
        fetchPreviousLoans();
    }, [customerId]);


    // ADDRESS INPUT UPDATE
    useEffect(() => {
        const updatedStates = State.getStatesOfCountry('IN').map(state => ({
            label: state.name,
            value: state.isoCode
        }));
        setStatesList(updatedStates);
    }, []);

    useEffect(() => {
        if (isSameAddress) {
            setAddressDetails(prevState => ({
                ...prevState,
                permanentState: prevState.aadharState,
                permanentDistrict: prevState.aadharDistrict,
                permanentCity: prevState.aadharCity,
                permanentStreet: prevState.aadharStreet,
                permanentDoorNo: prevState.aadharDoorNo,
                permanentZip: prevState.aadharZip,
            }));
        }
    }, [isSameAddress]);
    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                // console.log(`Fetching address details for customerId: ${customerId}`);
                const response = await axios.get(`https://uksinfotechsolution.in:8000/view-address`, {
                    params: { customerId: customerId }
                });
                if (response.data) {
                    setAddressDetails(response.data);
                    setEditingModeAddress(false);
                    if (response.data.aadharState) {
                        const updatedCities = City.getCitiesOfState('IN', response.data.aadharState).map(city => ({
                            label: city.name,
                            value: city.name
                        }));
                        setCitiesList(updatedCities);
                    }
                } else {
                    setEditingModeAddress(true);
                }
            } catch (error) {
                // console.error('Error fetching address details:', error);
                setEditingModeAddress(true);
            }
        };

        if (customerId) {
            fetchAddressDetails();
        }
    }, [customerId]);

    // SALARY 
    const [salariedPersons, setSalariedPersons] = useState([]);

    useEffect(() => {
        const fetchSalariedPersonDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/salariedperson', {
                    params: { customerId: customerId }
                });
                // console.log(response.data);
                if (response.status === 200) {
                    const data = response.data.salariedPersons;
                    const allValuesEmpty = data.length === 0 || data.every(person =>
                        !person.companyName && !person.role && !person.monthlySalary && !person.workExperience
                    );
                    setSalariedPersons(data);
                }
            } catch (error) {
                // alert("Error fetching Salaried Person details")
                console.error('Error fetching Salaried Person details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (customerId && customerDetails && customerDetails.customerType === 'Salaried Person') {
            fetchSalariedPersonDetails();
        }
    }, [customerId, customerDetails]);

    if (loading) {
        return <div>Null</div>;
    }

    if (!customerDetails) {
        return <div>Un defined error . Please try again or go to login page</div>
    }

    const packagesArray = Array.isArray(packages) ? packages : [packages];
    // console.log('packages:', packages);
    // console.log('Is packages an array?', Array.isArray(packages));
    return (
        <>
            <Container fluid style={{ padding: '10px' }}>
                <Row className="Section-1-Row" >
                    <Col className="New-Customer-container-second basic-view-col">
                        <h4>Customer Profile View</h4>
                        <hr />
                        <Row className='Section-1-Row'>
                            <Row className='Row1 view-row-size'>
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Customer No</span></Col>
                                <Col lg={2}><div className="box customer-data-font">UKS-CUS-{customerDetails.customerNo}</div></Col>
                            </Row >
                            <Row className='Row1 view-row-size'>
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Customer Type</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customerType}</div></Col>
                            </Row >

                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Title</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.title}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Gender</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.gender}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Type Of Loan</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.typeofloan}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Loan Required</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.loanRequired}</div></Col>
                            </Row>
                        </Row>

                        <hr />

                        <Row className="Section-1-Row three-tab-margin">
                            {previousLoanDetails[0]?.financeName !== 'No previous loan' && (
                                <Row>
                                    <p style={{ fontWeight: 'bold' }}>Previous Loan Details</p>
                                    <Col>
                                        <>
                                            <Row className='profile-address-single-row'>
                                                <Col><span className="profile-finance">Finance Name</span></Col>
                                                <Col><span className="profile-finance">Year of Loan</span></Col>
                                                <Col><span className="profile-finance">Loan Amount</span></Col>
                                                <Col><span className="profile-finance">Outstanding Amount</span></Col>
                                            </Row>

                                            {previousLoanDetails.map((loan, index) => (
                                                <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                                    <Col lg={3}>
                                                        <div className="input-box-address customer-data-font" style={{ wordWrap: 'true', borderStyle: 'solid', paddingLeft: '20px' }}>
                                                            {loan.financeName}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}>
                                                            {loan.yearOfLoan}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}>
                                                            {loan.loanAmount}
                                                        </div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}>
                                                            {loan.outstandingAmount}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </>
                                    </Col>
                                </Row>
                            )}
                            {customerDetails.customerType === 'Salaried Person' && (
                                <Row style={{ padding: '10px' }}>
                                    <Col>
                                        <>
                                            <p className="" style={{ fontWeight: 'bold' }}>Previous Company</p>
                                            <Row className='profile-address-single-row'>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Company Name</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Designation</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Monthly Salary</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>How Many Years of Work</span></Col>
                                            </Row>
                                            {salariedPersons.map((salaried, index) => (
                                                <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                                    <Col lg={3}>
                                                        <div
                                                            className="input-box-address customer-data-font" style={{ width: '', wordWrap: 'true', paddingLeft: '20px' }}
                                                        >{salaried.companyName}</div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div
                                                            className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}
                                                        >{salaried.role}</div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div
                                                            className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}
                                                        >{salaried.monthlySalary}</div>
                                                    </Col>
                                                    <Col lg={3}>
                                                        <div
                                                            className="input-box-address customer-data-font" style={{ wordWrap: 'true', paddingLeft: '20px' }}
                                                        >{salaried.workExperience}</div>
                                                    </Col>

                                                </Row>
                                            ))}
                                        </>
                                    </Col>
                                    <Row>
                                    </Row>
                                </Row>
                            )}
                            <Row>
                                <p style={{ fontWeight: 'bold' }}>Loan Processing Details</p>

                                <Row className='Row1 view-row-size'>
                                    <Col lg={3}>
                                        <span className="">IT Returns</span>
                                    </Col>
                                    <Col lg={2}>
                                        <div className="box customer-data-font" style={{ width: "100px" }}>
                                            {selectedOptions.length > 0 ? (
                                                loanProcessingDetails && loanProcessingDetails.itReturns && (
                                                    <span>
                                                        {loanProcessingDetails.itReturns.map((itReturn, index) => (
                                                            <span key={index}>
                                                                {itReturn}
                                                                {index < loanProcessingDetails.itReturns.length - 1 && <span>/</span>}
                                                            </span>
                                                        ))}
                                                    </span>
                                                )

                                            ) : (
                                                <span>
                                                    Null
                                                </span>
                                            )}
                                        </div>

                                    </Col>
                                </Row>

                                <Row className="Row1 view-row-size">
                                    <Col lg={3}><span className="">Check Bounds Status</span></Col>
                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.checkBounds}</div></Col>
                                </Row>
                                <Row className="Row1 view-row-size">
                                    <Col lg={3}><span className="">Customer Block Status</span></Col>
                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.blockStatus}</div></Col>
                                </Row>
                                <Row>
                                    <Col>

                                        <Row className="Row1 view-row-size">
                                            <Col lg={3}><span className="">Cibil Record</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{(loanProcessingDetails && loanProcessingDetails.cibilRecord) || 'Null '}</div></Col>
                                        </Row>
                                        {customerDetails.customerType === 'Business' && (
                                            <>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="">MSNE Reg.No</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.monthlyIncome}</div></Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={3}><span className="">GST No</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.gstNo}</div></Col>
                                                </Row>
                                            </>)}

                                    </Col>
                                </Row>
                            </Row>


                        </Row>

                    </Col>

                </Row >
            </Container >
        </>
    );
}

export default Outer_Customer_View;
