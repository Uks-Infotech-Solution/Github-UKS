import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Required_Type = () => {
  const [documentType, setDocumentType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isSidebarExpanded } = useSidebar();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/dsa/required/type', { requiredType: documentType });
      setMessage(response.data.message);
      setDocumentType('');
      setError('');
    } catch (error) {
      console.error('Error saving document type:', error);
      setMessage('');
      setError('Failed to save document type');
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>Add DSA Required Type</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="documentType" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Required Type:</label>
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
      </div>
    </Container>
  );
};

export default Required_Type;
