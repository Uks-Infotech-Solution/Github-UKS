import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Customer_ResetPassword = () => {
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
      await axios.post(`http://localhost:8000/customer/resetpassword/${token}`, { password });
      setShowModal(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Error resetting password');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/customer/login');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5',
      padding: '20px',
      animation: 'fadeIn 1s ease-in-out',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        animation: 'slideIn 0.5s ease-in-out',
      }}>
        <h2 style={{
          marginBottom: '20px',
          color: '#333333',
          fontSize: '1.5rem',
          fontWeight: 'bold',
        }}>Reset Password</h2>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            marginBottom: '20px',
          }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '1rem',
              color: '#333333',
            }}>New Password:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: 'calc(100% )',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  zIndex: '1',
                  color: '#999999',
                }}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>
          <div style={{
            marginBottom: '20px',
          }}>
            <label style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '1rem',
              color: '#333333',
            }}>Confirm Password:</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  padding: '10px',
                  width: 'calc(100% )',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  transition: 'border-color 0.3s',
                }}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  zIndex: '1',
                  color: '#999999',
                }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button
            type="submit"
            style={{
              padding: '10px',
              backgroundColor: '#2492eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#217ac0'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2492eb'}
          >
            Reset Password
          </button>
        </form>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px',
            width: '100%',
            textAlign: 'center',
          }}>
            <p>Password has been Changed Successfully!</p>
            <button onClick={handleCloseModal} style={{
              padding: '10px',
              backgroundColor: '#2492eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '10px',
              transition: 'background-color 0.3s',
            }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer_ResetPassword;
