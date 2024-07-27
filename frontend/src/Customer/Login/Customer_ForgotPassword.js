import React, { useState } from 'react';
import axios from 'axios';

const Customer_ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await axios.post('https://uksinfotechsolution.in:8000/customer/forgotpassword', { email });
=======
      const response = await axios.post('https://localhost:8000/customer/forgotpassword', { email });
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
      setMessage(response.data.message || 'Password Reset Link has been sent to Your Email-id');
      setShowModal(true); // Show modal on successful email send
    } catch (error) {
      console.error('Error sending reset link:', error);
      setMessage('Error sending reset link');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setMessage(''); // Clear message when closing modal
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.header}>Forgot Password</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
          >
            Send Reset Link
          </button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
      </div>

      {/* Modal for Success Message */}
      {showModal && (
        <div style={styles.modalBackground}>
          <div style={styles.modal}>
            <p style={styles.modalMessage}>{message}</p>
            <button style={styles.modalButton} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    animation: 'fadeIn 1s ease-in-out',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    animation: 'slideIn 0.5s ease-in-out',
  },
  header: {
    marginBottom: '20px',
    color: '#333333',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    animation: 'fadeIn 1s ease-in-out',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    padding: '10px',
    marginBottom: '20px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  button: {
    padding: '10px',
    backgroundColor: '#2492eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#217ac0',
  },
  message: {
    marginTop: '20px',
    color: '#333333',
    fontSize: '0.9rem',
    animation: 'fadeIn 0.5s ease-in-out',
  },
  modalBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure modal is on top of everything
  },
  modal: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '300px',
    width: '100%',
    textAlign: 'center',
  },
  modalMessage: {
    margin: '0',
    color: '#333333',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  modalButton: {
    padding: '10px',
    backgroundColor: '#2492eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Customer_ForgotPassword;
