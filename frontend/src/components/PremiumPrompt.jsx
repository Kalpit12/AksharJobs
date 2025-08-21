import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PremiumPrompt.css';

const PremiumPrompt = ({ userType = 'job_seeker', onClose }) => {
  const navigate = useNavigate();

  const handleGetPremium = () => {
    navigate('/pricing-plans');
  };

  const getContent = () => {
    if (userType === 'job_seeker') {
      return {
        title: "Unlock Premium Features",
        subtitle: "Get 5x more job matches & priority applications",
        features: [
          "AI Resume Optimization",
          "Priority Application",
          "Advanced Analytics",
          "Unlimited Job Applications",
          "Direct Recruiter Access"
        ],
        price: "Starting at $19.99/month",
        buttonText: "Get Premium"
      };
    } else if (userType === 'recruiter') {
      return {
        title: "Upgrade to Premium Recruiter",
        subtitle: "Access top talent & advanced hiring tools",
        features: [
          "Advanced Candidate Search",
          "AI-Powered Matching",
          "Priority Candidate Access",
          "Analytics Dashboard",
          "Unlimited Job Postings"
        ],
        price: "Starting at $49.99/month",
        buttonText: "Get Premium"
      };
    } else {
      return {
        title: "Unlock Premium Features",
        subtitle: "Get exclusive access to advanced tools",
        features: [
          "Premium Support",
          "Advanced Features",
          "Priority Access",
          "Custom Solutions",
          "Dedicated Account Manager"
        ],
        price: "Contact Sales",
        buttonText: "Get Premium"
      };
    }
  };

  const content = getContent();

  return (
    <div className="premium-banner-overlay">
      <div className="premium-banner">
        <button className="close-button" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div className="banner-content">
          <div className="banner-left">
            <div className="star-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2"/>
              </svg>
            </div>
            <h2 className="banner-title">{content.title}</h2>
            <p className="banner-subtitle">{content.subtitle}</p>
          </div>

          <div className="banner-center">
            <div className="features-list">
              {content.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17L4 12" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="banner-right">
            <div className="price-tag">
              <span className="price">{content.price}</span>
            </div>
            <button className="get-premium-btn" onClick={handleGetPremium}>
              <span className="btn-text">{content.buttonText}</span>
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPrompt;
