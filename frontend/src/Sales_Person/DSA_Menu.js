import {  Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import DSA_reg from "./DSA_Reg/DSA_reg";
import DSA_Loan from "./DSA_Reg/DSA_loan";
import DSA_Branch from "./DSA_Reg/DSA_branch";
import DSA_address from "./DSA_Reg/DSA_address";
import DSA_Location from "./DSA_Reg/Sales_Person_regiter";

function DSA() {
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [activeTab, setActiveTab] = useState('dsaReg');
    const [dsaId, setDsaId] = useState('');
    const [dsaNo, setDsaNo] = useState('');
console.log(dsaId);
    const tabStyle = (isActive) => ({
        cursor: 'pointer',
        padding: '5px',
        textAlign: 'center',
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '1px solid #007bff' : 'none'
    });

    // This function will be called when the registration is successful
    const handleSuccess = (id, number) => {
        setDsaId(id);
        setDsaNo(number);
        setActiveTab('address');
    };

    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <Row className="tabs-row">
                    <Col lg={2} style={tabStyle(activeTab === 'dsaReg')} onClick={() => setActiveTab('dsaReg')}>
                        DSA Registration
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'address')} onClick={() => setActiveTab('address')}>
                        Address
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'loan')} onClick={() => setActiveTab('loan')}>
                        Loan Details
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'branch')} onClick={() => setActiveTab('branch')}>
                        Branch Details
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'salesperson')} onClick={() => setActiveTab('salesperson')}>
                        Sales Person Details
                    </Col>
                </Row>
                <hr/>

                <Row>
                    {activeTab === 'dsaReg' && <DSA_reg onSuccess={handleSuccess} />}
                    {activeTab === 'address' && <DSA_address dsaId={dsaId} onSuccess={() => setActiveTab('loan')} />}
                    {activeTab === 'loan' && <DSA_Loan dsaId={dsaId} onSuccess={() => setActiveTab('branch')} />}
                    {activeTab === 'branch' && <DSA_Branch dsaId={dsaId} dsaNo={dsaNo} onSuccess={() => setActiveTab('salesperson')} />}
                    {activeTab === 'salesperson' && <DSA_Location dsaId={dsaId} dsaNo={dsaNo} />}
                </Row>
                <hr/>
            </Container>
        </>
    );
}

export default DSA;
