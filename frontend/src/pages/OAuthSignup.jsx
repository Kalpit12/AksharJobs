import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oauthApi } from '../api/oauthApi';
import ModernLoadingSpinner from '../components/ModernLoadingSpinner';
import '../styles/Global.css';
import '../styles/OAuth.css';

const OAuthSignup = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [userType, setUserType] = useState('jobSeeker');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setUserInfo(parsedData);
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        setError('Invalid OAuth data. Please try again.');
      }
    } else {
      setError('No OAuth data received. Please try logging in again.');
    }
  }, [searchParams]);

  const handleSignup = async () => {
    if (!userInfo) {
      setError('User information not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await oauthApi.completeOAuthSignup(userInfo, userType);

      if (result.success) {
        // Login the user
        const loginData = {
          token: result.token,
          userId: result.user.id,
          role: result.user.role || result.user.userType,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName
        };

        login(loginData);
        
        // Redirect to dashboard
        navigate('/');
      } else {
        setError(result.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('OAuth signup error:', error);
      setError('An error occurred during signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userInfo && !error) {
    return (
      <div className="oauth-signup-page">
        <div className="oauth-content">
          <ModernLoadingSpinner 
            type="dots" 
            size="large" 
            text="Loading your information..." 
            showText={true}
          />
        </div>
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="oauth-signup-page">
        <div className="oauth-content">
          <div className="oauth-error">
            <h2>Error</h2>
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

  return (
    <div className="oauth-signup-page">
      <div className="oauth-content">
        <div className="oauth-signup-form">
          <h2>Complete Your Profile</h2>
          <p>Welcome! Please complete your registration to continue.</p>
          
          <div className="user-info-preview">
            <h3>Your Information</h3>
            <p><strong>Name:</strong> {userInfo?.first_name} {userInfo?.last_name}</p>
            <p><strong>Email:</strong> {userInfo?.email}</p>
            <p><strong>Provider:</strong> {userInfo?.provider === 'google' ? 'Google' : 'LinkedIn'}</p>
          </div>

          <div className="form-group">
            <label htmlFor="userType">I am a:</label>
            <select
              id="userType"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="form-select"
            >
              <option value="jobSeeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              onClick={handleSignup}
              disabled={isLoading}
              className="btn btn-primary btn-full-width"
            >
              {isLoading ? (
                <ModernLoadingSpinner type="spinner" size="small" text="Creating Account..." showText={true} />
              ) : (
                'Create Account'
              )}
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="btn btn-secondary btn-full-width"
              disabled={isLoading}
            >
              Back to Login
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAuthSignup;
