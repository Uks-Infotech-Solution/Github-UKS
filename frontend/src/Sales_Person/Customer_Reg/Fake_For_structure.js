import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import './Customer_reg.css'
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Address() {
    const navigate = useNavigate();
    const homepage = () => {
        navigate('/customer');
    }
    const { isSidebarExpanded } = useSidebar();


    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
<input >Location</input>
                    
            </Container>
        </>
    );
}

export default Address;
