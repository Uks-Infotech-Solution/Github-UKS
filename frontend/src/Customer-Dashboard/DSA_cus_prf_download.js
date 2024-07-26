import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { useCustomer } from '../../Customer/Navbar/Customername-context';
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
import CustomerTable from '../Customer/Table/Table';
// import CustomerTable from '../../Customer/Table/Table';


function Dsa_cus_prf_down( ) {
    const homepage = () => {
        navigate('/customer');
    };
    const { customerEmail, customerDetails, setCustomerDetails } = useCustomer();
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
                const response = await axios.get('https://localhost:8000/customer-details', {
                    params: { email: customerEmail }
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
    }, [customerEmail, setCustomerDetails]);

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
            const response = await axios.get('https://localhost:8000/get-loan-processing', {
                params: { email: customerEmail }
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
        if (customerEmail) {
            fetchLoanProcessingDetails();
        }
    }, [customerEmail]);


    const fetchPreviousLoans = async () => {
        try {
            const response = await axios.get('https://localhost:8000/get-previous-loans', {
                params: { email: customerEmail }
            });
            setPreviousLoanDetails(response.data);
        } catch (error) {
            console.error('Error fetching previous loans:', error);
        }
    };
    useEffect(() => {
        fetchPreviousLoans();
    }, [customerEmail]);


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

    useEffect(() => {
        const fetchAddressDetails = async () => {
            try {
                const response = await axios.get(`https://localhost:8000/view-address?email=${customerEmail}`);
                // console.log('Response data:', response.data);

                if (response.data) {

                    setAddressDetails(response.data);
                    setEditingModeAddress(false);

                    // Load cities for the initial state
                    if (response.data.address && response.data.address.aadharState) {
                        const updatedCities = City.getCitiesOfState('IN', response.data.address.aadharState).map(city => ({
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

        if (customerEmail) {
            fetchAddressDetails();
        }
    }, [customerEmail]);

    const [imageSrc, setImageSrc] = useState(null);
    // Function to fetch profile picture
    const fetchProfilePicture = async (customerEmail) => {
        try {
            const response = await axios.get(`https://localhost:8000/api/profile/view-profile-picture/${customerEmail}`, {
                responseType: 'arraybuffer'
            });
            const contentType = response.headers['content-type'];

            if (contentType && contentType.startsWith('image')) {
                const base64Image = `data:${contentType};base64,${btoa(
                    new Uint8Array(response.data)
                        .reduce((data, byte) => data + String.fromCharCode(byte), '')
                )}`;
                setImageSrc(base64Image);
            } else {
                setImageSrc(null);
            }
        } catch (err) {
            console.error('Error retrieving profile picture:', err);
            setImageSrc(null);
        }
    };
    useEffect(() => {
        if (customerEmail) {
            fetchProfilePicture(customerEmail, setImageSrc);
        }
    }, [customerEmail]);


    // SALARY 

    useEffect(() => {
        const fetchSalariedPersonDetails = async () => {
            try {
                const response = await axios.get('https://localhost:8000/salariedperson', {
                    params: { email: customerEmail }
                });

                if (response.status === 200) {
                    const data = response.data.salariedPersons;

                    // Check if all values in the salaried person data are empty or null
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
                alert("Error saving Salaried Person details")

                console.error('Error fetching Salaried Person details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalariedPersonDetails();

    }, [customerEmail, activeTab]);
    return (
        <>
            

        </>
    );
}

export default Dsa_cus_prf_down;
