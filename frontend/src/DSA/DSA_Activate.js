import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DSA_Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`https://localhost:8000/dsa/activate/${token}`);
        const data = await response.json(); // Parse the response to JSON

        if (response.ok) {
          // alert('Account Activated: ' + data.message);  
          // Redirect to /dsa/login after successful activation
          navigate('/dsa/login');
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

export default DSA_Activate;
