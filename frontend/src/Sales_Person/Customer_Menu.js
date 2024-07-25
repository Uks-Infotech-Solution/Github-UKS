import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import { useSidebar } from '../Customer/Navbar/SidebarContext';
import Customer_reg from "./Customer_Reg/Customer_reg";
import Address from "./Customer_Reg/Address";
import Loan_process from "./Customer_Reg/Loan_Processing";
import Salaried_Person from "./Customer_Reg/Salaried_Person_Customer";
import Location from "./Customer_Reg/Sales_Person_reg";

function Customer() {
    const navigate = useNavigate();
    const { isSidebarExpanded } = useSidebar();
    const [activeTab, setActiveTab] = useState('customerReg');
    const [customerId, setCustomerId] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [customerNo, setCustomerNo] = useState('');
console.log(customerNo);
console.log(customerId);
console.log(customerType);

    const tabStyle = (isActive) => ({
        cursor: 'pointer',
        padding: '5px',
        textAlign: 'center',
        fontWeight: isActive ? 'bold' : 'normal',
        borderBottom: isActive ? '1px solid #007bff' : 'none'
    });

    // This function will be called when the registration is successful
    const handleSuccess = (id, type,customerNo) => {
        setCustomerId(id);
        setCustomerType(type);
        setCustomerNo(customerNo)
        setActiveTab('address');
  

    };

    return (
        <>
            <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
                <Row className="tabs-row">
                    <Col lg={2} style={tabStyle(activeTab === 'customerReg')} onClick={() => setActiveTab('customerReg')}>
                        Customer Registration
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'address')} onClick={() => setActiveTab('address')}>
                        Address
                    </Col>
                    {customerType === 'Salaried Person' &&
                        <Col lg={2} style={tabStyle(activeTab === 'salaried')} onClick={() => setActiveTab('salaried')}>
                            Salaried Person
                        </Col>
                    }
                    <Col lg={2} style={tabStyle(activeTab === 'loanProcessing')} onClick={() => setActiveTab('loanProcessing')}>
                        Previous Loan
                    </Col>
                    <Col lg={2} style={tabStyle(activeTab === 'salesperson')} onClick={() => setActiveTab('salesperson')}>
                        Sales Person Details
                    </Col>
                </Row>
                <hr/>

                <Row>
                    {activeTab === 'customerReg' && <Customer_reg onSuccess={handleSuccess} />}
                    {activeTab === 'address' && <Address customerId={customerId} onSuccess={() => setActiveTab(customerType === 'Salaried Person' ? 'salaried' : 'loanProcessing')} />}
                    {customerType === 'Salaried Person' && activeTab === 'salaried' && <Salaried_Person customerId={customerId} onSuccess={() => setActiveTab('loanProcessing')} />}
                    {activeTab === 'loanProcessing' && <Loan_process customerId={customerId} customerNo={customerNo} onSuccess={() => setActiveTab('salesperson')}/>}
                    {activeTab === 'salesperson' && <Location customerId={customerId} customerNo={customerNo} />}

                <hr/>
                </Row>
            </Container>
        </>
    );
}

export default Customer;
