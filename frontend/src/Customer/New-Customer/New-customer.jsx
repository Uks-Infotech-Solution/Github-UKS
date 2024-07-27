import React, { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import '../New-Customer/New-Customer.css'; // Ensure the correct path
import { MdArrowForwardIos } from "react-icons/md";
import { MdHome } from "react-icons/md";
import StickyNavbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import Popup from '../../Indexpage/Section-1/Popup';
import { useSidebar } from '../Navbar/SidebarContext'; // Import the Popup component

function NewCustomer() {
  const navigate = useNavigate();
  const { isSidebarExpanded } = useSidebar();

  const [customerFname, setCustomerFname] = useState('');
  const [customerLname, setCustomerLname] = useState('');
  const [customercontact, setCustomerContact] = useState('');
  const [customeralterno, setCustomerAlterNo] = useState('');
  const [customerwhatsapp, setCustomerWhatsapp] = useState('');
  const [customermailid, setCustomerMailId] = useState('');
  const [typeofloan, setTypeOfLoan] = useState('');
  const [userpassword, setUserPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [customerType, setCustomerType] = useState('');
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const validate = () => {
    const newErrors = {};
    const mobileNumberPattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!customerFname) newErrors.customerFname = "Customer First Name is required";
    if (!customerLname) newErrors.customerLname = "Customer Last Name is required";

    if (!customercontact) {
      newErrors.customercontact = "Customer Contact is required";
    } else if (!mobileNumberPattern.test(customercontact)) {
      newErrors.customercontact = "Customer Contact must be a valid 10-digit number";
    }

    if (customeralterno && !mobileNumberPattern.test(customeralterno)) {
      newErrors.customeralterno = "Alternate Number must be a valid 10-digit number";
    }

    if (!customerwhatsapp) {
      newErrors.customerwhatsapp = "Customer Whatsapp number is required";
    } else if (!mobileNumberPattern.test(customerwhatsapp)) {
      newErrors.customerwhatsapp = "Customer Whatsapp number must be a valid 10-digit number";
    }

    if (!customermailid) {
      newErrors.customermailid = "Customer Mail ID is required";
    } else if (!emailPattern.test(customermailid)) {
      newErrors.customermailid = "Customer Mail ID must be a valid email address";
    }

    if (!userpassword) {
      newErrors.userpassword = "Password is required";
    } else if (!passwordPattern.test(userpassword)) {
      newErrors.userpassword = "Password must be at least 8 characters long and contain both letters and numbers";
    }

    if (!customerType) newErrors.customerType = "Customer Type is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const customerData = {
          customerFname,
          customerLname,
          customercontact,
          customerwhatsapp,
          customeralterno,
          customermailid,
          typeofloan,
          userpassword,
          customerType
        };
<<<<<<< HEAD
        const response = await axios.post('https://uksinfotechsolution.in:8000/register', customerData);
=======
        const response = await axios.post('https://localhost:8000/register', customerData);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
        const customerNo = response.data.customerNo; // Assume the response contains the new customer number
        setErrors({});
        setCustomerFname('');
        setCustomerLname('');
        setCustomerContact('');
        setCustomerAlterNo('');
        setCustomerWhatsapp('');
        setCustomerMailId('');
        setTypeOfLoan('');
        setUserPassword('');
        setCustomerType('');
        setPopupMessage(`Customer registration is successful. Customer Number: UKS-CU-${customerNo}`);
        setShowPopup(true);
      } catch (error) {
        console.error("There was an error submitting the form!", error.response.data);
        setMessage('Error adding customer. Please try again.');
        alert('Error adding customer. Please try again.');
      }
    }
  };

  const homepage = () => {
    navigate('/customer');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/customer/login');
  };

  return (
    <>
      {/* <StickyNavbar /> */}
      <Container fluid className={`New-Customer-container-first ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <div>
          <div className='Customer-top-nav-div'>
            <span className='Customer-top-navi-head'>New Customer</span> | 
            <MdHome size={25} className='Customer-top-nav-home' onClick={homepage} /> 
            <MdArrowForwardIos className='Customer-top-nav-arrow' />
            <span className='Cutomer-top-navi'><a href='/customer' style={{ color: 'rgb(142, 143, 144)' }}>Pages </a></span>
            <MdArrowForwardIos className='Customer-top-nav-arrow' /> 
            <span className='Cutomer-top-navi'>New Customer</span>
          </div>
        </div>
        <Container className="New-Customer-container-second">
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
              <Col lg={2}>
                <input 
                  type="text" 
                  placeholder="Whatsapp Number" 
                  value={customerwhatsapp} 
                  onChange={handleChange(setCustomerWhatsapp)} 
                />
                {errors.customerwhatsapp && <span className="error">{errors.customerwhatsapp}</span>}
              </Col>
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
              <Col lg={2}><span className="customer-sentence">Loan Required</span></Col>
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
        <Popup show={showPopup} handleClose={handleClosePopup} message={popupMessage} />
      </Container>
    </>
  );
}

export default NewCustomer;
