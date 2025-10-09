import React, { useState, useEffect } from 'react';
import '../styles/PremiumBadge.css';

const PremiumBadge = ({ 
  plan = 'Professional', 
  size = 'medium', 
  showTooltip = true, 
  animated = true,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getPlanIcon = (planName) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return '🚀';
      case 'professional':
        return '💼';
      case 'premium':
        return '👑';
      case 'enterprise':
        return '🏢';
      default:
        return '⭐';
    }
  };

  const getPlanColor = (planName) => {
    switch (planName.toLowerCase()) {
      case 'starter':
        return '#3b82f6';
      case 'professional':
        return '#8b5cf6';
      case 'premium':
        return '#fbbf24';
      case 'enterprise':
        return '#1e40af';
      default:
        return '#64748b';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'badge-small';
      case 'large':
        return 'badge-large';
      default:
        return 'badge-medium';
    }
  };

  const planIcon = getPlanIcon(plan);
  const planColor = getPlanColor(plan);

  return (
    <div 
      className={`premium-badge ${getSizeClasses()} ${animated ? 'animated' : ''} ${isVisible ? 'visible' : ''} ${className}`}
      style={{ '--plan-color': planColor }}
    >
      <div className="badge-content">
        <span className="badge-icon">{planIcon}</span>
        <span className="badge-text">{plan}</span>
      </div>
      
      {showTooltip && (
        <div className="badge-tooltip">
          <div className="tooltip-content">
            <div className="tooltip-header">
              <span className="tooltip-icon">{planIcon}</span>
              <span className="tooltip-title">{plan} Member</span>
            </div>
            <div className="tooltip-body">
              <p>Premium features unlocked</p>
              <ul className="tooltip-features">
                {plan === 'Starter' && (
                  <>
                    <li>✓ Advanced matching</li>
                    <li>✓ Priority support</li>
                    <li>✓ Enhanced analytics</li>
                  </>
                )}
                {plan === 'Professional' && (
                  <>
                    <li>✓ AI-powered tools</li>
                    <li>✓ Unlimited access</li>
                    <li>✓ Premium support</li>
                    <li>✓ Advanced analytics</li>
                  </>
                )}
                {plan === 'Premium' && (
                  <>
                    <li>✓ Personal advisor</li>
                    <li>✓ Exclusive opportunities</li>
                    <li>✓ Premium services</li>
                    <li>✓ All Professional features</li>
                  </>
                )}
                {plan === 'Enterprise' && (
                  <>
                    <li>✓ Dedicated manager</li>
                    <li>✓ Custom solutions</li>
                    <li>✓ API access</li>
                    <li>✓ All features included</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default PremiumBadge;
