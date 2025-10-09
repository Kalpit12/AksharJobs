import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadResume = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new modern upload page
    navigate("/modern-upload", { replace: true });
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
        <h2>Redirecting to Modern Resume Upload...</h2>
        <p>You're being redirected to our new AI-powered resume service!</p>
      </div>
    </div>
  );
};

export default UploadResume;
