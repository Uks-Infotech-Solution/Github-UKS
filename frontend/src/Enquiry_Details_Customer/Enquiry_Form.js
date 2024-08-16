import React, { useState } from 'react';
import axios from 'axios';
import { useSidebar } from '../Customer/Navbar/SidebarContext';

const Enquiry = () => {
  const { isSidebarExpanded } = useSidebar();
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mobileNumberPattern = /^[0-9]{10}$/;
    if (!formData.contactNumber || !mobileNumberPattern.test(formData.contactNumber)) {
      setErrorMessage('Please enter a valid 10-digit contact number.');
      alert('Please enter a valid 10-digit contact number.');
      return;
    }

    axios.post('https://uksinfotechsolution.in:8000/api/enquiry/form', formData)
      .then(response => {
        alert('Enquiry Successful');
        setFormData({ name: '', contactNumber: '', email: '' }); // Clear the form
        setErrorMessage(''); // Clear error message
      })
      .catch(error => {
        if (error.response && error.response.data.error) {
          setErrorMessage(error.response.data.error); // Set error message from response
        } else {
          console.error('There was an error!', error);
          setErrorMessage('Error submitting enquiry'); // Generic error message
        }
        alert(errorMessage); // Show error message
      });
  };

  const formContainerStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    margin: '50px auto',
    width: '90%',
    maxWidth: '400px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease-in-out'
  };

  const formGroupStyle = {
    marginBottom: '20px',
    animation: 'slideIn 0.5s ease-in-out'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '16px'
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    ':hover': {
      backgroundColor: '#45a049'
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={formContainerStyle}
      className={`Customer-basic-view-container ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}
    >
      <div style={formGroupStyle}>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Contact Number"
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Full Name"
          style={inputStyle}
        />
      </div>
      <div style={formGroupStyle}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        style={buttonStyle}
      >
        Submit
      </button>
    </form>
  );
};

export default Enquiry;
