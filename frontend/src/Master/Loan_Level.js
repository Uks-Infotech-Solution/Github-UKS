import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Loan_Level = () => {
  const [loanLevel, setLoanLevel] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loanLevels, setLoanLevels] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null); // Store the ID of the loan level being edited
  const { isSidebarExpanded } = useSidebar();

  useEffect(() => {
    const fetchLoanLevels = async () => {
      try {
        const response = await axios.get('https://uksinfotechsolution.in:8000/api/loan-levels');
        setLoanLevels(response.data);
      } catch (error) {
        console.error('Error fetching loan levels:', error);
        setError('Failed to fetch loan levels');
      }
    };

    fetchLoanLevels();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      try {
        const response = await axios.put(`https://uksinfotechsolution.in:8000/api/loan-levels/${editId}`, { loanLevel });
        setMessage(response.data.message);
        setLoanLevels(loanLevels.map((level, index) => index === editIndex ? { ...level, type: loanLevel } : level));
        setLoanLevel('');
        setIsEditing(false);
        setEditIndex(null);
        setEditId(null); // Reset the ID after editing
        setError('');
      } catch (error) {
        console.error('Error updating loan level:', error);
        setMessage('');
        setError('Failed to update loan level');
      }
    } else {
      try {
        const response = await axios.post('https://uksinfotechsolution.in:8000/api/loan-levels', { loanLevel });
        setMessage(response.data.message);
        setLoanLevels([...loanLevels, { type: loanLevel }]);
        setLoanLevel('');
        setError('');
      } catch (error) {
        console.error('Error saving loan level:', error);
        setMessage('');
        if (error.response && error.response.data.error === 'Loan Level already exists') {
          setError('Loan Level already exists');
        } else {
          setError('Failed to save loan level');
        }
      }
    }
  };

  const handleEdit = (index) => {
    setLoanLevel(loanLevels[index].type);
    setIsEditing(true);
    setEditIndex(index);
    setEditId(loanLevels[index]._id); // Set the ID of the loan level being edited
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`https://uksinfotechsolution.in:8000/api/loan-levels/${loanLevels[index]._id}`);
      setLoanLevels(loanLevels.filter((_, i) => i !== index));
      setMessage('Loan Level deleted successfully');
      setError('');
    } catch (error) {
      console.error('Error deleting loan level:', error);
      setMessage('');
      setError('Failed to delete loan level');
    }
  };

  return (
    <Container fluid className={`apply-loan-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div style={{ maxWidth: '600px', margin: 'auto', paddingTop: '20px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', color: '#333' }}>{isEditing ? 'Edit Loan Level' : 'Add Loan Level'}</h2>
        <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="loanLevel" style={{ display: 'block', marginBottom: '5px', fontSize: '16px' }}>Loan Level:</label>
            <input
              type="text"
              id="loanLevel"
              value={loanLevel}
              onChange={(e) => setLoanLevel(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
          </div>
          <button type="submit" style={{ background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
            {isEditing ? 'Save Changes' : 'Save Loan Level'}
          </button>
        </form>
        {message && <p style={{ color: 'green', textAlign: 'center', marginTop: '20px' }}>{message}</p>}
        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>{error}</p>}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '10px', textAlign: 'center', color: '#333' }}>Existing Loan Levels</h3>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            {loanLevels.map((level, index) => (
              <li key={index} style={{ background: '#fff', marginBottom: '10px', padding: '10px', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {level.type}
                <div>
                  <button onClick={() => handleEdit(index)} style={{ marginRight: '10px', background: '#28a745', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(index)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Loan_Level;
