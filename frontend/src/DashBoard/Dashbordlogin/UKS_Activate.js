import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UKS_Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/uks/activate/${token}`);
        const data = await response.json();

        if (response.ok) {
         
            navigate('/uks/login');
          
        } else {
          // window.alert('Activation failed: ' + (data.error || 'Unknown error'));
          
        }
      } catch (error) {
        console.error('Error activating account:', error);
        // window.alert('Activation failed: ' + error.message);
      }
    };

    activateAccount();
  }, [token, navigate]);

  return <h2>Activating your account...</h2>;
};

export default UKS_Activate;
