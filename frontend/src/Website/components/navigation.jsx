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
    const hash = window.location.hash || '#header';
    setActiveKey(hash);

    const handleHashChange = () => setActiveKey(window.location.hash || '#header');
    window.addEventListener('hashchange', handleHashChange);

    // Resize event listener to adjust navbar position dynamically
    const handleResize = () => {
      const navbar = document.querySelector('nav');
      if (navbar) {
        navbar.style.position = window.innerWidth < 992 ? 'static' : 'fixed';
      }
    };

    window.addEventListener('resize', handleResize);

    // Initial position setting
    handleResize();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Inline styles for fixed and non-fixed states
  const navbarStyle = {
    padding: '10px 20px',
    top: 0,
    width: '100%',
    zIndex: 1030,
    transition: 'top 0.3s',
  };

  // Style for Nav.Link
  const navLinkStyle = {
    color: '#2492eb',
    padding: '10px 20px',
    display: 'inline-block',
    textDecoration: 'none',
    position: 'relative',
  };

  // Style for active Nav.Link
  const activeNavLinkStyle = {
    ...navLinkStyle,
    borderBottom: '1px solid #2492eb',
  };

  return (
    <Navbar 
      bg="light" 
      expand="lg" 
      style={navbarStyle} 
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
          style={{ marginLeft: 'auto' }}
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

export default Navigation;
