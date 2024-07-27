import React, { useState, useEffect } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

function DSA_Loan ({onSuccess,dsaId }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [LoanDetails, setLoanDetails] = useState([]);
    const [requiredTypes, setRequiredTypes] = useState([]); // State to store required types
    const [successMessage, setSuccessMessage] = useState('');
    const [editingMode, setEditingMode] = useState(false);

    useEffect(() => {
        

        const fetchRequiredTypes = async () => {
            try {
<<<<<<< HEAD
                const response = await axios.get('https://uksinfotechsolution.in:8000/api/dsa/required/type');
=======
                const response = await axios.get('https://localhost:8000/api/dsa/required/type');
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
                if (response.status === 200) {
                    console.log(response.data);
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
<<<<<<< HEAD
            const response = await axios.delete(`https://uksinfotechsolution.in:8000/api/dsa/loanDetails/${loanId}`);
=======
            const response = await axios.delete(`https://localhost:8000/api/dsa/loanDetails/${loanId}`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
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
<<<<<<< HEAD
            const response = await axios.post('https://uksinfotechsolution.in:8000/api/dsa/saveLoanDetails', { dsaId, loanDetails: LoanDetails });
=======
            const response = await axios.post('https://localhost:8000/api/dsa/saveLoanDetails', { dsaId, loanDetails: LoanDetails });
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
            if (response.status === 200) {
                setSuccessMessage('Loan details saved successfully.');
                alert('Loan details saved successfully.');
                onSuccess();
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
                        <Col><input  className="input-box-address" placeholder='Type of Loan' name="typeOfLoan" type="text" value={loan.typeOfLoan || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col><input  className="input-box-address" name="requiredDays" placeholder='Required Days' type="number" value={loan.requiredDays || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col><input className="input-box-address" name="requiredDocument" placeholder='Required Document' type="text" value={loan.requiredDocument || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        <Col>
                            <Select
                                isMulti
                                options={requiredTypes}
                                value={loan.requiredType.split(', ').map(type => ({ value: type, label: type }))}
                                onChange={(selectedOptions) => handleSelectChange(index, selectedOptions)}
                                
                                // className='input-box-address'
                            />
                        </Col>
                        <Col><input  className="input-box-address" name="requiredCibilScore" placeholder='Required Cibil Score' type="text" value={loan.requiredCibilScore || ''} onChange={(e) => handleLoanChange(index, e)} /></Col>
                        
                    </Row>
                ))}
                <div>
                <Button  onClick={addLoanRow} style={{ marginBottom: '10px' }}>Add Loan Details</Button>
                </div>
            </>
            <Row>
                <Col>
                            <Button onClick={handlePreviousLoanSave}>Save Loan Details</Button>
                  
                </Col>
            </Row>
            </Row>
        </>
    );
};

export default DSA_Loan;
