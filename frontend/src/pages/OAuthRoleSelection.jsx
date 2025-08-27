import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTie, faBriefcase, faRocket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import '../styles/OAuthRoleSelection.css';

const OAuthRoleSelection = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthData, setOauthData] = useState(null);

  useEffect(() => {
    // Get OAuth data from URL parameters
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setOauthData(parsedData);
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        navigate('/signup');
      }
    } else {
      navigate('/signup');
    }
  }, [searchParams, navigate]);

  const handleRoleSelection = async (role) => {
    if (!oauthData) return;
    
    setIsLoading(true);
    try {
      // Call backend to complete OAuth signup with selected role
      const response = await fetch('http://localhost:3002/api/auth/oauth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...oauthData,
          userType: role
        })
      });

      const result = await response.json();

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.user.role);
        localStorage.setItem('userId', result.user.id);
        localStorage.setItem('userEmail', oauthData.email);
        localStorage.setItem('userFirstName', oauthData.first_name);
        localStorage.setItem('userLastName', oauthData.last_name);
        
        // For new OAuth users, always go to profile setup first
        navigate('/user-profile-setup');
      } else {
        alert(result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error completing OAuth signup:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!oauthData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="oauth-role-selection">
      <div className="role-selection-container">
                 <div className="header">
           <div className="logo">
             <FontAwesomeIcon icon={faRocket} />
             <span>AksharJobs</span>
           </div>
           <h1>Choose Your Role</h1>
           <p>Welcome, {oauthData.first_name}! Please select how you'll use AksharJobs</p>
         </div>

        <div className="role-options">
          <div 
            className={`role-option ${selectedRole === 'jobSeeker' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('jobSeeker')}
          >
            <div className="role-icon">
              <FontAwesomeIcon icon={faBriefcase} />
            </div>
            <div className="role-content">
              <h3>Job Seeker</h3>
              <p>Find jobs, upload resume, and get matched with opportunities</p>
              <ul>
                <li>Browse job listings</li>
                <li>Upload and manage resume</li>
                <li>Get AI-powered job matches</li>
                <li>Track applications</li>
              </ul>
            </div>
          </div>

          <div 
            className={`role-option ${selectedRole === 'recruiter' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('recruiter')}
          >
            <div className="role-icon">
              <FontAwesomeIcon icon={faUserTie} />
            </div>
            <div className="role-content">
              <h3>Recruiter</h3>
              <p>Post jobs, find candidates, and manage hiring process</p>
              <ul>
                <li>Post job openings</li>
                <li>Browse candidate profiles</li>
                <li>AI-powered candidate matching</li>
                <li>Manage applications</li>
              </ul>
            </div>
          </div>
        </div>

        <button 
          className={`continue-btn ${selectedRole ? 'active' : ''}`}
          onClick={() => handleRoleSelection(selectedRole)}
          disabled={!selectedRole || isLoading}
        >
          {isLoading ? 'Setting up your account...' : 'Continue'}
        </button>

        <div className="user-info">
          <p>Signed in as: <strong>{oauthData.email}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default OAuthRoleSelection;
