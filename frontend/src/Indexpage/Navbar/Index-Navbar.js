import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import uks from '../Navbar/uks-bg.png';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar/Index-Navbar.css';

function Index_Navbar() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const toggleNavbar = () => setExpanded(!expanded);
  const closeNavbar = () => setExpanded(false);

  const dsalogin = () => {
    // Clear localStorage and sessionStorage
    localStorage.setItem('login', false);
    localStorage.removeItem('customId');
    localStorage.removeItem('dsaId');
    localStorage.removeItem('uksId');
    localStorage.removeItem('profileImage');
    localStorage.clear();
    sessionStorage.clear();

    // Navigate to '/dsa/login'
    // navigate('/dsa/login');
  };

  return (
    <>   
      <Navbar expand="lg" expanded={expanded} className="bg-body-tertiary index-navibar">
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className='index-navname d-flex justify-contant-end align-items-center'>
            <img src={uks} alt="" className='index-img1'/>
            <span style={{ color: '#145693' }}>LDP Finserv</span>         
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar" onClick={toggleNavbar} />
          <Navbar.Collapse id="offcanvasNavbar">
            <Nav className="justify-content-end flex-grow-1 pe-3 index-navmenu" onSelect={closeNavbar}>
              <Nav.Link as={Link} to="/" className='index-navbt' activeClassName="active" exact onClick={closeNavbar}>Home</Nav.Link>
              <Nav.Link as={Link} to="/listOfCustomers" className='index-navbt' activeClassName="active" exact onClick={closeNavbar}>Services</Nav.Link>
              {/* <Nav.Link as={Link} to="/pricing" className='index-navbt' activeClassName="active" exact onClick={closeNavbar}>Pricing</Nav.Link> */}
              <Nav.Link as={Link} to="/dsa/login" className='index-navbt ' activeClassName="active" exact onClick={dsalogin}>DSA Login</Nav.Link>
              <Nav.Link as={Link} to="/customer/login" className='index-navbt ' activeClassName="active" exact onClick={dsalogin}>Cus-Login</Nav.Link>
              <Nav.Link as={Link} to="/uks/login" className='index-navbt contact' activeClassName="active" exact onClick={dsalogin}>Employee Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Index_Navbar;
