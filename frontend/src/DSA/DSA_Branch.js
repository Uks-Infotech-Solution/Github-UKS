import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoCloseSharp } from 'react-icons/io5';

const DSA_Branch_Details = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dsaId } = location.state || {};

    const [BranchDetails, setBranchDetails] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState(''); // 'success' or 'error'
    const [editingMode, setEditingMode] = useState(false);

    useEffect(() => {
        const fetchBranchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/dsa/BranchDetails/${dsaId}`);
                setBranchDetails(response.data.data);
            } catch (error) {
                console.error('Error fetching branch details:', error);
            }
        };

        if (dsaId) {
            fetchBranchDetails();
        }
    }, [dsaId]);

    const handleBranchChange = (index, event) => {
        const { name, value } = event.target;
        const updatedBranchDetails = [...BranchDetails];
        updatedBranchDetails[index] = { ...updatedBranchDetails[index], [name]: value };
        setBranchDetails(updatedBranchDetails);
    };

    const deleteBranchRow = async (index, branchId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/dsa/BranchDetails/${branchId}`);
            if (response.status === 200) {
                const updatedBranchDetails = [...BranchDetails];
                updatedBranchDetails.splice(index, 1); // Remove the branch from the state
                setBranchDetails(updatedBranchDetails);
                setModalMessage('Branch detail deleted successfully.');
                setModalType('success');
                setShowModal(true);
                setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
            }
        } catch (error) {
            console.error('Error deleting branch detail:', error);
            setModalMessage('Error deleting branch detail.');
            setModalType('error');
            setShowModal(true);
            setTimeout(() => setShowModal(false), 2000); // Hide modal after 2 seconds
        }
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
                    {!editingMode && (
                        <Col className="d-flex justify-content-end">
                            <Button style={{ width: "80px" }} onClick={() => setEditingMode(true)}>Edit</Button>
                        </Col>
                    )}
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
                            <Col><input disabled={!editingMode} className="input-box-address" placeholder='Branch Name' name="branchName" type="text" value={branch.branchName || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input disabled={!editingMode} className="input-box-address" name="branchAddress" placeholder='Branch Address' type="text" value={branch.branchAddress || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input disabled={!editingMode} className="input-box-address" name="branchManager" placeholder='Branch Manager' type="text" value={branch.branchManager || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col><input disabled={!editingMode} className="input-box-address" name="branchContact" placeholder='Branch Contact' type="Number" value={branch.branchContact || ''} onChange={(e) => handleBranchChange(index, e)} /></Col>
                            <Col>
                                <select disabled={!editingMode} className="input-box-address" name="branchStatus" value={branch.branchStatus || ''} onChange={(e) => handleBranchChange(index, e)}>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </Col>
                            {editingMode && (
                                <Col lg={1}>
                                    <IoCloseSharp
                                        style={{ color: 'red', cursor: 'pointer' }}
                                        size={30}
                                        onClick={() => deleteBranchRow(index, branch._id)}
                                    />
                                </Col>
                            )}
                        </Row>
                    ))}
                    <div>
                        <Button disabled={!editingMode} onClick={addBranchRow} style={{ marginBottom: '10px' }}>Add Branch Details</Button>
                    </div>
                </>
                <Row>
                    <Col>
                        {editingMode && (
                            <>
                                <Button onClick={handleBranchSave}>Save Branch Details</Button>
                            </>
                        )}
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

export default DSA_Branch_Details;
