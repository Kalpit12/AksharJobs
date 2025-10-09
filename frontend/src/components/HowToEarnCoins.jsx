import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faShare, 
  faUserCheck, 
  faBriefcase, 
  faFileAlt,
  faCalendarDay,
  faGift,
  faCoins,
  faLightbulb
} from '@fortawesome/free-solid-svg-icons';
import coinApi from '../api/coinApi';
import '../styles/HowToEarnCoins.css';

const HowToEarnCoins = ({ userType }) => {
  const [coinRewards, setCoinRewards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoinInfo();
  }, []);

  const fetchCoinInfo = async () => {
    try {
      const response = await coinApi.getCoinInfo();
      if (response.success) {
        setCoinRewards(response.rewards);
      }
    } catch (err) {
      console.error('Error fetching coin info:', err);
    } finally {
      setLoading(false);
    }
  };

  const earningMethods = [
    {
      icon: faShare,
      title: "Share Your Promo Code",
      description: "When someone uses your promo code, you earn coins!",
      reward: coinRewards?.promo_code_used || 50,
      color: "#3b82f6",
      action: "Per code use"
    },
    {
      icon: faUserPlus,
      title: "Referral Sign-ups",
      description: "Invite friends and colleagues to join AksharJobs",
      reward: coinRewards?.referral_signup || 100,
      color: "#10b981",
      action: "Per successful referral"
    },
    {
      icon: faUserCheck,
      title: "Complete Your Profile",
      description: "Fill out all sections of your profile to get a one-time bonus",
      reward: coinRewards?.profile_complete || 200,
      color: "#8b5cf6",
      action: "One-time bonus"
    },
    {
      icon: userType === 'jobSeeker' ? faFileAlt : faBriefcase,
      title: userType === 'jobSeeker' ? "First Job Application" : "First Job Post",
      description: userType === 'jobSeeker' 
        ? "Apply to your first job to earn bonus coins"
        : "Post your first job to earn bonus coins",
      reward: userType === 'jobSeeker' 
        ? (coinRewards?.first_application || 25)
        : (coinRewards?.first_job_post || 25),
      color: "#f59e0b",
      action: "One-time bonus"
    },
    {
      icon: faCalendarDay,
      title: "Daily Login Bonus",
      description: "Log in daily to earn bonus coins",
      reward: coinRewards?.daily_login || 10,
      color: "#ec4899",
      action: "Daily"
    }
  ];

  return (
    <div className="how-to-earn-coins">
      <div className="earn-header">
        <FontAwesomeIcon icon={faCoins} className="header-icon" />
        <h2>How to Earn Akshar Coins</h2>
        <p className="header-subtitle">
          Earn coins by being active on the platform and helping others!
        </p>
      </div>

      <div className="earning-methods-grid">
        {earningMethods.map((method, index) => (
          <div key={index} className="earning-method-card">
            <div className="method-icon" style={{ backgroundColor: method.color }}>
              <FontAwesomeIcon icon={method.icon} />
            </div>
            <div className="method-content">
              <h3>{method.title}</h3>
              <p className="method-description">{method.description}</p>
              <div className="method-reward">
                <span className="reward-badge" style={{ backgroundColor: method.color }}>
                  <FontAwesomeIcon icon={faCoins} />
                  ₳ {method.reward}
                </span>
                <span className="reward-action">{method.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="earning-tips">
        <div className="tips-header">
          <FontAwesomeIcon icon={faLightbulb} />
          <h3>Pro Tips to Maximize Your Earnings</h3>
        </div>
        <div className="tips-grid">
          <div className="tip-item">
            <span className="tip-number">1</span>
            <p><strong>Share Regularly:</strong> Share your promo code on social media, professional networks, and with colleagues.</p>
          </div>
          <div className="tip-item">
            <span className="tip-number">2</span>
            <p><strong>Daily Engagement:</strong> Log in daily to claim your daily bonus coins.</p>
          </div>
          <div className="tip-item">
            <span className="tip-number">3</span>
            <p><strong>Complete Your Profile:</strong> A complete profile not only earns you coins but also improves your chances!</p>
          </div>
          <div className="tip-item">
            <span className="tip-number">4</span>
            <p><strong>Stay Active:</strong> Regular activity on the platform leads to more earning opportunities.</p>
          </div>
        </div>
      </div>

      <div className="earning-benefits">
        <h3>Why Earn Akshar Coins?</h3>
        <div className="benefits-list">
          <div className="benefit-item">
            <FontAwesomeIcon icon={faCoins} />
            <p>Use coins instead of money for premium features</p>
          </div>
          <div className="benefit-item">
            <FontAwesomeIcon icon={faGift} />
            <p>Get exclusive rewards and benefits</p>
          </div>
          <div className="benefit-item">
            <FontAwesomeIcon icon={faShare} />
            <p>Help others while earning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToEarnCoins;

