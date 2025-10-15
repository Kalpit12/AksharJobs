import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
import '../styles/OAuth.css';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    const handleOAuthSuccess = async () => {
      try {
        hasProcessed.current = true;
        
        const token = searchParams.get('token');
        const userData = searchParams.get('user');

        if (!token || !userData) {
          setError('Invalid OAuth response. Please try again.');
          setStatus('error');
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userData));

        // Create login data structure
        const loginData = {
          token: token,
          userId: user.id,
          role: user.role || user.userType,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };

        // Login the user without automatic navigation
        login(loginData, false);
        
        setStatus('success');
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          // Check if user has completed profile setup from user data
          const profileCompleted = user.profileCompleted === true;
          
          if (profileCompleted) {
            // Redirect to appropriate dashboard based on role
            if (user.role === 'recruiter') {
              navigate('/recruiter-dashboard');
            } else {
              navigate('/jobseeker-dashboard');
            }
          } else {
            // Redirect to profile setup if profile not completed
            navigate('/user-profile-setup');
          }
        }, 2000);

      } catch (error) {
        console.error('OAuth success error:', error);
        setError('An error occurred during authentication. Please try again.');
        setStatus('error');
      }
    };

    handleOAuthSuccess();
  }, []); // Empty dependency array since we only want this to run once

  if (status === 'processing') {
    return (
      <div className="oauth-success-page">
        <div className="oauth-content">
          <ModernLoadingSpinner 
            type="rocket" 
            size="large" 
            text="Completing your login..." 
            showText={true}
          />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="oauth-success-page">
        <div className="oauth-content">
          <div className="oauth-error">
            <h2>Authentication Error</h2>
            <p>{error}</p>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-primary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="oauth-success-page">
        <div className="oauth-content">
          <div className="oauth-success">
                            <h2>Welcome to AksharJobs!</h2>
            <p>You have been successfully logged in.</p>
            <p>Redirecting you to the dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthSuccess;
