import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PaymentCancelled.css';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-cancelled-container">
      <div className="payment-cancelled-content">
        <div className="cancelled-icon">⚠️</div>
        <h2>Payment Cancelled</h2>
        <p>Your payment was cancelled. No charges have been made to your account.</p>
        <p>You can try again anytime or choose a different payment method.</p>
        
        <div className="action-buttons">
          <button 
            className="retry-button"
            onClick={() => navigate('/premium')}
          >
            Try Again
          </button>
          <button 
            className="home-button"
            onClick={() => navigate('/')}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;
