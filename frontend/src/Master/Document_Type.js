import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const DocumentTypeForm = () => {
  const [documentType, setDocumentType] = useState('');
  const [documentTypes, setDocumentTypes] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({ id: null, type: '' });
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const response = await axios.get('https://uksinfotechsolution.in:8000/api/document-type');
      setDocumentTypes(response.data);
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://uksinfotechsolution.in:8000/api/document-type', { documenttype: documentType });
      setMessage(response.data.message);
      setDocumentType('');
      setError('');
      fetchDocumentTypes();
    } catch (error) {
      console.error('Error saving document type:', error);
      setMessage('');
      setError('Failed to save document type');
    }
  };

  const handleEditClick = (type) => {
    setCurrentEdit({ id: type._id, type: type.type });
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setCurrentEdit({ ...currentEdit, type: e.target.value });
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(`https://uksinfotechsolution.in:8000/api/document-type/${currentEdit.id}`, { documenttype: currentEdit.type });
      setMessage(response.data.message);
      setEditModal(false);
      fetchDocumentTypes();
    } catch (error) {
      console.error('Error updating document type:', error);
      setMessage('');
      setError('Failed to update document type');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`https://uksinfotechsolution.in:8000/api/document-type/${id}`);
      setMessage(response.data.message);
      fetchDocumentTypes();
    } catch (error) {
      console.error('Error deleting document type:', error);
      setMessage('');
      setError('Failed to delete document type');
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`} style={{ padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Add Document Type</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="documentType" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Document Type:</label>
            <input
              type="text"
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>Save Document Type</button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}

        <ListGroup style={{ marginTop: '20px' }}>
          {documentTypes.map(type => (
            <ListGroup.Item key={type._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {type.type}
              <div>
                <Button variant="warning" onClick={() => handleEditClick(type)} style={{ marginLeft: '10px' }}>Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(type._id)} style={{ marginLeft: '10px' }}>Delete</Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>

        <Modal show={editModal} onHide={() => setEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Document Type</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>Document Type</Form.Label>
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
            <Button variant="primary" onClick={handleEdit} style={{ background: '#007bff', color: '#fff' }}>Save changes</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default DocumentTypeForm;
