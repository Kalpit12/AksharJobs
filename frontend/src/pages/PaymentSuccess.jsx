import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../styles/PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (location.state?.payment) {
      setPayment(location.state.payment);
    } else {
      // Fallback to localStorage if no state
      const storedPayment = localStorage.getItem('paymentData');
      if (storedPayment) {
        setPayment(JSON.parse(storedPayment));
      } else {
        navigate('/');
        return;
      }
    }

    // Start countdown to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to appropriate dashboard
          const userRole = localStorage.getItem('role');
          if (userRole === 'recruiter') {
            navigate('/recruiter-dashboard');
          } else {
            navigate('/jobseeker-dashboard');
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [location.state, navigate]);

  const handleRedirectNow = () => {
    const userRole = localStorage.getItem('role');
    if (userRole === 'recruiter') {
      navigate('/recruiter-dashboard');
    } else {
      navigate('/jobseeker-dashboard');
    }
  };

  if (!payment) {
    return (
      <div className="success-container">
        <div className="loading">Loading payment details...</div>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        
        <h1>Payment Successful!</h1>
        <p className="success-message">
          Welcome to {payment.planName}! Your premium features are now unlocked.
        </p>

        <div className="payment-details">
          <h2>Payment Details</h2>
          <div className="detail-row">
            <span>Plan:</span>
            <span>{payment.planName}</span>
          </div>
          <div className="detail-row">
            <span>Amount:</span>
            <span>{payment.currency} {payment.amount}</span>
          </div>
          <div className="detail-row">
            <span>Payment Method:</span>
            <span>{payment.paymentMethod === 'pesapal' ? 'Pesapal' : 
                   payment.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Card'}</span>
          </div>
          <div className="detail-row">
            <span>Date:</span>
            <span>{new Date(payment.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="next-steps">
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Explore Premium Features</h4>
                <p>Discover all the new tools and capabilities available to you</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Complete Your Profile</h4>
                <p>Update your profile to get the most out of your premium plan</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Start Using Premium Tools</h4>
                <p>Begin leveraging AI-powered features and advanced analytics</p>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="redirect-btn" onClick={handleRedirectNow}>
            Go to Dashboard Now
          </button>
          <p className="auto-redirect">
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>

        <div className="support-notice">
          <div className="support-icon">💬</div>
          <div className="support-content">
            <h4>Need Help?</h4>
            <p>Our support team is here to help you get started with your premium features.</p>
            <a href="mailto:support@rocketmatch.com" className="support-link">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
