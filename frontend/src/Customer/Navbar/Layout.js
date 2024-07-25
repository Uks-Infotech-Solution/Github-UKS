import React from 'react';
import { Container } from 'react-bootstrap';
import './Layout.css'; // Create a CSS file for layout-specific styles

const Layout = ({ children }) => {
  return (
    <Container fluid className="main-content">
      {children}
    </Container>
  );
};

export default Layout;
