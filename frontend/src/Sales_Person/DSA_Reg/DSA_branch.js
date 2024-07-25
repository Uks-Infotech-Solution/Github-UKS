import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

function DSA_Branch ({onSuccess,dsaId }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [BranchDetails, setBranchDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); // 'success' or 'error'
    const [editingMode, setEditingMode] = useState(false);

    const handleBranchChange = (index, event) => {
        const { name, value } = event.target;
        const updatedBranchDetails = [...BranchDetails];
        updatedBranchDetails[index] = { ...updatedBranchDetails[index], [name]: value };
        setBranchDetails(updatedBranchDetails);
    };

    const addBranchRow = () => {
        setBranchDetails([...BranchDetails, { dsaId, branchName: '', branchAddress: '', branchManager: '', branchContact: '', branchStatus: 'Active' }]);
    };

    const handleBranchSave = async () => {
        try {
            const response = await axios.post('http://localhost:8000/dsa/saveBranchDetails', { dsaId, branchDetails: BranchDetails });
            if (response.status === 200) {
                setModalMessage('Branch details saved successfully.');
                setModalType('success');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
                setEditingMode(false); // Exit edit mode after saving
                alert('Branch details saved successfully')
                onSuccess();
            }
        } catch (error) {
            console.error('Error saving branch details:', error);
            setModalMessage('Error saving branch details.');
            setModalType('error');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
        }
    };

    return (
        <>
            <Row className="dsa-detail-view-header-row" style={{ padding: '10px' }}>
                <Row style={{ alignItems: 'center' }}>
                    <Col>
                        <h5>Branch Details:</h5>
                    </Col>
                </Row>
                <>
                    <Row className='profile-address-single-row'>
                        <Col><span className="profile-finance">Branch Name</span></Col>
                        <Col><span className="profile-finance">Branch Address</span></Col>
                        <Col><span className="profile-finance">Branch Manager</span></Col>
                        <Col><span className="profile-finance">Branch Contact</span></Col>
                        <Col><span className="profile-finance">Branch Status</span></Col>
                    </Row>
                    {BranchDetails.map((branch, index) => (
                        <Row key={branch._id || index} className='profile-address-single-row previous-branch-delete'>
                            <Col><input  className="input-box-address" placeholder='Branch Name' name="branchName" type="text" value={branch.branchName || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input  className="input-box-address" name="branchAddress" placeholder='Branch Address' type="text" value={branch.branchAddress || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input  className="input-box-address" name="branchManager" placeholder='Branch Manager' type="text" value={branch.branchManager || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input className="input-box-address" name="branchContact" placeholder='Branch Contact' type="Number" value={branch.branchContact || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col>
                                <select  className="input-box-address" name="branchStatus" value={branch.branchStatus || ''} onChange={(e) => handleBranchChange(index, e)}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </Col>
                           
                        </Row>
                    ))}
                    <div>
                        <Button  onClick={addBranchRow} style={{ marginBottom: '10px' }}>Add Branch Details</Button>
                    </div>
                </>
                <Row>
                    <Col>
                                <Button onClick={handleBranchSave}>Save Branch Details</Button>
                            
                    </Col>
                </Row>
            </Row>
            {/* Modal for alerts */}
            <Modal show={showModal} onHide={() => setShowModal(false)} dialogClassName="custom-modal">
                <Modal.Body style={{ color: modalType === "success" ? "green" : "red" }}>
                    {modalMessage}
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer> */}
            </Modal>
        </>
    );
};

export default DSA_Branch;
