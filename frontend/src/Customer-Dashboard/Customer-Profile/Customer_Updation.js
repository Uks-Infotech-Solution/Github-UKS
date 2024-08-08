import React, { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { GoDotFill } from "react-icons/go";
import { useSidebar } from '../../Customer/Navbar/SidebarContext';
import PathnameUrlPath from '../../URL_Path/Url_Path';
import Select from 'react-select';
import Customer_AddressForm from "./Customer_Address";
import Customer_Previous_Loan_Details from "./Customer_Previous_Loan";
import Customer_Salaried_Person from "./Customer_Salaried_Person";
import Customer_LoanProcessing from "./Customer_LoanProcessing";

function Customer_Updation() {
    // Check if the page has been reloaded before
    if (!localStorage.getItem('hasReloaded')) {
        // Set the flag to indicate that reload has occurred
        localStorage.setItem('hasReloaded', 'true');

        // Reload the page
        window.location.reload();
    } else {
        // Clear the flag if you want to allow reloading again in the future
        // localStorage.removeItem('hasReloaded');
    }

    const navigate = useNavigate();
    const location = useLocation();
    const { customerId } = location.state || {};
    const [customerDetails, setCustomerDetails] = useState(null);
    const [formData, setFormData] = useState({});
    const [loanTypes, setLoanTypes] = useState([]);
    const [editingMode, setEditingMode] = useState(false);
    const { isSidebarExpanded } = useSidebar();
    const [error, setError] = useState('');
    const [dataUpdated, setDataUpdated] = useState(false);


    const refetchData = () => {
        setDataUpdated(prev => !prev); // Trigger refetch by toggling the state
    };

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/customer-details', {
                    params: { customerId }
                });
                setCustomerDetails(response.data);
                setFormData(response.data); // Initialize formData with fetched data

            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        };

        fetchCustomerDetails();
    }, [customerId]);

    useEffect(() => {
        axios.get('https://uksinfotechsolution.in:8000/api/loan-types')
            .then(response => {
                setLoanTypes(response.data.map(type => ({
                    value: type.id,
                    label: type.type
                })));
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            typeofloan: selectedOption.label
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('https://uksinfotechsolution.in:8000/update-customer-details', {
                customerId,
                updatedDetails: formData
            });

            console.log("Response from server:", response.data);
            setEditingMode(false);
            alert("Customer Details Updated");
            window.location.reload();
        } catch (error) {
            console.error('Error updating customer details:', error);
            alert("Error updating customer details");
        }
        const refetchData = () => {
            setDataUpdated(prev => !prev); // Trigger refetch by toggling the state
        };
    };

    const handleProfileDownload = () => {
        if (customerId) {
            navigate(`/customer/profile/download`, { state: { customerId } });
        }
    };

    const handleDownloadClick = async (e) => {
        e.preventDefault();
        
        const url = `https://uksinfotechsolution.in:8000/api/download-pdf/${customerDetails._id}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf'
                }
            });

            if (response.ok) {
                // If the response is ok, create a link element to trigger the download
                const blob = await response.blob();
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = 'Cibil_Report.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // If the response is not ok, show an alert message
                alert('PDF is not available.');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('An error occurred while trying to download the PDF.');
        }
    };

    if (!customerDetails) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Container fluid className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <div style={{ paddingBottom: '18px' }}>
                    <PathnameUrlPath location={location} homepage={() => navigate('/customer-dashboard', { state: { customerId } })} />
                </div>
                <Row className="Section-1-Row">
                    <Col className="New-Customer-container-second basic-view-col">
                        <Row>
                            <Col lg={8}>
                                <span className="basic-view-head" style={{ marginTop: '50px' }}>Customer Profile</span>
                                {formData.isActive === 'false' ? (
                                    <span style={{ margin: '5px', color: 'red', fontWeight: "500" }}><GoDotFill /> InActive</span>
                                ) : (
                                    <span style={{ margin: '5px', color: 'green', fontWeight: "500" }}><GoDotFill /> Active</span>
                                )}
                            </Col>
                            <Col lg={3} className='customer-prf-download' >
                                <span>
                                    <a href="" onClick={handleProfileDownload} style={{ marginRight: "15px", textDecoration: 'none' }}>
                                        Profile Download
                                    </a>
                                </span>
                                <span>
                                    <a href="#" onClick={handleDownloadClick} style={{ textDecoration: 'none' }}>
                                        Cibil Report Download
                                    </a>
                                </span>
                            </Col>
                            <Col style={{ display: 'flex', justifyContent: "flex-end" }}>
                                {!editingMode && (
                                    <Button style={{ width: '80px', marginTop: '-15px' }} onClick={() => setEditingMode(true)}>Edit</Button>
                                )}
                            </Col>
                            <hr style={{ margin: "5px", width: "98%" }} />
                        </Row>
                        
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence">Customer Type</span>
                            </Col>
                            <Col lg={2}>

                                <input
                                    type="radio"
                                    name="customerType"
                                    className="radio-btn"
                                    style={{ marginRight: '10px' }}
                                    value="Business"
                                    checked={formData.customerType === 'Business'}
                                    onChange={handleChange}
                                    disabled={!editingMode}
                                />
                                Business
                            </Col>
                            <Col>
                                <input
                                    type="radio"
                                    name="customerType"
                                    className="radio-btn"
                                    style={{ marginRight: '10px' }}
                                    value="Salaried Person"
                                    checked={formData.customerType === 'Salaried Person'}
                                    onChange={handleChange}
                                    disabled={!editingMode}
                                />
                                Salaried Person
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence">Title</span>
                            </Col>
                            <Col lg={6}>
                                <select
                                    name="title"
                                    className="dropdown box"
                                    style={{ minWidth: '200px' }}
                                    value={formData.title || ''}
                                    onChange={handleChange}
                                    disabled={!editingMode}
                                >
                                    <option value="">Select Title</option>
                                    <option value="Mr">Mr</option>
                                    <option value="Mrs">Mrs</option>
                                    <option value="Ms">Ms</option>
                                </select>
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">First Name</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerFname"
                                    value={formData.customerFname || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Last Name</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerLname"
                                    value={formData.customerLname || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence">Gender</span>
                            </Col>
                            <Col>
                                <select
                                    name="gender"
                                    className="dropdown box"
                                    style={{ minWidth: '200px' }}
                                    value={formData.gender || ''}
                                    onChange={handleChange}
                                    disabled={!editingMode}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Transgender">Transgender</option>
                                </select>
                            </Col>
                        </Row>

                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Mobile Number</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customercontact"
                                    value={formData.customercontact || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Alternate Number</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customeralterno"
                                    value={formData.customeralterno || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">WhatsApp Number</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="customerwhatsapp"
                                    value={formData.customerwhatsapp || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Email</span></Col>
                            <Col>
                                <input
                                    type="email"
                                    className="box"
                                    name="customermailid"
                                    value={formData.customermailid || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Referred By</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="ReferedBy"
                                    value={formData.ReferedBy || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}>
                                <span className="customer-sentence" style={{ color: 'black' }}>Type of Loan</span>
                            </Col>
                            <Col>
                                <Select
                                    value={loanTypes.find(option => option.label === formData.typeofloan) || null}
                                    onChange={handleSelectChange}
                                    options={loanTypes}
                                    isDisabled={!editingMode}
                                    styles={{
                                        container: provided => ({
                                            ...provided,
                                            minWidth: '200px', // Set the minimum width here
                                            maxWidth: '200px', // Optional: Set a maximum width
                                        }),
                                        control: provided => ({
                                            ...provided,
                                            minWidth: '200px', // Set the minimum width of the select input
                                        }),
                                        singleValue: provided => ({
                                            ...provided,
                                            color: 'black' // Set the color of the selected value text
                                        }),
                                        menu: provided => ({
                                            ...provided,
                                            color: 'black' // Set the color of the dropdown menu text
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            color: 'black', // Set the color of the dropdown options
                                            backgroundColor: state.isSelected ? 'lightgrey' : 'white',
                                            ':hover': {
                                                backgroundColor: 'lightgrey'
                                            }
                                        })
                                    }}
                                />
                            </Col>
                        </Row>

                        <Row className="Row1 view-row-size">
                            <Col className='basic-col-width' lg={2}><span className="customer-sentence">Loan Required</span></Col>
                            <Col>
                                <input
                                    type="text"
                                    className="box"
                                    name="loanRequired"
                                    value={formData.loanRequired || ''}
                                    onChange={handleChange}
                                    readOnly={!editingMode}
                                />
                            </Col>
                        </Row>
                        {editingMode && (
                            <Row>
                                <Col lg={10}>
                                    <Button className="update-button" onClick={handleSubmit}>Update</Button>
                                </Col>
                            </Row>
                        )}
                        <hr />
                        <Customer_AddressForm />
                        <hr />
                        <Customer_Previous_Loan_Details />
                        <hr />
                        {/* Conditionally render Customer_Salaried_Person based on customerType */}
                        {formData.customerType === 'Salaried Person' && <Customer_Salaried_Person />}
                        < Customer_LoanProcessing refetchData={refetchData} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Customer_Updation;
