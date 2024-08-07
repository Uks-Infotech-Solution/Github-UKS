import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

const Customer_Salaried_Person = () => {
    const location = useLocation();
    const { customerId } = location.state || {};

    const [loanDetails, setLoanDetails] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [editingMode, setEditingMode] = useState(false);

    const fetchLoanDetails = async () => {
        try {
            const response = await axios.get('https://uksinfotechsolution.in:8000/salariedperson', {
                params: { customerId }
            });
    
            if (response.status === 200) {
                // Extract the `salariedPersons` array from the response
                setLoanDetails(response.data.salariedPersons || []);
            }
        } catch (error) {
            console.error('Error fetching loan details:', error);
            setLoanDetails([]);
        }
    };
    

    useEffect(() => {
        if (customerId) {
            fetchLoanDetails();
        }
    }, [customerId]);

    const handleLoanChange = (index, event) => {
        const { name, value } = event.target;
        const updatedLoanDetails = [...loanDetails];
        updatedLoanDetails[index] = { ...updatedLoanDetails[index], [name]: value };
        setLoanDetails(updatedLoanDetails);
    };

    const deleteLoanRow = async (index, loanId) => {
        try {
            const response = await axios.delete(`https://uksinfotechsolution.in:8000/salariedperson/${loanId}`);

            if (response.status === 200) {
                const updatedLoanDetails = loanDetails.filter((_, i) => i !== index);
                setLoanDetails(updatedLoanDetails);
                setSuccessMessage('Loan detail deleted successfully.');
            }
        } catch (error) {
            console.error('Error deleting loan detail:', error);
        }
    };

    const addLoanRow = () => {
        setLoanDetails(prevLoanDetails => {
            // Ensure prevLoanDetails is an array
            if (!Array.isArray(prevLoanDetails)) {
                console.error('Previous loan details is not an array:', prevLoanDetails);
                return [];
            }
            return [
                ...prevLoanDetails,
                { customerId, companyName: '', role: '', monthlySalary: '', workExperience: '' }
            ];
        });
    };

    const handlePreviousLoanSave = async () => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/salariedperson', {
                salariedperson: loanDetails,
                customerId
            });

            if (response.status === 200) {
                setSuccessMessage('Previous Loan details saved successfully.');
                alert('Previous Loan details saved successfully.');
                setEditingMode(false);
                await fetchLoanDetails();
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
                        <div>Salaried Person Details:</div>
                    </Col>
                    {!editingMode && (
                        <Col className="d-flex justify-content-end">
                            <Button style={{ width: '80px' }} onClick={() => setEditingMode(true)}>Edit</Button>
                        </Col>
                    )}
                </Row>
                <Row className='profile-address-single-row'>
                    <Col><span className="profile-finance">Company Name</span></Col>
                    <Col><span className="profile-finance">Role</span></Col>
                    <Col><span className="profile-finance">Monthly Salary</span></Col>
                    <Col><span className="profile-finance">Work Experience</span></Col>
                </Row>
                {loanDetails.length > 0 ? (
                    loanDetails.map((loan, index) => (
                        <Row key={loan._id || index} className='profile-address-single-row previous-loan-delete'>
                            <Col>
                                <input
                                    disabled={!editingMode}
                                    className="input-box-address"
                                    placeholder='Company Name'
                                    name="companyName"
                                    type="text"
                                    value={loan.companyName || ''}
                                    onChange={(e) => handleLoanChange(index, e)}
                                />
                            </Col>
                            <Col>
                                <input
                                    disabled={!editingMode}
                                    className="input-box-address"
                                    name="role"
                                    placeholder='Role'
                                    type="text"
                                    value={loan.role || ''}
                                    onChange={(e) => handleLoanChange(index, e)}
                                />
                            </Col>
                            <Col>
                                <input
                                    disabled={!editingMode}
                                    className="input-box-address"
                                    name="monthlySalary"
                                    placeholder='Salary'
                                    type="number"
                                    value={loan.monthlySalary || ''}
                                    onChange={(e) => handleLoanChange(index, e)}
                                />
                            </Col>
                            <Col>
                                <input
                                    disabled={!editingMode}
                                    className="input-box-address"
                                    name="workExperience"
                                    placeholder='Experience'
                                    type="number"
                                    value={loan.workExperience || ''}
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
                <Row>
                    <Col>
                        {editingMode && (
                            <Button onClick={handlePreviousLoanSave}>Save Loan Details</Button>
                        )}
                    </Col>
                </Row>
            </Row>
        </>
    );
};

export default Customer_Salaried_Person;
