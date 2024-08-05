
import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { MdMailOutline, MdOutlineCheckBoxOutlineBlank, MdHome } from "react-icons/md";
import { FaRegStar, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { IoToggleSharp, IoPeople } from "react-icons/io5";
import { IoMdSearch, IoIosNotifications } from "react-icons/io";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UKS from '../images/uks-bg.png';
import './Navbar.css';
import { CgProfile } from "react-icons/cg";
import { useSidebar } from './SidebarContext';
import { IoPower, IoPerson } from "react-icons/io5";
import { MdDashboard } from "react-icons/md";
import axios from 'axios';
import { FcAddDatabase } from "react-icons/fc";
import { IoPersonAddSharp } from "react-icons/io5";
import { FaListUl } from "react-icons/fa";
import { FcVoicePresentation } from "react-icons/fc";
import { FcReading } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { FcExport } from "react-icons/fc";
import { HiViewGridAdd } from "react-icons/hi";


const StickyNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarExpanded, toggleSidebar } = useSidebar();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCustomerMenu, setShowCustomerMenu] = useState(false);
  const [showMasterMenu, setShowMasterMenu] = useState(false);
  const [showCusMenu, setShowCusMenu] = useState(false);
  const [showdsaMenu, setShowdsaMenu] = useState(false);
  const [showEmployeeMenu, setShowEmployeeMenu] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileUpdationMenu, setShowProfileUpdationMenu] = useState(false);
  const [imageSrc, setImageSrc] = useState(localStorage.getItem('profileImage') || null);
  const profileContainerRef = useRef(null);
  const [dsaData, setDsaData] = useState(null);
  const [uksData, setUksData] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);


  const [login, setLogin] = useState(JSON.parse(localStorage.getItem('login')) || false);


  const { customerId } = location.state || {};
  const { dsaId } = location.state || {};
  const { uksId } = location.state || {};


  useEffect(() => {
    if (!login) {

      if (customerId) {
        setLogin(true);
        localStorage.setItem('login', true);
        localStorage.setItem('customerId', customerId);
        fetchCustomerDetails(customerId);
        fetchProfilePicture(customerId);
      }
      else if (dsaId) {
        setLogin(true);
        localStorage.setItem('login', true);
        localStorage.setItem('dsaId', dsaId);
        fetchDSADetails(dsaId);
      }
      else if (uksId) {
        setLogin(true);
        localStorage.setItem('login', true);
        localStorage.setItem('uksId', uksId);
        fetchUKSDetails(uksId);
      }

    } else {
      const storedCustomerId = localStorage.getItem('customerId');
      const storedDsaId = localStorage.getItem('dsaId');
      const storedUksId = localStorage.getItem('uksId');

      if (storedCustomerId) {
        fetchCustomerDetails(storedCustomerId);
        fetchProfilePicture(storedCustomerId);
      } else if (storedDsaId) {
        fetchDSADetails(storedDsaId);
      } else if (storedUksId) {
        fetchUKSDetails(storedUksId);
      }
    }
  }, [customerId, dsaId, uksId, login]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const fetchDSADetails = async (dsaId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa?dsaId=${dsaId}`);
      setDsaData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching DSA details:', error);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    // console.log({ customerId });
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/customer-details`, { params: { customerId } });
      setCustomerDetails(response.data);
      // console.log('customer:', response.data);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const fetchUKSDetails = async (uksId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/uks/details?uksId=${uksId}`);
      setUksData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error('Error fetching UKS details:', error);
    }
  };

  const fetchProfilePicture = async (customerId) => {
    try {
      const response = await axios.get(`https://uksinfotechsolution.in:8000/api/profile/view-profile-picture?customerId=${customerId}`, {
        responseType: 'arraybuffer'
      });
      const contentType = response.headers['content-type'];

      if (contentType && contentType.startsWith('image')) {
        const base64Image = `data:${contentType};base64,${btoa(
          new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )}`;
        setImageSrc(base64Image);
        localStorage.setItem('profileImage', base64Image);
      }
    } catch (err) {
      // console.error('Error retrieving profile picture:', err);
      setImageSrc(null);
      // localStorage.removeItem('profileImage');
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      setDsaData(null);
      setUksData(null);
      setCustomerDetails(null);
      setImageSrc(null);
      setLogin(false);
      localStorage.setItem('login', false);
      localStorage.removeItem('customerId');
      localStorage.removeItem('dsaId');
      localStorage.removeItem('uksId');
      localStorage.removeItem('profileImage');
      navigate('/ldp/finserv');
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  const handleProfileChange = () => {
    if (dsaData && dsaId) {
      navigate('/dsa/updation', { state: { dsaId } });
    } else if (uksData && uksId) {
      alert('No found data');
    } else if (customerDetails && customerId) {
      navigate('/customer/profile/view', { state: { customerId } });
    }
  };

  const handleHomeChange = () => {
    if (dsaData && dsaId) {
      navigate('/dsa/dashboard', { state: { dsaId } });
    } else if (uksData && uksId) {
      alert('No found data');
    } else if (customerDetails && customerId) {
      navigate('/customer-dashboard', { state: { customerId } });
    }
  };

  const Dsasideprofile = () => { if (dsaId) { navigate('/dsa/updation', { state: { dsaId } }); } }
  const DsasideDashboard = () => { if (dsaId) { navigate('/dsa/dashboard', { state: { dsaId } }); } }
  const DsaPricing = () => { if (dsaId) { navigate('/pricing', { state: { dsaId } }); } }
  const CustomersideProfile = () => { if (customerId) { navigate('/customer/profile/view', { state: { customerId } }); } }
  const CustomersideDashboard = () => { if (customerId) { navigate('/customer-dashboard', { state: { customerId } }); } }
  const Pricing = () => { if (uksId) { navigate('/add/pricing', { state: { uksId } }); } }
  const Uks_Dashboard = () => { if (uksId) { navigate('/uks/dashboard', { state: { uksId } }); } }
  const toggleCustomerMenu = () => { setShowCustomerMenu(!showCustomerMenu); };
  const toggleMasterMenu = () => { setShowMasterMenu(!showMasterMenu); };
  const toggleCusMenu = () => { setShowCusMenu(!showCusMenu); };
  const toggledsaMenu = () => { setShowdsaMenu(!showdsaMenu); };
  const toggleEmployeeMenu = () => { setShowEmployeeMenu(!showEmployeeMenu); };

  const toggleProfileMenu = () => { setShowProfileMenu(!showProfileMenu); };

  const toggleProfileUpdationMenu = () => { setShowProfileUpdationMenu(!showProfileUpdationMenu); };

  const toggleProfileDropdown = () => { setShowDropdown(!showDropdown); };
  const DocumentType = () => { if (uksId) { navigate('/documentType', { state: { uksId } }); } }
  const EmployeeType = () => { if (uksId) { navigate('/employee/type', { state: { uksId } }); } }
  const Unsecured_DocumentType = () => { if (uksId) { navigate('/unsecured/documentType', { state: { uksId } }); } }
  const Loan_Level = () => { if (uksId) { navigate('/loanlevel', { state: { uksId } }); } }
  const Loan_Type = () => { if (uksId) { navigate('/loantype', { state: { uksId } }); } }
  const File_Status = () => { if (uksId) { navigate('/filestatus', { state: { uksId } }); } }
  const Required_Type = () => { if (uksId) { navigate('/dsa/requiredtype', { state: { uksId } }); } }


  const Customer_reg = () => { if (uksId) { navigate('/customer/reg', { state: { uksId } }); } }
  const Dsa_reg = () => { if (uksId) { navigate('/dsa/reg', { state: { uksId } }); } }
  const Sales_Customer_reg = () => { if (uksId) { navigate('/sales/customer/list', { state: { uksId } }); } }
  const Sales_Dsa_reg = () => { if (uksId) { navigate('/sales/dsa/list', { state: { uksId } }); } }
  const Sales_Dashboard = () => { if (uksId) { navigate('/sales/person/dashboard', { state: { uksId } }); } }
  const Sales_Packagers = () => { if (uksId) { navigate('/sales/packagers', { state: { uksId } }); } }

  const Uks_Customer = () => { if (uksId) { navigate('/uks/customer/list', { state: { uksId } }); } }
  const Uks_Loan_Application = () => { if (uksId) { navigate('/uks/loan/appliation', { state: { uksId } }); } }
  const Uks_DSA = () => { if (uksId) { navigate('/uks/dsa/list', { state: { uksId } }); } }
  const Package_Inactive = () => { if (uksId) { navigate('/dsa/package/list', { state: { uksId } }); } }


  const Customer_List = () => { if (dsaId) { navigate('/customer/list', { state: { dsaId } }); } }
  const Applied_Customers = () => { if (dsaId) { navigate('/applied/customer/list', { state: { dsaId } }); } }
  const DSA_Purchased_Package = () => { if (dsaId) { navigate('/purchased/package', { state: { dsaId } }); } }

  const Customer_DSA_List = () => { if (customerId) { navigate('/Dsa/List', { state: { customerId } }); } }
  const Customer_Applied_Loan_List = () => { if (customerId) { navigate('/Applied/Loan/List', { state: { customerId } }); } }

  return (
    <>
      {/* <CustomerTable DsaData={dsaData}/> */}
      <Navbar expand="lg" fixed="top" className={`custom-navbar ${isSidebarExpanded ? 'sidebar-expanded navbar-expanded' : ''}`}>
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className='toggie' onClick={toggleSidebar} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto Navi-Second">
            <Nav.Link as={Link} to="/contact"><IoMdSearch size={23} /></Nav.Link>
            <Nav.Link as={Link} to="/contact"><IoIosNotifications size={23} /></Nav.Link>
            <Nav.Link as={Link} to="/contact"><FaShoppingCart size={23} /></Nav.Link>
            <div ref={profileContainerRef} className='profile-container' onClick={toggleProfileDropdown}>
              <span className='navbar-profile-hide'>Hi <span className='customer-name-right'>{(customerDetails && customerDetails.customerFname) || (dsaData && dsaData.dsaName) || (uksData && uksData.name)}</span></span>
              {imageSrc ? (
                <img className='navbar-profile-image' src={imageSrc} alt="Profile" />
              ) : (
                <FaUserCircle size={45} className='navbar-profile-icon' />
              )}
              <NavDropdown show={showDropdown} title="" id="basic-nav-dropdown" align="end">
                <NavDropdown.Item onClick={handleHomeChange} className='d-flex align-items-center'>
                  <MdHome size={25} />
                  <span className='ms-2'>Home</span>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleProfileChange} className='d-flex align-items-center'>
                  <IoPerson size={20} />
                  <span className='ms-2'>Profile</span>
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout} className='d-flex align-items-center'>
                  <IoPower size={20} />
                  <span className='ms-2'>Logout</span>
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <div className={`side-menu ${isSidebarExpanded ? 'show' : ''}`}>
        <Nav className="flex-column">
          <Navbar.Brand href="" className="d-flex align-items-center">
            <img src={UKS} alt="UKS Logo" className="brand-img" />
            <span className="ms-2" style={{ color: 'white' }}>LDP Finserv</span>
            {/* <span className='Side-navi-toggle'><IoToggleSharp onClick={toggleSidebar} /></span> */}
          </Navbar.Brand>
          {/* <div className=''style={{color:'white', padding:'15px'}}>
            <MdDashboard className='Customer-icon' style={{color:'white'}} />Dashboard
          </div> */}
          {/* <div className='side-menu-head'>PAGES</div> */}
          {uksData && uksId && uksData.employeeType == 'Sales' && (
            
            <>
            <div className='customer-menu' onClick={Sales_Dashboard}>
                <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Dashboard
              </div>
              <div className='customer-menu' >
                <FcReading className='Customer-icon' style={{ color: 'white' }} />DSA
              </div>
              
            <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link className='font-size-dropdown' onClick={Dsa_reg}><IoPersonAddSharp  className='Customer-icon'/>DSA Register</Nav.Link>
                  </li>
              </ul>
              <ul className='side-menu-customer-link'>
                <li>
                  <Nav.Link className='font-size-dropdown' onClick={Sales_Dsa_reg}><FaListUl  className='Customer-icon'/>DSA List</Nav.Link>
                </li>
              </ul>
              <div className='customer-menu' >
                <FcApproval className='Customer-icon' style={{ color: 'white' }} />Customer
              </div>
              <ul className='side-menu-customer-link'>
                <li>
                  <Nav.Link className='font-size-dropdown' onClick={Customer_reg}><IoPersonAddSharp    className='Customer-icon' />Customer Register</Nav.Link>
                </li>
              </ul>
              <ul className='side-menu-customer-link'>
                <li>
                  <Nav.Link className='font-size-dropdown' onClick={Sales_Customer_reg}><FaListUl    className='Customer-icon' />Customer List</Nav.Link>
                </li>
              </ul>
              <div className='customer-menu' onClick={Sales_Packagers}>
                <FcExport   className='Customer-icon' style={{ color: 'white' }} />Packagers
              </div>
              
            </>
          )}
          {uksData && uksId && uksData.employeeType != 'Sales' && (
            <div>
              <div className='customer-menu' onClick={Uks_Dashboard}>
                <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Dashboard
              </div>
              <div className='customer-menu' onClick={toggleMasterMenu}>
                <FcAddDatabase  className='Customer-icon' />Master
              </div>
              {showMasterMenu && (
                <li>
                   <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={EmployeeType} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />Employee Type</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={DocumentType} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />Document Type</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Unsecured_DocumentType} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />Unsecure Doc Type</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Level} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />Loan Level</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Type} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />Loan Type</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={File_Status} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />File Status</Nav.Link>
                    </li>
                  </ul><ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Required_Type} className='font-size-dropdown'><HiViewGridAdd   className='Customer-icon' />DSA Required Type</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link className='font-size-dropdown' onClick={Pricing}><HiViewGridAdd   className='Customer-icon' />Pricing</Nav.Link>
                    </li>
                  </ul>

                </li>
              )}

              <div className='customer-menu' onClick={toggleCusMenu}>
                <FcApproval   className='Customer-icon' />Customer
              </div>
              {showCusMenu && (
                <li>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Uks_Customer}  className='font-size-dropdown'>Customer List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Customer_reg} className='font-size-dropdown'>Register Form</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Uks_Loan_Application} className='font-size-dropdown'>Customer Applied List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Type} className='font-size-dropdown'>Customer Report</Nav.Link>
                    </li>
                  </ul>
                </li>
              )}

              <div className='customer-menu' onClick={toggledsaMenu}>
                <FcReading className='Customer-icon' />DSA
              </div>
              {showdsaMenu && (
                <li>
                  <ul className='side-menu-customer-link'>
                    <li>
                    <Nav.Link onClick={Uks_DSA}  className='font-size-dropdown'>DSA List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Dsa_reg} className='font-size-dropdown'>Register Form</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={File_Status} className='font-size-dropdown'>DSA Applied List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Type} className='font-size-dropdown'>DSA Report</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Package_Inactive} className='font-size-dropdown'>Package Inactive List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Type} className='font-size-dropdown'>Package Active List</Nav.Link>
                    </li>
                  </ul>
                </li>
              )}


              <div className='customer-menu' onClick={toggleEmployeeMenu}>
                <FaPersonCircleCheck   className='Customer-icon' />Employee Details
              </div>
              {showEmployeeMenu && (
                <li>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={DocumentType} className='font-size-dropdown'>Sales Persons</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link onClick={Loan_Level} className='font-size-dropdown'>Report</Nav.Link>
                    </li>
                  </ul>
                </li>
              )}
            </div>

          )}
          {customerDetails && customerId && (
            <div>
              <div className='customer-menu' onClick={toggleCustomerMenu}>
                <FcApproval className='Customer-icon' />Customer
              </div>
                <li>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link className='font-size-dropdown' onClick={CustomersideDashboard}>
                      <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Dashboard</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link className='font-size-dropdown' onClick={CustomersideProfile}>
                      <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Profile Updation</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link className='font-size-dropdown' onClick={Customer_DSA_List}>
                      <MdDashboard className='Customer-icon' style={{ color: 'white' }} />DSA List</Nav.Link>
                    </li>
                  </ul>
                  <ul className='side-menu-customer-link'>
                    <li>
                      <Nav.Link className='font-size-dropdown' onClick={Customer_Applied_Loan_List}>
                      <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Applied Loan List</Nav.Link>
                    </li>
                  </ul>
                </li>
            </div>
          )}
          {dsaData && dsaId && (
            <div>
              <div className='customer-menu' onClick={toggleCustomerMenu}>
                <FcApproval className='Customer-icon' />DSA</div>
              <li>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={DsasideDashboard} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />
                    Dashboard</Nav.Link>
                  </li>
                </ul>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={Dsasideprofile} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Profile Updation</Nav.Link>
                  </li>
                </ul>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={DsaPricing} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Packages</Nav.Link>
                  </li>
                </ul>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={DSA_Purchased_Package} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Purchased Packages</Nav.Link>
                  </li>
                </ul>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={Customer_List} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Customer List</Nav.Link>
                  </li>
                </ul>
                <ul className='side-menu-customer-link'>
                  <li>
                    <Nav.Link onClick={Applied_Customers} className='font-size-dropdown'>
                    <MdDashboard className='Customer-icon' style={{ color: 'white' }} />Applied Customer List</Nav.Link>
                  </li>
                </ul>
              </li>

            </div>
          )}
        </Nav>
      </div>
      <div className={`overlay ${isSidebarExpanded ? 'show' : ''}`} onClick={toggleSidebar}></div>
    </>
  );
};

export default StickyNavbar;
