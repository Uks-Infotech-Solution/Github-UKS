import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const DSA_ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for showing password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing confirm password
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password does not match Confirm Password');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/dsa/resetpassword/${token}`, { password });
      setShowModal(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/dsa/login');
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
      width: 'calc(100% )',
      padding: '12px 20px',
      margin: '8px 0',
      display: 'inline-block',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      position: 'relative',
    },
    icon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      // transform: 'translateY(-50%)',
      cursor: 'pointer',
      zIndex: '1',
      color: '#999999',
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
    errorMessage: {
      color: 'red',
      marginBottom: '20px',
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
        <h2 style={styles.heading}>Reset Password</h2>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <label>New Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            style={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <label>Confirm Password:</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />
          <FontAwesomeIcon
            icon={showConfirmPassword ? faEyeSlash : faEye}
            style={styles.icon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </div>
        {error && <p style={styles.errorMessage}>{error}</p>}
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Reset Password
        </button>
      </form>
      {showModal && (
        <>
          <div style={styles.overlay} />
          <div style={styles.modal}>
            <p>Your Password has been Changed Successfully.</p>
            <button
              onClick={handleCloseModal}
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

export default DSA_ResetPassword;
