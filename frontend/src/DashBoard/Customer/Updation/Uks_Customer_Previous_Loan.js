import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

const Uks_Customer_Previous_Loan_Details = () => {
    const location = useLocation();
    const { customerId } = location.state || {};

    const [loanDetails, setLoanDetails] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingMode, setEditingMode] = useState(false);
    const [hasPreviousLoans, setHasPreviousLoans] = useState(null); // New state for previous loan status

    const fetchLoanDetails = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/get-previous-loans', {
                params: { customerId: customerId }
            });
            if (response.status === 200) {
                setLoanDetails(response.data || []);
                setHasPreviousLoans(response.data.length > 0 ? 'yes' : 'no');
            }

        } catch (error) {
            console.error('Error fetching loan details:', error);
            setLoanDetails([]);
        }
    };

    useEffect(() => {
        fetchLoanDetails();
    }, [customerId]);

    const handleLoanChange = (index, event) => {
        const { name, value } = event.target;
        const updatedLoanDetails = [...loanDetails];
        updatedLoanDetails[index] = { ...updatedLoanDetails[index], [name]: value };
        setLoanDetails(updatedLoanDetails);
    };

    const deleteLoanRow = async (index, loanId) => {
        try {
            const response = await axios.delete(`https://uksinfotechsolution.in:8000/delete-previous-loan/${loanId}`);
            if (response.status === 200) {
                const updatedLoanDetails = [...loanDetails];
                updatedLoanDetails.splice(index, 1);
                setLoanDetails(updatedLoanDetails);
                setSuccessMessage('Loan detail deleted successfully.');
            }
        } catch (error) {
            console.error('Error deleting loan detail:', error);
        }
    };

    const addLoanRow = () => {
        setLoanDetails([...loanDetails, { customerId, financeName: '', yearOfLoan: '', loanAmount: '', outstandingAmount: '' }]);
    };

    const handlePreviousLoanSave = async () => {
        try {
            const payload = {
                previousLoans: hasPreviousLoans === 'yes' ? loanDetails : [],
                customerId: customerId,
                hasPreviousLoans: hasPreviousLoans,
            };
            const response = await axios.post('https://uksinfotechsolution.in:8000/add-previous-loans', payload);
            if (response.status === 200) {
                setSuccessMessage('Previous Loan details saved successfully.');
                alert('Previous Loan details saved successfully.');
                setEditingMode(false);
                await fetchLoanDetails(); // Fetch the latest loan details from the backend
                window.location.reload();

            }
        } catch (error) {
            console.error('Error saving loan details:', error);
        }
    };

    return (
        <>
            <Row className="dsa-detail-view-header-row" style={{ padding: '10px' }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col>
                        <div>Previous Loan Details:</div>
                    </Col>
                    {!editingMode && (
                        <Col className="d-flex justify-content-end">
                            <Button style={{ width: "80px" }} onClick={() => setEditingMode(true)}>Edit</Button>
                        </Col>
                    )}
                </Row>

                <Row style={{ marginBottom: '10px' }}>
                    <Col>
                        <label>
                            <input
                                type="radio"
                                name="hasPreviousLoans"
                                value="yes"
                                checked={hasPreviousLoans === 'yes'}
                                onChange={() => setHasPreviousLoans('yes')}
                                disabled={!editingMode}
                            />
                            Yes
                        </label>
                        <label style={{ marginLeft: '10px' }}>
                            <input
                                type="radio"
                                name="hasPreviousLoans"
                                value="no"
                                checked={hasPreviousLoans === 'no'}
                                onChange={() => setHasPreviousLoans('no')}
                                disabled={!editingMode}
                            />
                            No
                        </label>
                    </Col>
                </Row>

                {hasPreviousLoans === 'yes' && (
                    <>
                        <Row className='profile-address-single-row'>
                            <Col><span className="profile-finance">Finance Name</span></Col>
                            <Col><span className="profile-finance">Year of Loan</span></Col>
                            <Col><span className="profile-finance">Loan Amount</span></Col>
                            <Col><span className="profile-finance">Outstanding Amount</span></Col>
                        </Row>
                        {loanDetails && loanDetails.length > 0 ? (
                            loanDetails.map((loan, index) => (
                                <Row key={loan._id || index} className='profile-address-single-row previous-loan-delete'>
                                    <Col>
                                        <input
                                            disabled={!editingMode}
                                            className="input-box-address"
                                            placeholder='Finance Name'
                                            name="financeName"
                                            type="text"
                                            value={loan.financeName || ''}
                                            onChange={(e) => handleLoanChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            disabled={!editingMode}
                                            className="input-box-address"
                                            name="yearOfLoan"
                                            placeholder='Year of Loan'
                                            type="number"
                                            value={loan.yearOfLoan || ''}
                                            onChange={(e) => handleLoanChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            disabled={!editingMode}
                                            className="input-box-address"
                                            name="loanAmount"
                                            placeholder='Loan Amount'
                                            type="number"
                                            value={loan.loanAmount || ''}
                                            onChange={(e) => handleLoanChange(index, e)}
                                        />
                                    </Col>
                                    <Col>
                                        <input
                                            disabled={!editingMode}
                                            className="input-box-address"
                                            name="outstandingAmount"
                                            placeholder='Outstanding Amount'
                                            type="number"
                                            value={loan.outstandingAmount || ''}
                                            onChange={(e) => handleLoanChange(index, e)}
                                        />
                                    </Col>
                                    {editingMode && (
                                        <Col lg={1}>
                                            <IoCloseSharp
                                                style={{ color: 'red', cursor: 'pointer' }}
                                                size={30}
                                                onClick={() => deleteLoanRow(index, loan._id)}
                                            />
                                        </Col>
                                    )}
                                </Row>
                            ))
                        ) : (
                            <Row>
                                <Col>No Previous Loan Available.</Col>
                            </Row>
                        )}
                        <div>
                            <Button disabled={!editingMode} onClick={addLoanRow} style={{ marginBottom: '10px' }}>Add Loan Details</Button>
                        </div>
                    </>
                )}

                <Row>
                    <Col>
                        {editingMode && (
                            <>
                                <Button onClick={handlePreviousLoanSave}>Save Loan Details</Button>
                            </>
                        )}
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default Uks_Customer_Previous_Loan_Details;
