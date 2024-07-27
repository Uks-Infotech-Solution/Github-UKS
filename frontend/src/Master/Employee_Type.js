import React, { useState } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Employee_Type = () => {
  const [employeeType, setEmployeeType] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isSidebarExpanded } = useSidebar();

  const handleSubmit = async (e) => {
    e.preventDefault();
// console.log(employeeType);
    try {
<<<<<<< HEAD
      const response = await axios.post('https://uksinfotechsolution.in:8000/api/employee-type', { employeeType });
=======
      const response = await axios.post('https://localhost:8000/api/employee-type', { employeeType });
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
      setMessage(response.data.message);
      setEmployeeType('')
      setError('');
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
      </div>
    </Container>
  );
};

export default Employee_Type;
