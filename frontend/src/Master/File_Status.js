import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Modal, Button, Form } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const File_Status = () => {
  const [fileStatus, setFileStatus] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [fileStatuses, setFileStatuses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ type: '' });
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    const fetchFileStatuses = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/api/file-status');
        setFileStatuses(response.data);
      } catch (error) {
        console.error('Error fetching file statuses:', error);
        setError('Failed to fetch file statuses');
      }
    };

    fetchFileStatuses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const response = await axios.put(`https://uksinfotechsolution.in:8000/api/file-status/${editId}`, { fileStatus });
        setMessage(response.data.message);
        setFileStatuses(fileStatuses.map((status, index) => index === editIndex ? { ...status, type: fileStatus } : status));
        setFileStatus('');
        setIsEditing(false);
        setEditIndex(null);
        setEditId(null);
        setError('');
      } catch (error) {
        console.error('Error updating file status:', error);
        setMessage('');
        setError('Failed to update file status');
      }
    } else {
      try {
        const response = await axios.post('https://uksinfotechsolution.in:8000/api/file-status', { fileStatus });
        setMessage(response.data.message);
        setFileStatuses([...fileStatuses, { type: fileStatus, _id: response.data._id }]);
        setFileStatus('');
        setError('');
      } catch (error) {
        console.error('Error saving file status:', error);
        setMessage('');
        setError('Failed to save file status');
      }
    }
  };

  const handleEdit = (index) => {
    setCurrentEdit(fileStatuses[index]);
    setIsEditing(true);
    setEditIndex(index);
    setEditId(fileStatuses[index]._id);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setCurrentEdit({ ...currentEdit, type: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`https://uksinfotechsolution.in:8000/api/file-status/${editId}`, { fileStatus: currentEdit.type });
      setMessage(response.data.message);
      setFileStatuses(fileStatuses.map((status, index) => index === editIndex ? { ...status, type: currentEdit.type } : status));
      setIsEditing(false);
      setEditIndex(null);
      setEditId(null);
      setEditModal(false);
      setError('');
    } catch (error) {
      console.error('Error updating file status:', error);
      setMessage('');
      setError('Failed to update file status');
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`https://uksinfotechsolution.in:8000/api/file-status/${fileStatuses[index]._id}`);
      setFileStatuses(fileStatuses.filter((_, i) => i !== index));
      setMessage('File status deleted successfully');
      setError('');
    } catch (error) {
      console.error('Error deleting file status:', error);
      setMessage('');
      setError('Failed to delete file status');
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>{isEditing ? 'Edit File Status' : 'Add File Status'}</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="fileStatus" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>File Status:</label>
            <input
              type="text"
              id="fileStatus"
              value={fileStatus}
              onChange={(e) => setFileStatus(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            {isEditing ? 'Save Changes' : 'Save File Status'}
          </button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '15px', textAlign: 'center', color: '#333' }}>File Statuses</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {fileStatuses.map((status, index) => (
              <li key={status._id} style={{ background: '#fff', padding: '10px', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{status.type}</span>
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
            <Modal.Title>Edit File Status</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>File Status</Form.Label>
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

export default File_Status;
