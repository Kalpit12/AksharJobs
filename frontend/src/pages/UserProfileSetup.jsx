import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocket, faSpinner } from '@fortawesome/free-solid-svg-icons';
import '../styles/UserProfileSetup.css';

const UserProfileSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-redirect to dashboard - skip profile setup form
    const timer = setTimeout(() => {
      const userRole = localStorage.getItem('role');
      console.log('🔍 UserProfileSetup - User role:', userRole);
      console.log('🔍 UserProfileSetup - All localStorage items:', Object.keys(localStorage));
      
      // Mark profile as completed to prevent redirect loops
      localStorage.setItem('profileCompleted', 'true');
      console.log('✅ Profile marked as completed');
      
      if (userRole === 'recruiter') {
        console.log('🚀 Redirecting to recruiter dashboard...');
        navigate('/recruiter-dashboard');
      } else if (userRole === 'jobSeeker') {
        console.log('🚀 Redirecting to jobseeker dashboard...');
        navigate('/jobseeker-dashboard');
      } else {
        console.log('⚠️ No valid role found, redirecting to home...');
        navigate('/');
      }
    }, 2000); // 2 second delay to show the message

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="user-profile-setup">
      <div className="setup-container">
        <div className="setup-header">
          <div className="logo">
            <img src="/AK_logo.jpg" alt="AksharJobs Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <span>AksharJobs</span>
          </div>
          <h1>Redirecting to Dashboard...</h1>
          <p>Setting up your profile automatically. You can upload your resume and complete your profile from the dashboard.</p>
        </div>

        <div className="loading-section" style={{ textAlign: 'center', padding: '40px' }}>
          <div className="loading-spinner" style={{ fontSize: '48px', color: '#4A90E2', marginBottom: '20px' }}>
            <FontAwesomeIcon icon={faSpinner} spin />
          </div>
          <p>Redirecting you to the dashboard...</p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
            You can upload your resume and complete your profile settings from there.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetup;
