import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentCallback.css';

const PaymentCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    // Extract payment details from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const orderTrackingId = urlParams.get('OrderTrackingId');
    const paymentStatus = urlParams.get('PaymentStatus');
    
    if (orderTrackingId && paymentStatus) {
      verifyPayment(orderTrackingId, paymentStatus);
    } else {
      setStatus('error');
      setMessage('Invalid payment callback. Please contact support.');
    }
  }, [location]);

  const verifyPayment = async (orderTrackingId, paymentStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/payment/verify-payment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_tracking_id: orderTrackingId,
          payment_method: 'pesapal'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'completed') {
          setStatus('success');
          setMessage('Payment completed successfully! Your subscription has been activated.');
          
          // Store payment data
          localStorage.setItem('paymentData', JSON.stringify({
            status: 'success',
            subscription: data.subscription,
            timestamp: new Date().toISOString()
          }));
          
          // Redirect to success page after 3 seconds
          setTimeout(() => {
            navigate('/payment-success', { 
              state: { 
                payment: {
                  status: 'success',
                  subscription: data.subscription
                }
              } 
            });
          }, 3000);
        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }
      } else {
        setStatus('error');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('error');
      setMessage('Payment verification failed. Please contact support.');
    }
  };

  return (
    <div className="payment-callback-container">
      <div className="payment-callback-content">
        {status === 'verifying' && (
          <div className="verifying-state">
            <div className="loading-spinner"></div>
            <h2>Verifying Payment</h2>
            <p>{message}</p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="success-state">
            <div className="success-icon">✅</div>
            <h2>Payment Successful!</h2>
            <p>{message}</p>
            <p>Redirecting to success page...</p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h2>Payment Failed</h2>
            <p>{message}</p>
            <button 
              className="retry-button"
              onClick={() => navigate('/premium')}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
