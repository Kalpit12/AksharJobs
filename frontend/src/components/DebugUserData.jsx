import React from 'react';

const DebugUserData = () => {
  const userFirstName = localStorage.getItem('userFirstName');
  const userLastName = localStorage.getItem('userLastName');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Debug User Data:</h4>
      <p>First Name: {userFirstName || 'undefined'}</p>
      <p>Last Name: {userLastName || 'undefined'}</p>
      <p>User ID: {userId || 'undefined'}</p>
      <p>Role: {role || 'undefined'}</p>
      <p>Token: {token ? 'Present' : 'Missing'}</p>
    </div>
  );
};

export default DebugUserData;
