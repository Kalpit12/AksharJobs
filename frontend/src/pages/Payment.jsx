import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../styles/Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pesapal');

  useEffect(() => {
    if (location.state?.plan) {
      setPlan(location.state.plan);
    } else {
      // Fallback to localStorage if no state
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
        setPlan(JSON.parse(storedPlan));
      } else {
        navigate('/pricing');
      }
    }
  }, [location.state, navigate]);

  const paymentMethods = [
    {
      id: 'pesapal',
      name: 'Pesapal',
      description: 'Pay with M-Pesa, Airtel Money, or cards',
      icon: '💳',
      popular: true
    },
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Direct M-Pesa payment',
      icon: '📱'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, or American Express',
      icon: '💳'
    }
  ];

  const handlePayment = async () => {
    if (!plan) return;

    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Call your backend to create a payment session
      // 2. Redirect to Pesapal payment page
      // 3. Handle payment callback
      
      // For demo purposes, simulate successful payment
      const paymentData = {
        planId: plan.planId,
        planName: plan.planName,
        amount: plan.amount,
        currency: plan.currency,
        userRole: plan.userRole,
        paymentMethod: paymentMethod,
        timestamp: new Date().toISOString(),
        status: 'success'
      };
      
      // Store payment data
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      
      // Redirect to success page
      navigate('/payment-success', { state: { payment: paymentData } });
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="payment-container">
        <div className="loading">Loading plan details...</div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <h1>Complete Your Purchase</h1>
          <p>You're just one step away from unlocking premium features!</p>
        </div>

        <div className="payment-grid">
          <div className="plan-summary">
            <h2>Plan Summary</h2>
            <div className="plan-card">
              <div className="plan-name">{plan.planName}</div>
              <div className="plan-price">
                <span className="currency">{plan.currency}</span>
                <span className="amount">{plan.amount}</span>
                <span className="period">/month</span>
              </div>
              <div className="plan-role">
                {plan.userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'} Plan
              </div>
            </div>
            
            <div className="plan-features">
              <h3>What you'll get:</h3>
              {plan.planName === 'Basic' && (
                <ul>
                  <li>✓ Basic features included</li>
                  <li>✓ No monthly charge</li>
                  <li>✓ Upgrade anytime</li>
                </ul>
              )}
              {plan.planName === 'Starter' && (
                <ul>
                  <li>✓ Enhanced features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Advanced analytics</li>
                </ul>
              )}
              {plan.planName === 'Professional' && (
                <ul>
                  <li>✓ AI-powered features</li>
                  <li>✓ Unlimited access</li>
                  <li>✓ Premium support</li>
                  <li>✓ Advanced tools</li>
                </ul>
              )}
              {plan.planName === 'Premium' && (
                <ul>
                  <li>✓ All Professional features</li>
                  <li>✓ Personal advisor</li>
                  <li>✓ Exclusive opportunities</li>
                  <li>✓ Premium services</li>
                </ul>
              )}
              {plan.planName === 'Enterprise' && (
                <ul>
                  <li>✓ All features included</li>
                  <li>✓ Dedicated manager</li>
                  <li>✓ Custom solutions</li>
                  <li>✓ API access</li>
                </ul>
              )}
            </div>
          </div>

          <div className="payment-form">
            <h2>Payment Method</h2>
            
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`payment-method ${paymentMethod === method.id ? 'selected' : ''} ${method.popular ? 'popular' : ''}`}
                  onClick={() => setPaymentMethod(method.id)}
                >
                  {method.popular && <span className="popular-badge">Recommended</span>}
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-info">
                    <h4>{method.name}</h4>
                    <p>{method.description}</p>
                  </div>
                  <div className="method-radio">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-summary">
              <div className="summary-row">
                <span>Plan:</span>
                <span>{plan.planName}</span>
              </div>
              <div className="summary-row">
                <span>Duration:</span>
                <span>1 Month</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{plan.currency} {plan.amount}</span>
              </div>
            </div>

            <button 
              className="pay-button"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ${plan.currency} ${plan.amount}`}
            </button>

            <div className="security-notice">
              <div className="security-icon">🔒</div>
              <p>Your payment is secure and encrypted. We never store your payment details.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
