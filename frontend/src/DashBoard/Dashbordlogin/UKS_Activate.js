import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UKS_Activate = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const activateAccount = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch(`https://uksinfotechsolution.in:8000/uks/activate/${token}`);
=======
        const response = await fetch(`https://localhost:8000/uks/activate/${token}`);
>>>>>>> eb7c52a19f1c5b021391d574ac9130ac7f2e9e9a
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
