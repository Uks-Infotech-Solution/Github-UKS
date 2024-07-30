import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Employee_Type = () => {
  const [employeeType, setEmployeeType] = useState('');
  const [employeeTypes, setEmployeeTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: null, type: '' });
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    fetchEmployeeTypes();
  }, []);

  const fetchEmployeeTypes = async () => {
    try {
      const response = await axios.get('https://uksinfotechsolution.in:8000/api/employee-types');
      setEmployeeTypes(response.data);
    } catch (error) {
      console.error('Error fetching employee types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://uksinfotechsolution.in:8000/api/employee-type', { employeeType });
      setMessage(response.data.message);
      setEmployeeType('');
      setError('');
      fetchEmployeeTypes();
    } catch (error) {
      console.error('Error saving employee type:', error);
      setMessage('');
      if (error.response && error.response.status === 400) {
        setError('Employee type already exists');
      } else {
        setError('Failed to save employee type');
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log('Current Edit State:', currentEdit); // Debug log
    try {
      const response = await axios.put(`https://uksinfotechsolution.in:8000/api/employee-type/${currentEdit.id}`, { employeeType: currentEdit.type });
      setMessage('Employee type updated successfully');
      setEditModal(false);
      setCurrentEdit({ id: null, type: '' });
      fetchEmployeeTypes();
    } catch (error) {
      console.error('Error updating employee type:', error);
      setMessage('');
      setError('Failed to update employee type');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://uksinfotechsolution.in:8000/api/employee-type/${id}`);
      setMessage('Employee type deleted successfully');
      fetchEmployeeTypes();
    } catch (error) {
      console.error('Error deleting employee type:', error);
      setMessage('');
      setError('Failed to delete employee type');
    }
  };

  const openEditModal = (type) => {
    setCurrentEdit({ id: type._id, type: type.type });
    setEditModal(true);
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Add Employee Type</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="employeeType" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Employee Type:</label>
            <input
              type="text"
              id="employeeType"
              value={employeeType}
              onChange={(e) => setEmployeeType(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Save Employee Type</button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
        <h3 style={{ marginTop: '40px', textAlign: 'center', color: '#333' }}>Employee Types</h3>
        <ListGroup>
          {employeeTypes.map((type) => (
            <ListGroup.Item key={type._id} className="d-flex justify-content-between align-items-center">
              {type.type}
              <div>
                <Button variant="warning" size="sm" onClick={() => openEditModal(type)}>Edit</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(type._id)} style={{ marginLeft: '10px' }}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      
      <Modal show={editModal} onHide={() => setEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEdit}>
            <Form.Group>
              <Form.Label>Employee Type</Form.Label>
              <Form.Control
                type="text"
                value={currentEdit.type}
                onChange={(e) => setCurrentEdit({ ...currentEdit, type: e.target.value })}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Employee_Type;
