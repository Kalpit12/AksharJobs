import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faBriefcase, 
  faEye, 
  faCrown,
  faCoins,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import coinApi from '../api/coinApi';
import '../styles/HowToUseCoins.css';

const HowToUseCoins = ({ userType, currentBalance, onRedemptionSuccess }) => {
  const [coinCosts, setCoinCosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    fetchCoinInfo();
  }, []);

  const fetchCoinInfo = async () => {
    try {
      const response = await coinApi.getCoinInfo();
      if (response.success) {
        setCoinCosts(response.costs);
      }
    } catch (err) {
      console.error('Error fetching coin info:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (redemptionType) => {
    const userTypeKey = userType === 'jobSeeker' ? 'job_seeker' : userType;
    const cost = coinCosts[userTypeKey][redemptionType];

    if (currentBalance < cost) {
      setMessage(`Insufficient coins! You need ₳${cost} but have ₳${currentBalance}`);
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setRedeeming(true);
    setMessage(null);

    try {
      const response = await coinApi.redeemCoins(userType, redemptionType);
      
      if (response.success) {
        setMessage(response.message);
        setMessageType('success');
        if (onRedemptionSuccess) {
          onRedemptionSuccess(response);
        }
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage(response.error || 'Failed to redeem coins');
        setMessageType('error');
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      console.error('Error redeeming coins:', err);
      setMessage('Failed to redeem coins. Please try again.');
      setMessageType('error');
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setRedeeming(false);
    }
  };

  const getRedemptionOptions = () => {
    if (!coinCosts) return [];
    
    const userTypeKey = userType === 'jobSeeker' ? 'job_seeker' : userType;
    const costs = coinCosts[userTypeKey] || {};

    if (userType === 'jobSeeker') {
      return [
        {
          id: 'job_application',
          icon: faBriefcase,
          title: "Job Application",
          description: "Apply to one job posting",
          cost: costs.job_application || 20,
          color: "#10b981",
          benefit: "1 Job Application"
        },
        {
          id: 'premium_1_month',
          icon: faCrown,
          title: "1 Month Premium",
          description: "Get premium features for 1 month",
          cost: costs.premium_1_month || 500,
          color: "#f59e0b",
          benefit: "Premium Access"
        },
        {
          id: 'premium_3_months',
          icon: faCrown,
          title: "3 Months Premium",
          description: "Get premium features for 3 months (20% savings)",
          cost: costs.premium_3_months || 1200,
          color: "#8b5cf6",
          benefit: "Premium Access + Save 20%",
          badge: "Best Value"
        },
        {
          id: 'premium_6_months',
          icon: faCrown,
          title: "6 Months Premium",
          description: "Get premium features for 6 months (33% savings)",
          cost: costs.premium_6_months || 2000,
          color: "#3b82f6",
          benefit: "Premium Access + Save 33%",
          badge: "Most Popular"
        }
      ];
    } else {
      return [
        {
          id: 'job_post',
          icon: faBriefcase,
          title: "Job Posting",
          description: "Post one job listing",
          cost: costs.job_post || 50,
          color: "#10b981",
          benefit: "1 Job Post"
        },
        {
          id: 'resume_view',
          icon: faEye,
          title: "Resume Views",
          description: "View 5 candidate resumes",
          cost: costs.resume_view || 10,
          color: "#3b82f6",
          benefit: "5 Resume Views"
        },
        {
          id: 'premium_1_month',
          icon: faCrown,
          title: "1 Month Premium",
          description: "Get premium features for 1 month",
          cost: costs.premium_1_month || 800,
          color: "#f59e0b",
          benefit: "Premium Access"
        },
        {
          id: 'premium_3_months',
          icon: faCrown,
          title: "3 Months Premium",
          description: "Get premium features for 3 months (17% savings)",
          cost: costs.premium_3_months || 2000,
          color: "#8b5cf6",
          benefit: "Premium Access + Save 17%",
          badge: "Best Value"
        },
        {
          id: 'premium_6_months',
          icon: faCrown,
          title: "6 Months Premium",
          description: "Get premium features for 6 months (27% savings)",
          cost: costs.premium_6_months || 3500,
          color: "#3b82f6",
          benefit: "Premium Access + Save 27%",
          badge: "Most Popular"
        }
      ];
    }
  };

  const redemptionOptions = getRedemptionOptions();

  return (
    <div className="how-to-use-coins">
      <div className="use-header">
        <FontAwesomeIcon icon={faShoppingCart} className="header-icon" />
        <h2>Redeem Your Akshar Coins</h2>
        <p className="header-subtitle">
          Use your coins to unlock premium features and services
        </p>
        {currentBalance !== undefined && (
          <div className="current-balance">
            <FontAwesomeIcon icon={faCoins} />
            Your Balance: <strong>₳ {currentBalance.toLocaleString()}</strong>
          </div>
        )}
      </div>

      {message && (
        <div className={`redemption-message ${messageType}`}>
          <FontAwesomeIcon icon={messageType === 'success' ? faCheckCircle : faExclamationTriangle} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin />
          <p>Loading redemption options...</p>
        </div>
      ) : (
        <div className="redemption-options-grid">
          {redemptionOptions.map((option) => {
            const canAfford = currentBalance >= option.cost;
            
            return (
              <div key={option.id} className={`redemption-option-card ${!canAfford ? 'disabled' : ''}`}>
                {option.badge && (
                  <div className="option-badge">{option.badge}</div>
                )}
                <div className="option-icon" style={{ backgroundColor: option.color }}>
                  <FontAwesomeIcon icon={option.icon} />
                </div>
                <div className="option-content">
                  <h3>{option.title}</h3>
                  <p className="option-description">{option.description}</p>
                  <div className="option-benefit">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>{option.benefit}</span>
                  </div>
                  <div className="option-cost">
                    <FontAwesomeIcon icon={faCoins} />
                    <span className="cost-value">₳ {option.cost.toLocaleString()}</span>
                  </div>
                  <button
                    className="redeem-btn"
                    onClick={() => handleRedeem(option.id)}
                    disabled={!canAfford || redeeming}
                    style={{ backgroundColor: canAfford ? option.color : '#94a3b8' }}
                  >
                    {redeeming ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Redeeming...
                      </>
                    ) : (
                      <>
                        {canAfford ? 'Redeem Now' : 'Insufficient Coins'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="redemption-info">
        <div className="info-box">
          <FontAwesomeIcon icon={faCheckCircle} />
          <div>
            <h4>Instant Benefits</h4>
            <p>All redeemed benefits are applied to your account immediately</p>
          </div>
        </div>
        <div className="info-box">
          <FontAwesomeIcon icon={faCoins} />
          <div>
            <h4>No Expiry</h4>
            <p>Your Akshar Coins never expire - use them whenever you want!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToUseCoins;

