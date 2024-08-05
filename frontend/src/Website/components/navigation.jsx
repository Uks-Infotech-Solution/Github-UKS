import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from '../images/uks-bg.png'; // Ensure the image path is correct

const Navigation = () => {
  const [activeKey, setActiveKey] = useState('#header');

  const handleSelect = (eventKey) => {
    setActiveKey(eventKey);
  };

  useEffect(() => {
    // Highlight the active link based on the URL hash
    const hash = window.location.hash || '#header';
    setActiveKey(hash);
    
    // Update active key on hash change
    const handleHashChange = () => setActiveKey(window.location.hash || '#header');
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Inline styles for fixed and non-fixed states
  const navbarStyle = {
    padding: '10px 20px',
    position: 'fixed',
    top: 0,
    width: '100%',
    zIndex: 1030, // Ensure it's above other content
    transition: 'top 0.3s',
  };

  // Responsive handling
  const responsiveNavbarStyle = {
    ...navbarStyle,
    position: window.innerWidth < 992 ? 'static' : 'fixed', // Change position based on screen size
  };

  // Style for Nav.Link
  const navLinkStyle = {
    color: '#2492eb',
    padding: '10px 20px', // Increased padding to increase width
    display: 'inline-block', // Ensure links respect the padding
    textDecoration: 'none', // Remove underline
    position: 'relative',
  };

  // Style for active Nav.Link
  const activeNavLinkStyle = {
    ...navLinkStyle,
    borderBottom: '1px solid #2492eb', // Blue border bottom
    
  };

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      style={responsiveNavbarStyle} 
      className="d-flex"
    >
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Navbar.Brand 
          href="#page-top" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1 
          }}
        >
          <img src={img} alt='' style={{ width: '30px', marginRight: '10px' }} />
          <span style={{ color: "#145693", fontWeight: 'bold', fontSize: '24px' }}>
            UKS Infotech Solution
          </span>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav" 
          style={{ marginLeft: 'auto' }} // Ensure the toggle button is pushed to the right
        />
      </div>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto" activeKey={activeKey} onSelect={handleSelect}>
          <Nav.Link href="#header" style={activeKey === '#header' ? activeNavLinkStyle : navLinkStyle}>Home</Nav.Link>
          <Nav.Link href="#about" style={activeKey === '#about' ? activeNavLinkStyle : navLinkStyle}>About</Nav.Link>
          <Nav.Link href="#mission" style={activeKey === '#mission' ? activeNavLinkStyle : navLinkStyle}>Mission</Nav.Link>
          <Nav.Link href="#services" style={activeKey === '#services' ? activeNavLinkStyle : navLinkStyle}>Services</Nav.Link>
          <Nav.Link href="#ourteam" style={activeKey === '#ourteam' ? activeNavLinkStyle : navLinkStyle}>Team</Nav.Link>
          <Nav.Link href="#contact" style={activeKey === '#contact' ? activeNavLinkStyle : navLinkStyle}>Contact</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

// Add a resize event listener to adjust navbar position dynamically
window.addEventListener('resize', () => {
  document.querySelector('nav').style.position = window.innerWidth < 992 ? 'static' : 'fixed';
});

export default Navigation;
