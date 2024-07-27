import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import './Basic_View.css'; // Import the CSS file for styling
import Select from 'react-select';
import { IoCloseSharp } from "react-icons/io5";
import { Country, State, City } from "country-state-city";
import { useNavigate } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import { Document, Page, View, Text, StyleSheet, pdf, Image } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import './Profile_Download.css';
import { FaDownload } from "react-icons/fa6";
import { MdHome, MdArrowForwardIos, MdEdit } from 'react-icons/md';
import CustomerTable from '../../Customer/Table/Table';
import { useLocation } from 'react-router-dom';


function Profile_View( ) {
    const homepage = () => {
        navigate('/customer');
    };
    const location = useLocation();
    const { customerId } = location.state || {};
    console.log({customerId});
    const [customerDetails, setCustomerDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [addressDetails, setAddressDetails] = useState({});
    const [isSameAddress, setIsSameAddress] = useState(false);
    const [statesList, setStatesList] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [isAccountDeleted, setIsAccountDeleted] = useState(false);
    const [previousLoanDetails, setPreviousLoanDetails] = useState([{
        financeName: '',
        yearOfLoan: '',
        loanAmount: '',
        outstandingAmount: ''
    }]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [activeTab, setActiveTab] = useState('details'); // Define the activeTab state
    const [editingModeAddress, setEditingModeAddress] = useState(false);
    const [salariedPersons, setSalariedPersons] = useState([]);
    const [salaryEdit, setSalaryEdit] = useState(false);

    const formatAmountWithCommas = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); // Add commas to the amount
    };

    // BASIC DETAILS UPDATE
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
=======
                const response = await axios.get('https://localhost:8000/customer-details', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                    params: {customerId: customerId }
                });
                setCustomerDetails(response.data);
                setAddressDetails(response.data.address || {});
                setLoading(false);
            } catch (error) {
                console.error('Error fetching customer details:', error);
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [customerId, setCustomerDetails]);

    const styles = StyleSheet.create({
        page: {
            padding: 10,
            flexDirection: 'column',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
        },
        fullcontainer: {
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            borderWidth: 2,
            padding: 30,
        },
        container: {
            marginBottom: 20,
        },
        headingmain: {
            fontSize: 15,
            fontWeight: 'bold',
            marginBottom: 20
        },
        heading: {
            fontSize: 13,
            fontWeight: 'bold',
            marginBottom: 10
        },
        row: {
            flexDirection: 'row',
            display: 'flex',
            marginBottom: 5,
        },
        label: {
            width: '30%',
            marginRight: 12,
            fontWeight: 'bold',
            fontSize: 11,
            flexShrink: 0,
            // maxWidth: '30%',
        },
        value: {
            fontSize: 10,
            marginLeft: 10,
            flexGrow: 1,
            maxWidth: '40%',

        },
        addressContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginBottom: 20,
        },
        addressSection: {
            marginRight: 10,
            boxSizing: 'border-box',
        },
        label2: {
            width: '40%',
            marginRight: 15,
            fontWeight: 'bold',
            fontSize: 11,
        },
        table: {
            display: 'table',
            width: 'auto',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderColor: '#bdbdbd',
            borderCollapse: 'collapse',
        },
        tableRow: {
            flexDirection: 'row',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderColor: '#bdbdbd',
        },
        tableHeader: {
            width: '25%',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderColor: '#bdbdbd',
            backgroundColor: '#f0f0f0',
            padding: 5,
            fontWeight: 'bold',
            fontSize: 12,
            wordWrap: true,
        },
        tableCell: {
            width: '25%',
            borderStyle: 'solid',
            borderWidth: 0.5,
            borderColor: '#bdbdbd',
            padding: 5,
            fontSize: 10,
            wordWrap: true,
        },
        image: {
            width: 100,
            height: 100,
            marginBottom: 10,
            position: 'absolute',
            marginLeft: '400px',
        },
        cibil: {
            position: 'absolute',
            marginLeft: '400px',
            marginTop: '110px',
            width: '30%',
            marginRight: 12,
            fontWeight: 'bold',
            fontSize: 11,
        },
        cibil2: {
            position: 'absolute',
            marginLeft: '455px',
            marginTop: '110px',
            fontSize: 10,
            wordWrap: true,
        },
        itvalue:{
            fontSize: 10,
            marginLeft: 10,
            flexGrow: 1,
            maxWidth: '80%',
        },
    });

    const genrepdf = async (customer) => {
        const doc = (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.fullcontainer}>
                        <View style={styles.container}>

                            {imageSrc && (
                                <Image style={styles.image} src={imageSrc}
                                />
                            )}
                            <Text style={styles.cibil}>Cibil Score</Text>
                            <Text style={styles.cibil2}>: {loanProcessingDetails?.cibilRecord}</Text>
                            <Text style={styles.headingmain} className='Main-head'>Customer Profile Report</Text>
                            <Text style={styles.heading} className='Main-head'>Customer Details</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Customer Type     </Text>
                                <Text style={styles.value}>:    UKS-CU-{customerDetails.customerNo}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Customer Type     </Text>
                                <Text style={styles.value}>:    {customerDetails.customerType}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Name</Text>
                                <Text style={styles.value}>:    {customerDetails.title}.{customerDetails.customerFname} {customerDetails.customerLname}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Gender</Text>
                                <Text style={styles.value}>:    {customerDetails.gender}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Mobile Number</Text>
                                <Text style={styles.value}>:    {customerDetails.customercontact}, {customerDetails.customeralterno}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Whatsapp Number</Text>
                                <Text style={styles.value}>:    {customerDetails.customerwhatsapp}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>E-Mail</Text>
                                <Text style={styles.value}>:    {customerDetails.customermailid}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Type Of Loan</Text>
                                <Text style={styles.value}>:    {customerDetails.typeofloan}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Loan Required</Text>
                                <Text style={styles.value}>:    {formatAmountWithCommas(customerDetails.loanRequired)}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Loan Level</Text>
                                <Text style={styles.value}>:    {formatAmountWithCommas(customerDetails.level)}</Text>
                            </View>
                        </View>
                        <View style={styles.addressContainer}>
                            <View style={styles.addressSection}>
                                <Text style={styles.heading}>Aadhar Address</Text>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>State</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharState}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>District</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharDistrict}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>City</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharCity}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Area</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharStreet}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Door No</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharDoorNo}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Postal Code</Text>
                                    <Text style={styles.value}>:    {addressDetails.aadharZip}</Text>
                                </View>
                            </View>
                            <View style={styles.addressSection}>
                                <Text style={styles.heading}>Permanent Address</Text>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>State</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentState}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>District</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentDistrict}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>City</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentCity}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Area</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentStreet}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Door No</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentDoorNo}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Text style={styles.label2}>Postal Code</Text>
                                    <Text style={styles.value}>:    {addressDetails.permanentZip}</Text>
                                </View>
                            </View>
                        </View>
                        {previousLoanDetails[0]?.financeName !== 'No previous loan' && (
                            <View style={styles.container}>
                                <Text style={styles.heading}>Previous Loan Details</Text>
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                        <Text style={styles.tableHeader}>Finance Name</Text>
                                        <Text style={styles.tableHeader}>Year of Loan</Text>
                                        <Text style={styles.tableHeader}>Loan Amount</Text>
                                        <Text style={styles.tableHeader}>Outstanding Amount</Text>
                                    </View>
                                    {previousLoanDetails.map((loan, index) => (
                                        <View style={styles.tableRow} key={index}>
                                            <Text style={styles.tableCell}>{loan.financeName}</Text>
                                            <Text style={styles.tableCell}>{loan.yearOfLoan}</Text>
                                            <Text style={styles.tableCell}>{loan.loanAmount}</Text>
                                            <Text style={styles.tableCell}>{loan.outstandingAmount}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        {customerDetails.customerType === 'Salaried Person' && (
                            <>
                                <View style={styles.container}>
                                    <Text style={styles.heading}>Salaried Persons Details</Text>
                                    <View style={styles.table}>
                                        <View style={styles.tableRow}>
                                            <Text style={styles.tableHeader}>Applicant Type</Text>
                                            <Text style={styles.tableHeader}>Applicant Name</Text>
                                            <Text style={styles.tableHeader}>Designation</Text>
                                            <Text style={styles.tableHeader}>Total Experience</Text>
                                        </View>
                                        {salariedPersons.map((salariedPerson, index) => (
                                            <View style={styles.tableRow} key={index}>
                                                <Text style={styles.tableCell}>{salariedPerson.companyName}</Text>
                                                <Text style={styles.tableCell}>{salariedPerson.role}</Text>
                                                <Text style={styles.tableCell}>{salariedPerson.monthlySalary}</Text>
                                                <Text style={styles.tableCell}>{salariedPerson.workExperience}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}
                        <View style={styles.container}>
                            <Text style={styles.heading}>Loan Processing Details</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>IT Returns</Text>
                                <Text style={styles.itvalue}>
                                    :    {loanProcessingDetails?.itReturns && loanProcessingDetails.itReturns.length > 0
                                        ? loanProcessingDetails.itReturns.join(' / ')
                                        : ''}
                                </Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Check Bounds Status</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.checkBounds}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Customer Block Status</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.blockStatus}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Customer File Status</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.fileStatus}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Loan</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.loanType}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Cibil Score</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.cibilRecord}</Text>
                            </View>
                            {customerDetails.customerType === 'Business' && (
                                <>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>Monthly Income</Text>
                                        <Text style={styles.value}>:    {loanProcessingDetails?.monthlyIncome}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>MSNE Reg.No</Text>
                                        <Text style={styles.value}>:    {loanProcessingDetails?.msneNo}</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Text style={styles.label}>GST No</Text>
                                        <Text style={styles.value}>:    {loanProcessingDetails?.gstNo}</Text>
                                    </View>
                                </>
                            )}
                            <View style={styles.row}>
                                <Text style={styles.label}>Document</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.documentStatus}</Text>
                            </View>

                            <View style={styles.row}>
                                <Text style={styles.label}>Document Type</Text>
                                <Text style={styles.value}>:    {loanProcessingDetails?.documentType}</Text>
                            </View>
                        </View>

                    </View>
                </Page>
            </Document>
        );

        const pdfBlob = await pdf(doc).toBlob();
        saveAs(pdfBlob, 'customer_profile_report.pdf');
    };
    // LOAN PROCESSING

    const [loanProcessingDetails, setLoanProcessingDetails] = useState(null);

    const fetchLoanProcessingDetails = async () => {
        try {
<<<<<<< HEAD
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-loan-processing', {
=======
            const response = await axios.get('https://localhost:8000/get-loan-processing', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                params: { customerId: customerId }
            });
            if (response.status === 200) {
                const data = response.data;

                // Check if all the values are empty or null or blank strings
                const allValuesEmpty = Object.values(data).every(
                    value => value === null || value === '' || (Array.isArray(value) && value.length === 0)
                );

                if (allValuesEmpty) {
                } else {
                    setLoanProcessingDetails(data);
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Loan processing details not found
            } else {
                console.error('Error fetching loan processing details:', error);
                alert('Failed to fetch loan processing details');
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
<<<<<<< HEAD
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-previous-loans', {
=======
            const response = await axios.get('https://localhost:8000/get-previous-loans', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
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

    // FETCH ADDRESS
  
    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                console.log(`Fetching address details for customerId: ${customerId}`);
<<<<<<< HEAD
                const response = await axios.get(`https://uksinfotechsolution.in:8000/view-address`, {
=======
                const response = await axios.get(`https://localhost:8000/view-address`, {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
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
                console.error('Error fetching address details:', error);
                setEditingModeAddress(true);
            }
        };

        if (customerId) {
            fetchAddressDetails();
        }
    }, [customerId]);
    const [imageSrc, setImageSrc] = useState(null);
    // Function to fetch profile picture

    const fetchProfilePicture = async (customerId) => {
        try {
<<<<<<< HEAD
            const response = await axios.get(`https://uksinfotechsolution.in:8000/api/profile/view-profile-picture?customerId=${customerId}`, {
=======
            const response = await axios.get(`https://localhost:8000/api/profile/view-profile-picture?customerId=${customerId}`, {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                responseType: 'arraybuffer'
            });
            const contentType = response.headers['content-type'];

            if (contentType && contentType.startsWith('image')) {
                const base64Image = `data:${contentType};base64,${btoa(
                    String.fromCharCode(...new Uint8Array(response.data))
                )}`;
                setImageSrc(base64Image);
                // setError(null);
            } else {
                // setError('Response is not an image');
                setImageSrc(null);
            }
        } catch (err) {
            console.error('Error retrieving profile picture:', err);
            // setError('Failed to load profile picture');
            setImageSrc(null);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchProfilePicture(customerId);
        }
    }, [customerId]);

    useEffect(() => {
        if (customerDetails?.customerType === 'Salaried Person') {
            const fetchSalariedPersonDetails = async () => {
                try {
<<<<<<< HEAD
                    const response = await axios.get('https://uksinfotechsolution.in:8000/salariedperson', {
=======
                    const response = await axios.get('https://localhost:8000/salariedperson', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                        params: { customerId: customerId }
                    });

                    if (response.status === 200) {
                        const data = response.data.salariedPersons;

                        const allValuesEmpty = data.length === 0 || data.every(person =>
                            !person.companyName && !person.role && !person.monthlySalary && !person.workExperience
                        );

                        if (allValuesEmpty) {
                            setSalaryEdit(true);
                        } else {
                            setSalariedPersons(data);
                            setSalaryEdit(false);
                        }
                    }
                } catch (error) {
                    alert("Error fetching Salaried Person details");
                    console.error('Error fetching Salaried Person details:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchSalariedPersonDetails();
        }
    }, [customerDetails?.customerType, customerId, activeTab]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customerDetails) {
        return <div>Un defined error . Please try again or go to login page</div>
    }
    return (
        <>
            <>
               
            </>
            <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <div style={{ paddingBottom: '18px' }}>
                    <div className='Customer-top-nav-div'>
                        <span className='Customer-top-navi-head'>Customer Profile Download</span>
                        |
                        <MdHome size={25} className='Customer-top-nav-home' onClick={homepage} />
                        <MdArrowForwardIos className='Customer-top-nav-arrow' />
                        <span className='Cutomer-top-navi'><a href='/customer' style={{ color: 'rgb(142, 143, 144)', textDecoration: 'none' }}>Pages</a>
                        </span>
                        <MdArrowForwardIos className='Customer-top-nav-arrow' />
                        <span className='Cutomer-top-navi'>Customer Profile Download</span>
                    </div>
                </div>
                <Row className="Section-1-Row" >
                    <Col className="New-Customer-container-second basic-view-col">
                        <Row >
                            <Col>
                                <div>
                                    <span className="basic-view-head">Customer Download</span>
                                </div>
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <a
                                        onClick={genrepdf}
                                        style={{
                                            textDecoration: 'none',
                                            color: 'blue',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Download Pdf
                                        <FaDownload
                                            onClick={genrepdf}
                                            style={{ marginLeft: '7px', cursor: 'pointer' }}
                                            size={20}
                                        />
                                    </a>

                                    {/* <button onClick={genrepdf} >Download pdf </button> */}
                                </div>
                            </Col>
                            <hr style={{ margin: "5px" }} />
                        </Row>
                        <Row className={`Upload-profile-row ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                            <div className='Upload-profile-div' style={{ paddingBottom: '30px' }}>
                                <h6 >Profile Picture</h6>
                                <div>
                                    {imageSrc ? (
                                        <img style={{ height: '150px', borderStyle: "solid", borderWidth: 'thin', padding: '1px' }} src={imageSrc} alt="Profile" />
                                    ) : (
                                        <div>Loading</div>
                                    )}
                                </div>
                            </div>
                            {loanProcessingDetails && loanProcessingDetails.cibilRecord ? (
                                <div style={{ textAlign: "center", fontWeight: "500", marginTop: "8px", color: "green" }}>
                                    Cibil Score: <span style={{ fontWeight: '400' }}>{loanProcessingDetails.cibilRecord}</span>
                                </div>
                            ) : null}
                        </Row>
                        <Row>
                            <Row className='Row1 view-row-size'>
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Customer No</span></Col>
                                <Col lg={2}><div className="box customer-data-font">UKS-CU-{customerDetails.customerNo}</div></Col>
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
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Primary Contact</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customerFname}</div></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customerLname}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Gender</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.gender}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Mobile Number</span></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customercontact}</div></Col>
                                <Col lg={2}><div className="box customer-data-font">{customerDetails.customeralterno}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Whatsapp Number</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.customerwhatsapp}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">E-Mail</span></Col>
                                <Col><div className=" box customer-data-font">{customerDetails.customermailid}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Type Of Loan</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.typeofloan}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Loan Required</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.loanRequired}</div></Col>
                            </Row>
                            <Row className="Row1 view-row-size">
                                <Col className='basic-col-width' lg={2}><span className="customer-sentence">Loan Level</span></Col>
                                <Col><div className="box customer-data-font">{customerDetails.level}</div></Col>
                            </Row>

                            {/* Display other customer details similarly */}
                        </Row>
                        <hr />
                        <Row className="Section-1-Row three-tab-margin">
                            <Row style={{ paddingLeft: '0px' }}>
                                <Col className="profile-address-col">
                                    <Row><div className="profile-aadhar-per-head">Aadhar Address</div></Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">State</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharState"
                                                options={statesList}
                                                value={statesList.find(state => state.value === addressDetails.aadharState)}
                                                onChange={(option) => handleStateChange(option, 'aadharState')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">District</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharDistrict"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.aadharDistrict)}
                                                onChange={(option) => handleCityChange(option, 'aadharDistrict')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">City</span></Col>
                                        <Col>
                                            <Select
                                                name="aadharCity"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.aadharCity)}
                                                onChange={(option) => handleCityChange(option, 'aadharCity')}
                                                isDisabled={!editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Area</span></Col>
                                        <Col><input className="input-box-address" name="aadharStreet" type="text" value={addressDetails.aadharStreet} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Door No</span></Col>
                                        <Col><input className="input-box-address" name="aadharDoorNo" type="text" value={addressDetails.aadharDoorNo} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Postal Code</span></Col>
                                        <Col><input className="input-box-address" name="aadharZip" type="text" value={addressDetails.aadharZip} onChange={handleAddressChange} disabled={!editingModeAddress} /></Col>
                                    </Row>
                                </Col>
                                <Col className="profile-address-col">
                                    <Row className="mb-3">
                                        <Col>
                                            <div className="d-flex align-items-center">
                                                <span className="profile-aadhar-per-head">Permanent Address</span>

                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">State</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentState"
                                                options={statesList}
                                                value={statesList.find(state => state.value === addressDetails.permanentState)}
                                                onChange={(option) => handleStateChange(option, 'permanentState')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">District</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentDistrict"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.permanentDistrict)}
                                                onChange={(option) => handleCityChange(option, 'permanentDistrict')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">City</span></Col>
                                        <Col>
                                            <Select
                                                name="permanentCity"
                                                options={citiesList}
                                                value={citiesList.find(city => city.value === addressDetails.permanentCity)}
                                                onChange={(option) => handleCityChange(option, 'permanentCity')}
                                                isDisabled={isSameAddress || !editingModeAddress}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Area</span></Col>
                                        <Col><input className="input-box-address" style={{wordWrap:'break-word'}}  name="permanentStreet" type="text" value={addressDetails.permanentStreet} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Door No</span></Col>
                                        <Col><input className="input-box-address" name="permanentDoorNo" type="text" value={addressDetails.permanentDoorNo} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} /></Col>
                                    </Row>
                                    <Row className="profile-address-single-row">
                                        <Col lg={3}><span className="customer-sentence">Postal Code</span></Col>
                                        <Col><input className="input-box-address" name="permanentZip" type="text" value={addressDetails.permanentZip} onChange={handleAddressChange} disabled={isSameAddress || !editingModeAddress} /></Col>
                                    </Row>
                                </Col>
                            </Row>
                            {previousLoanDetails[0]?.financeName !== 'No previous loan' && (
                                <Row>
                                    <p className="profile-aadhar-per-head">Previous Loan</p>
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
                                                    <Col>
                                                        <div className="input-box-address" style={{ width: '300px', borderStyle: 'solid', paddingLeft: '20px' }}>
                                                            {loan.financeName}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="input-box-address" style={{ width: '300px' }}>
                                                            {loan.yearOfLoan}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="input-box-address" style={{ width: '300px' }}>
                                                            {loan.loanAmount}
                                                        </div>
                                                    </Col>
                                                    <Col>
                                                        <div className="input-box-address" style={{ width: '300px' }}>
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
                                <Row>
                                    <Col>
                                        <>
                                            <p className="profile-aadhar-per-head">Previous Company</p>
                                            <Row className='profile-address-single-row'>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Company Name</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Designation</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>Monthly Salary</span></Col>
                                                <Col><span className="profile-finance" style={{ textAlign: "left" }}>How Many Years of Work</span></Col>
                                            </Row>
                                            {salariedPersons.map((salaried, index) => (
                                                <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                                    <Col>
                                                        <div
                                                            className="input-box-address" style={{ width: '300px', wordWrap:'true' }}
                                                            >{salaried.companyName}</div>
                                                    </Col>
                                                    <Col>
                                                        <div
                                                            className="input-box-address" style={{ width: '300px' }}
                                                        >{salaried.role}</div>
                                                    </Col>
                                                    <Col>
                                                        <div
                                                            className="input-box-address" style={{ width: '300px' }}
                                                        >{salaried.monthlySalary}</div>
                                                    </Col>
                                                    <Col>
                                                        <div
                                                             className="input-box-address" style={{ width: '300px' }}
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
                                <p className="profile-aadhar-per-head">Loan Processing Details</p>

                                <Row className='Row1 view-row-size'>
                                    <Col lg={2}>
                                        <span className="customer-sentence">IT Returns</span>
                                    </Col>
                                    <Col lg={2}>
                                        <div className="box customer-data-font" style={{ width: "100px" }}>
                                            {selectedOptions.length > 0 ? (
                                                <span>
                                                    {selectedOptions.map((option, index) => (
                                                        <span key={option.value}>
                                                            {option.label}
                                                            {index < selectedOptions.length - 1 && <span>/</span>}
                                                        </span>
                                                    ))}
                                                </span>
                                            ) : (
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
                                            )}
                                        </div>

                                    </Col>
                                </Row>

                                <Row className="Row1 view-row-size">
                                    <Col lg={2}><span className="customer-sentence">Check Bounds Status</span></Col>
                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.checkBounds}</div></Col>
                                </Row>
                                <Row className="Row1 view-row-size">
                                    <Col lg={2}><span className="customer-sentence">Customer Block Status</span></Col>
                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.blockStatus}</div></Col>
                                </Row>
                                <Row className="Row1 view-row-size">
                                    <Col lg={2}><span className="customer-sentence">Customer File Status</span></Col>
                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.fileStatus}</div></Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Row className="Row1 view-row-size">
                                            <Col lg={2}><span className="customer-sentence">Loan</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.loanType}</div></Col>
                                        </Row>

                                        <Row className="Row1 view-row-size">
                                            <Col lg={2}><span className="customer-sentence">Cibil Record</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.cibilRecord}</div></Col>
                                        </Row>
                                        {customerDetails.customerType === 'Business' && (
                                            <>

                                                <Row className="Row1 view-row-size">
                                                    <Col lg={2}><span className="customer-sentence">Monthly Income</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.msneNo}</div></Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={2}><span className="customer-sentence">MSNE Reg.No</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.monthlyIncome}</div></Col>
                                                </Row>
                                                <Row className="Row1 view-row-size">
                                                    <Col lg={2}><span className="customer-sentence">GST No</span></Col>
                                                    <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.gstNo}</div></Col>
                                                </Row>
                                            </>)}
                                        <Row className="Row1 view-row-size">
                                            <Col lg={2}><span className="customer-sentence">Document</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.documentStatus}</div></Col>
                                        </Row>
                                        <Row className="Row1 view-row-size">
                                            <Col lg={2}><span className="customer-sentence">Document Type</span></Col>
                                            <Col lg={2}><div className="box customer-data-font">{loanProcessingDetails && loanProcessingDetails.documentType}</div></Col>
                                        </Row>
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

export default Profile_View;
