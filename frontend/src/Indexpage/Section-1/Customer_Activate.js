import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Customer_Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://148.251.230.14:8000/customer/activate/${token}`);
        const data = await response.json(); // Parse the response to JSON

        if (response.ok) {
          // alert('Account Activated: ' + data.message);
          // Redirect to /customer/login after successful activation
          navigate('/customer/login');
        } else {
          // alert('Activation failed: ' + (data.message || data.error));
        }
      } catch (error) {
        console.error('Error activating account:', error);
        // alert('Activation failed');
      }
    };

    activateAccount();
  }, [token, navigate]);

  return <h2>Activating your account...</h2>;
};

export default Customer_Activate;
