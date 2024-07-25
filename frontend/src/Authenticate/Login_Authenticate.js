import React from 'react';
import { useParams, Link } from 'react-router-dom';

function Login_Authenticate() {
  const { loginType } = useParams();
  localStorage.setItem('loginType', loginType);
  console.log('Login type:', loginType); // For debugging purposes

  return (
    <div>
      {/* Add your login form or authentication logic here */}
      <Link
        to={{
          pathname: '/',
          state: { loginType: loginType }
        }}
      >
        Go to Next Component
      </Link>
    </div>
  );
}

export default Login_Authenticate;
