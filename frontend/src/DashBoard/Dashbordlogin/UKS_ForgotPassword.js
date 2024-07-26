import React, { useState } from 'react';
import axios from 'axios';

const UKS_ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:8000/uks/forgotpassword', { email });
      setMessage(response.data.message || 'Password Reset Link Sent to Your Email Id');
      setShowModal(true);
    } catch (error) {
      console.error('Error sending reset link:', error);
      setMessage('Error sending reset link');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      padding: '20px',
    },
    form: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      padding: '40px',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center',
    },
    heading: {
      marginBottom: '20px',
      fontSize: '24px',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px 20px',
      margin: '8px 0',
      display: 'inline-block',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '14px 20px',
      margin: '8px 0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      marginTop: '20px',
      color: '#ff0000',
      fontSize: '16px',
    },
    modal: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      textAlign: 'center',
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
    },
    closeModalButton: {
      marginTop: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.heading}>Forgot Password</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Register Email-Id"
          required
          style={styles.input}
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Send Reset Link
        </button>
        {message && <p style={styles.message}>{message}</p>}
      </form>
      {showModal && (
        <>
          <div style={styles.overlay} />
          <div style={styles.modal}>
            <p>The Password Reset Link was Successfully Sended to your Registered Email ID..</p>
            <button
              onClick={() => setShowModal(false)}
              style={styles.closeModalButton}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UKS_ForgotPassword;
