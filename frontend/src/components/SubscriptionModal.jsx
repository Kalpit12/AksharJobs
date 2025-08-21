import React, { useState, useEffect } from 'react';
import '../styles/SubscriptionModal.css';

const SubscriptionModal = ({ isOpen, onClose, onSave, currentPlan = 'basic' }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentPlan) {
      setSelectedPlan(currentPlan);
    }
  }, [isOpen, currentPlan]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(selectedPlan);
      onClose();
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 'KSH 0',
      period: 'month',
      description: 'Perfect for getting started',
      features: [
        'Basic job search',
        'Profile creation',
        'Limited applications',
        'Email support'
      ],
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 'KSH 2,500',
      period: 'month',
      description: 'Best for active job seekers',
      features: [
        'Unlimited job applications',
        'Priority application status',
        'Advanced search filters',
        'Resume builder tools',
        'Priority support',
        'Job alerts'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Plan',
      price: 'KSH 6,500',
      period: 'month',
      description: 'For recruiters and companies',
      features: [
        'Post unlimited jobs',
        'Advanced analytics',
        'Candidate management',
        'Custom branding',
        'API access',
        'Dedicated support',
        'Team collaboration'
      ],
      popular: false
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="subscription-modal-overlay" onClick={onClose}>
      <div className="subscription-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Subscription Plans</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <p className="modal-description">
            Choose the plan that best fits your needs. You can upgrade or downgrade at any time.
          </p>
          
          <div className="plans-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">{plan.price}</span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                  <p className="plan-description">{plan.description}</p>
                </div>
                
                <div className="plan-features">
                  <ul>
                    {plan.features.map((feature, index) => (
                      <li key={index}>
                        <span className="feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="plan-actions">
                  <button 
                    className={`select-plan-btn ${selectedPlan === plan.id ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.id);
                    }}
                  >
                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="current-plan-info">
            <div className="info-icon">ℹ️</div>
            <div className="info-content">
              <strong>Current Plan:</strong> {plans.find(p => p.id === currentPlan)?.name}
              {currentPlan !== 'basic' && (
                <span className="billing-info"> - Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isLoading || selectedPlan === currentPlan}
          >
            {isLoading ? 'Updating...' : selectedPlan === currentPlan ? 'No Changes' : 'Update Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
