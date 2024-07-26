import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import { MdArrowForwardIos, MdHome } from "react-icons/md";

function UpdateCustomer() {
    const { id } = useParams(); // Get the customer ID from the URL parameters
    const [customerNo, setCustomerNo] = useState('');
    const [customerFname, setCustomerFname] = useState('');
    const [customerLname, setCustomerLname] = useState('');
    const [customercontact, setCustomerContact] = useState('');
    const [customeralterno, setCustomerAlterNo] = useState('');
    const [customermailid, setCustomerMailId] = useState('');
    const [typeofloan, setTypeOfLoan] = useState('');
    const [username, setUserName] = useState('');
    const [userpassword, setUserPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [customerType, setCustomerType] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch existing customer data for editing
        const fetchCustomerData = async () => {
            try {
                const response = await axios.get(`http://148.251.230.14:8000/${id}`);
                const data = response.data;
                setCustomerNo(data.customerNo); // Set the customerNo received from the backend
                setCustomerFname(data.customerFname);
                setCustomerLname(data.customerLname);
                setCustomerContact(data.customercontact);
                setCustomerAlterNo(data.customeralterno);
                setCustomerMailId(data.customermailid);
                setTypeOfLoan(data.typeofloan);
                setUserName(data.username);
                setUserPassword(data.userpassword);
                setCustomerType(data.customerType);
            } catch (error) {
                console.error("Error fetching customer data:", error);
            }
        };

        if (id) {
            fetchCustomerData();
        }
    }, [id]);

    const handleChange = (setter) => (e) => {
        setter(e.target.value);
    };

    const validate = () => {
        const newErrors = {};
        if (!customerFname) newErrors.customerFname = "Customer First Name is required";
        // Add validation for other fields
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const customerData = {
                customerNo,
                customerFname,
                customerLname,
                customercontact,
                customeralterno,
                customermailid,
                typeofloan,
                username,
                userpassword,
                customerType
            };

            const response = await axios.put(`http://148.251.230.14:8000/customers/${id}`, customerData);
            const updatedCustomerId = response.data._id; // Assume the response contains the updated customer ID
            setMessage(`Customer updated successfully! Customer ID: ${updatedCustomerId}`);
            setErrors({});
            alert(`Customer updated successfully! Customer ID: ${updatedCustomerId}`); // Show success alert with ID
        } catch (error) {
            console.error("There was an error updating the customer!", error);
            setMessage('Error updating customer. Please try again.');
            alert('Error updating customer. Please try again.'); // Show error alert
        }
    };

    return (
        <Container fluid >
                <div>
                    <div className='Customer-top-nav-div'>
                        <span className='Customer-top-navi-head'>New Customer</span> | 
                        {/* <MdHome size={25} className='Customer-top-nav-home' onClick={homepage} />  */}
                        <MdArrowForwardIos className='Customer-top-nav-arrow' />
                        <span className='Cutomer-top-navi' ><a href='/customer' style={{color:'rgb(142, 143, 144)'}}>Pages </a></span>
                        <MdArrowForwardIos className='Customer-top-nav-arrow' /> 
                        <span className='Cutomer-top-navi'>New Customer</span>
                    </div>
                </div>
                <Container >
                    <form onSubmit={handleSubmit}>
                        <Row>
                            <p className="New-customer-head">Add a New Customer</p>
                            <hr />
                        </Row>

                        {message && <p className="message">{message}</p>}

                        <Row>
                            <Col lg={2}><span className="customer-sentence">Customer Type</span></Col>
                            <Col lg={2}>
                                <input 
                                    type="radio" 
                                    value="Business" 
                                    className="radio-btn" 
                                    checked={customerType === 'Business'} 
                                    onChange={() => setCustomerType('Business')} 
                                /> Business
                            </Col>
                            <Col lg={2}>
                                <input 
                                    type="radio" 
                                    value="Individual" 
                                    className="radio-btn" 
                                    checked={customerType === 'Individual'} 
                                    onChange={() => setCustomerType('Individual')} 
                                /> Salaried Person
                            </Col>
                            {errors.customerType && <span className="error">{errors.customerType}</span>}
                        </Row>

                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">Primary Contact</span></Col>
                            <Col lg={2}>
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    value={customerFname} 
                                    onChange={handleChange(setCustomerFname)} 
                                />
                                {errors.customerFname && <span className="error">{errors.customerFname}</span>}
                            </Col>
                            <Col lg={2}>
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    value={customerLname} 
                                    onChange={handleChange(setCustomerLname)} 
                                />
                                {errors.customerLname && <span className="error">{errors.customerLname}</span>}
                            </Col>
                        </Row>

                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">Mobile Number</span></Col>
                            <Col lg={2}>
                                <input 
                                    type="text" 
                                    placeholder="Primary Number" 
                                    value={customercontact} 
                                    onChange={handleChange(setCustomerContact)} 
                                />
                                {errors.customercontact && <span className="error">{errors.customercontact}</span>}
                            </Col>
                            <Col lg={2}>
                                <input 
                                    type="text" 
                                    placeholder="Alternate Number" 
                                    value={customeralterno} 
                                    onChange={handleChange(setCustomerAlterNo)} 
                                />
                                {errors.customeralterno && <span className="error">{errors.customeralterno}</span>}
                            </Col>
                        </Row>
                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">Whatsapp Number</span></Col>
                            {/* <Col lg={2}>
                                <input 
                                    type="text" 
                                    placeholder="Whatsapp Number" 
                                    value={customerwhatsapp} 
                                    onChange={handleChange(setCustomerWhatsapp)} 
                                />
                                {errors.customerwhatsapp && <span className="error">{errors.customerwhatsapp}</span>}
                            </Col> */}
                        </Row>
                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">E-Mail</span></Col>
                            <Col lg={2}>
                                <input 
                                    type="email" 
                                    placeholder="E-mail" 
                                    value={customermailid} 
                                    onChange={handleChange(setCustomerMailId)} 
                                />
                                {errors.customermailid && <span className="error">{errors.customermailid}</span>}
                            </Col>
                        </Row>

                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">Type Of Loan</span></Col>
                            <Col lg={2}>
                                <select value={typeofloan} onChange={handleChange(setTypeOfLoan)}>
                                    <option value="">Select</option>
                                    <option value="Personal loan">Personal loan</option>
                                    <option value="Business loan">Business loan</option>
                                    <option value="Unsecured loan">Unsecured loan</option>
                                    <option value="Doctors loan">Doctors loan</option>
                                    <option value="Purchase loan">Purchase loan</option>
                                    <option value="Mortgage loan">Mortgage loan</option>
                                </select>
                            </Col>
                        </Row>

                        <Row className="Row1">
                            <Col lg={2}><span className="customer-sentence">User Password</span></Col>
                            <Col lg={2}>
                                <input 
                                    type="password" 
                                    placeholder="New Password" 
                                    value={userpassword} 
                                    onChange={handleChange(setUserPassword)} 
                                />
                                {errors.userpassword && <span className="error">{errors.userpassword}</span>}
                            </Col>
                        </Row>

                        <Button type="submit" className="New-customer-submit-button">Submit</Button>
                    </form>
                </Container>
                {/* <Popup show={showPopup} handleClose={handleClosePopup} message={popupMessage} /> */}

            </Container>
    );
}

export default UpdateCustomer;
