import React, { useState } from "react";
import { Button, Col, Container, Row, Form, Modal } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './Customer_reg.css';
import { useSidebar } from '../../Customer/Navbar/SidebarContext';

function Loan_process({ onSuccess,customerId,customerNo }) {
    const navigate = useNavigate();
    const [hasPreviousLoan, setHasPreviousLoan] = useState(null);
    const [previousLoanDetails, setPreviousLoanDetails] = useState([{ financeName: '', yearOfLoan: '', loanAmount: '', outstandingAmount: '' }]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Function to handle saving previous loan details
    const handlePreviousLoanSave = async () => {
        try {
            const loansToSave = hasPreviousLoan
                ? previousLoanDetails
                : [{ financeName: 'No previous loan', yearOfLoan: null, loanAmount: 0, outstandingAmount: 0 }];

<<<<<<< HEAD
            await axios.post('https://uksinfotechsolution.in:8000/add-previous-loans', {
=======
            await axios.post('https://localhost:8000/add-previous-loans', {
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                previousLoans: loansToSave,
                customerId: customerId,
            });
alert('Previous Loan Details Saved Successfully');
onSuccess();
            // Show success modal upon successful save
        } catch (error) {
            console.error('Error updating previous loan details:', error);
        }
    };

    const addLoanRow = () => {
        setPreviousLoanDetails([
            ...previousLoanDetails,
            { _id: null, financeName: '', yearOfLoan: '', loanAmount: '', outstandingAmount: '' }
        ]);
    };

    const handlePreviousLoanChange = (index, e) => {
        const { name, value } = e.target;
        const newLoans = [...previousLoanDetails];
        newLoans[index][name] = value;
        setPreviousLoanDetails(newLoans);
    };


    const { isSidebarExpanded } = useSidebar();

    return (
        <>
            <Container fluid>
                <Row>
                    <Col>
                        <Row className='profile-address-single-row'>
                            <Col lg={2}><span>Previous Loan</span></Col>
                            <Col>
                                <div className="d-flex align-items-center">
                                    <Form.Check
                                        type="radio"
                                        label="Yes"
                                        name="previousLoan"
                                        className='me-3'
                                        checked={hasPreviousLoan === true}
                                        onChange={() => setHasPreviousLoan(true)}
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="No"
                                        name="previousLoan"
                                        checked={hasPreviousLoan === false}
                                        onChange={() => setHasPreviousLoan(false)}
                                    />
                                </div>
                            </Col>
                        </Row>

                        {hasPreviousLoan && (
                            <>
                                <Row className='profile-address-single-row'>
                                    <Col><span className="profile-finance">Finance Name</span></Col>
                                    <Col><span className="profile-finance">Year of Loan</span></Col>
                                    <Col><span className="profile-finance">Loan Amount</span></Col>
                                    <Col><span className="profile-finance">Outstanding Amount</span></Col>
                                </Row>
                                {previousLoanDetails.map((loan, index) => (
                                    <Row key={index} className='profile-address-single-row previous-loan-delete'>
                                        <Col><input className="input-box-address" placeholder='Finance Name' name="financeName" type="text" value={loan.financeName} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                        <Col><input className="input-box-address" name="yearOfLoan" placeholder='Year of Loan' type="text" value={loan.yearOfLoan} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                        <Col><input className="input-box-address" name="loanAmount" placeholder='Loan Amount' type="text" value={loan.loanAmount} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                        <Col><input className="input-box-address" name="outstandingAmount" placeholder='Outstanding Amount' type="text" value={loan.outstandingAmount} onChange={(e) => handlePreviousLoanChange(index, e)} /></Col>
                                    </Row>
                                ))}
                                <Button onClick={addLoanRow} style={{ marginBottom: '10px', marginLeft: "-10px" }}>+ Add another Loan</Button>
                            </>
                        )}
                    </Col>
                    <Row>
                        <Col>
                            <Button onClick={handlePreviousLoanSave}>Save Previous Loan</Button>
                        </Col>
                    </Row>
                </Row>
                
            </Container>

        </>
    );
}

export default Loan_process;
