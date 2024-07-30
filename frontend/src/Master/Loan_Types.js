import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Loan_Types = () => {
  const [loanType, setLoanType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loanTypes, setLoanTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ type: '' });
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/api/loan-types');
        setLoanTypes(response.data);
      } catch (error) {
        console.error('Error fetching loan types:', error);
        setError('Failed to fetch loan types');
      }
    };

    fetchLoanTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const response = await axios.put(`https://uksinfotechsolution.in:8000/api/loan-types/${editId}`, { loanType });
        setMessage(response.data.message);
        setLoanTypes(loanTypes.map((type, index) => index === editIndex ? { ...type, type: loanType } : type));
        setLoanType('');
        setIsEditing(false);
        setEditIndex(null);
        setEditId(null);
        setError('');
      } catch (error) {
        console.error('Error updating loan type:', error);
        setMessage('');
        setError('Failed to update loan type');
      }
    } else {
      try {
        const response = await axios.post('https://uksinfotechsolution.in:8000/api/loan-types', { loanType });
        setMessage(response.data.message);
        setLoanTypes([...loanTypes, { type: loanType, _id: response.data._id }]);
        setLoanType('');
        setError('');
      } catch (error) {
        console.error('Error saving loan type:', error);
        setMessage('');
        setError('Failed to save loan type');
      }
    }
  };

  const handleEdit = (index) => {
    setCurrentEdit(loanTypes[index]);
    setIsEditing(true);
    setEditIndex(index);
    setEditId(loanTypes[index]._id);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setCurrentEdit({ ...currentEdit, type: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`https://uksinfotechsolution.in:8000/api/loan-types/${editId}`, { loanType: currentEdit.type });
      setMessage(response.data.message);
      setLoanTypes(loanTypes.map((type, index) => index === editIndex ? { ...type, type: currentEdit.type } : type));
      setIsEditing(false);
      setEditIndex(null);
      setEditId(null);
      setEditModal(false);
      setError('');
    } catch (error) {
      console.error('Error updating loan type:', error);
      setMessage('');
      setError('Failed to update loan type');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`https://uksinfotechsolution.in:8000/api/loan-types/${loanTypes[index]._id}`);
      setLoanTypes(loanTypes.filter((_, i) => i !== index));
      setMessage('Loan type deleted successfully');
      setError('');
    } catch (error) {
      console.error('Error deleting loan type:', error);
      setMessage('');
      setError('Failed to delete loan type');
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>{isEditing ? 'Edit Loan Type' : 'Add Loan Type'}</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="loanType" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Loan Type:</label>
            <input
              type="text"
              id="loanType"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            {isEditing ? 'Save Changes' : 'Save Loan Type'}
          </button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>Loan Types</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {loanTypes.map((type, index) => (
              <li key={type._id} style={{ background: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{type.type}</span>
                <div>
                  <button onClick={() => handleEdit(index)} style={{ background: '#ffc107', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' }}>Edit</button>
                  <button onClick={() => handleDelete(index)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <Modal show={editModal} onHide={() => setEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Loan Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Loan Type</Form.Label>
                <Form.Control
                  type="text"
                  value={currentEdit.type}
                  onChange={handleEditChange}
                  style={{ fontSize: '16px' }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditModal(false)}>Close</Button>
            <Button variant="primary" onClick={handleSaveChanges} style={{ background: '#007bff', color: '#fff' }}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default Loan_Types;
