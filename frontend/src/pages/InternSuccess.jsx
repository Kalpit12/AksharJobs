import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faRocket,
  faLightbulb,
  faBrain,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import '../styles/InternSuccess.css';

const InternSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { internName, email, isUpdate } = location.state || {};

  useEffect(() => {
    // Auto-redirect to dashboard after 8 seconds
    const timer = setTimeout(() => {
      navigate('/intern-dashboard');
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToDashboard = () => {
    navigate('/intern-dashboard');
  };

  return (
    <div className="intern-success-wrapper">
      <div className="success-container">
        <motion.div 
          className="success-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="success-icon"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FontAwesomeIcon icon={faCheckCircle} />
          </motion.div>

          <motion.h1 
            className="success-title"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isUpdate ? 'Profile Updated Successfully!' : 'Application Submitted Successfully!'}
          </motion.h1>

          <motion.p 
            className="success-message"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Thank you, <strong>{internName || 'there'}</strong>! Your intern profile has been {isUpdate ? 'updated' : 'created'} successfully.
          </motion.p>

          <motion.div 
            className="success-details"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="detail-item">
              <FontAwesomeIcon icon={faRocket} className="detail-icon" />
              <div className="detail-text">
                <h3>What Happens Next?</h3>
                <p>Our AI is analyzing your profile and matching you with relevant internship opportunities.</p>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faBrain} className="detail-icon" />
              <div className="detail-text">
                <h3>AI-Powered Matching</h3>
                <p>We use advanced algorithms to find internships that align with your skills, preferences, and career goals.</p>
              </div>
            </div>

            <div className="detail-item">
              <FontAwesomeIcon icon={faLightbulb} className="detail-icon" />
              <div className="detail-text">
                <h3>Personalized Recommendations</h3>
                <p>You'll receive tailored internship recommendations on your dashboard, updated regularly.</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="confirmation-note"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>
              A confirmation email has been sent to <strong>{email}</strong>
            </p>
          </motion.div>

          <motion.button
            className="dashboard-btn"
            onClick={handleGoToDashboard}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go to Your Dashboard
            <FontAwesomeIcon icon={faArrowRight} />
          </motion.button>

          <motion.p 
            className="auto-redirect-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            You'll be automatically redirected to your dashboard in a few seconds...
          </motion.p>
        </motion.div>

        <div className="success-background">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
        </div>
      </div>
    </div>
  );
};

export default InternSuccess;

