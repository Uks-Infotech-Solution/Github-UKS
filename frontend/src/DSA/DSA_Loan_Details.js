import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

const DSA_Loan_Details = () => {
    const location = useLocation();
    const { dsaId } = location.state || {};

    const [LoanDetails, setLoanDetails] = useState([]);
    const [requiredTypes, setRequiredTypes] = useState([]); // State to store required types
    const [successMessage, setSuccessMessage] = useState('');
    const [editingMode, setEditingMode] = useState(false);

    useEffect(() => {
        const fetchLoanDetails = async () => {
            try {
                const response = await axios.get(`https://uksinfotechsolution.in:8000/api/dsa/${dsaId}/loanDetails`);
                if (response.status === 200) {
                    setLoanDetails(response.data.loanDetails);
                }
            } catch (error) {
                console.error('Error fetching loan details:', error);
            }
        };

        const fetchRequiredTypes = async () => {
            try {
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/required/type');
                if (response.status === 200) {
                    // console.log(response.data);
                    const options = response.data.map((type) => ({
                        value: type.requiredType,
                        label: type.requiredType
                    }));
                    setRequiredTypes(options);
                }
            } catch (error) {
                console.error('Error fetching required types:', error);
            }
        };

        fetchLoanDetails();
        fetchRequiredTypes();
    }, [dsaId]);

    const handleLoanChange = (index, event) => {
        const { name, value } = event.target;
        const updatedLoanDetails = [...LoanDetails];
        updatedLoanDetails[index] = { ...updatedLoanDetails[index], [name]: value };
        setLoanDetails(updatedLoanDetails);
    };

    const handleSelectChange = (index, selectedOptions) => {
        const updatedLoanDetails = [...LoanDetails];
        updatedLoanDetails[index] = { ...updatedLoanDetails[index], requiredType: selectedOptions.map(option => option.value).join(', ') };
        setLoanDetails(updatedLoanDetails);
    };

    const deleteLoanRow = async (index, loanId) => {
        try {
            const response = await axios.delete(`https://uksinfotechsolution.in:8000/api/dsa/loanDetails/${loanId}`);
            if (response.status === 200) {
                const updatedLoanDetails = [...LoanDetails];
                updatedLoanDetails.splice(index, 1);
                setLoanDetails(updatedLoanDetails);
                setSuccessMessage('Loan detail deleted successfully.');
            }
        } catch (error) {
            console.error('Error deleting loan detail:', error);
        }
    };

    const addLoanRow = () => {
        setLoanDetails([...LoanDetails, { dsaId, typeOfLoan: '', requiredDays: '', requiredDocument: '', requiredType: '', requiredCibilScore: '' }]);
    };

    const handlePreviousLoanSave = async () => {
        try {
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/saveLoanDetails', { dsaId, loanDetails: LoanDetails });
            if (response.status === 200) {
                setSuccessMessage('Loan details saved successfully.');
                alert('Loan details saved successfully.');

                setEditingMode(false); // Exit edit mode after saving
            }
        } catch (error) {
            console.error('Error saving loan details:', error);
        }
    };

    return (
        <>
        <Row className="dsa-detail-view-header-row" style={{ padding: '10px'}}>
            <Row style={{ alignItems: 'center' }}>
                <Col>
                    <h5>Loan Details:-</h5>
                </Col>
                {!editingMode && (
                    <Col className="d-flex justify-content-end">
                        <Button style={{ width: "80px"}} onClick={() => setEditingMode(true)}>Edit</Button>
                    </Col>
                )}
            </Row>
            <>
                <Row className='profile-address-single-row' >
                    <Col><span className="profile-finance">Type of Loan</span></Col>
                    <Col><span className="profile-finance">Required Days</span></Col>
                    <Col><span className="profile-finance">Required Document</span></Col>
                    <Col><span className="profile-finance">Required type</span></Col>
                    <Col><span className="profile-finance">Required Cibil Score</span></Col>
                </Row>
                {LoanDetails.map((loan, index) => (
                    <Row key={loan._id || index} className='profile-address-single-row previous-loan-delete'>
                        <Col><input disabled={!editingMode} className="input-box-address" placeholder='Type of Loan' name="typeOfLoan" type="text" value={loan.typeOfLoan || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col><input disabled={!editingMode} className="input-box-address" name="requiredDays" placeholder='Required Days' type="number" value={loan.requiredDays || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col><input disabled={!editingMode} className="input-box-address" name="requiredDocument" placeholder='Required Document' type="text" value={loan.requiredDocument || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col>
                            <Select
                                isMulti
                                options={requiredTypes}
                                value={loan.requiredType.split(', ').map(type => ({ value: type, label: type }))}
                                onChange={(selectedOptions) => handleSelectChange(index, selectedOptions)}
                                isDisabled={!editingMode}
                                // className='input-box-address'
                            />
                        </Col>
                        <Col><input disabled={!editingMode} className="input-box-address" name="requiredCibilScore" placeholder='Required Cibil Score' type="text" value={loan.requiredCibilScore || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col lg={1}>
                            <IoCloseSharp
                                style={{ color: 'red', cursor: 'pointer' }}
                                size={30}
                                onClick={() => deleteLoanRow(index, loan._id)}
                            />
                        </Col>
                    </Row>
                ))}
                <div>
                <Button disabled={!editingMode} onClick={addLoanRow} style={{ marginBottom: '10px' }}>Add Loan Details</Button>
                </div>
            </>
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

export default DSA_Loan_Details;
