import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faRocket,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import '../styles/JobSeekerRegistrationSuccess.css';

const JobSeekerRegistrationSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Verify user came from registration
    if (!location.state?.fromRegistration) {
      navigate('/jobseeker-dashboard');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/jobseeker-dashboard');
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, location]);

  const handleGoToDashboard = () => {
    navigate('/jobseeker-dashboard');
  };

  return (
    <div className="registration-success-container">
      <div className="success-card">
        <div className="success-icon">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        
        <h1>🎉 Registration Complete!</h1>
        
        <p className="success-message">
          Congratulations! Your job seeker profile has been successfully created and saved.
        </p>

        <div className="success-details">
          <div className="detail-item">
            <span className="check-mark">✓</span>
            <span>Profile Information Saved</span>
          </div>
          <div className="detail-item">
            <span className="check-mark">✓</span>
            <span>Skills & Preferences Recorded</span>
          </div>
          <div className="detail-item">
            <span className="check-mark">✓</span>
            <span>Ready to Match with Jobs</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Explore job opportunities tailored to your profile</li>
            <li>Upload your resume for better matching</li>
            <li>Set up job alerts for your preferred roles</li>
            <li>Connect with recruiters and companies</li>
          </ul>
        </div>

        <div className="redirect-info">
          <p>Redirecting to your dashboard in <strong>{countdown}</strong> seconds...</p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleGoToDashboard}
        >
          <FontAwesomeIcon icon={faRocket} />
          Go to Dashboard Now
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};

export default JobSeekerRegistrationSuccess;

