import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGift, 
  faCopy, 
  faShare, 
  faRocket, 
  faUsers, 
  faClock,
  faCheckCircle,
  faTimesCircle,
  faArrowRight,
  faHeart,
  faBriefcase,
  faEye,
  faChartLine,
  faStar,
  faTrophy,
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import PromoCodeCard from '../components/PromoCodeCard';
import UsePromoCode from '../components/UsePromoCode';
import PromoCodeAnalytics from '../components/PromoCodeAnalytics';
import AksharCoinBalance from '../components/AksharCoinBalance';
import HowToEarnCoins from '../components/HowToEarnCoins';
import HowToUseCoins from '../components/HowToUseCoins';
import '../styles/PromoCodePage.css';

const PromoCodePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('jobSeeker');
  const [activeTab, setActiveTab] = useState('myCode');
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Set user type based on user role
    if (user?.role) {
      setUserType(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  const getInstructions = () => {
    if (userType === 'jobSeeker') {
      return {
        title: "Job Seeker Promo Code Guide",
        subtitle: "Share your code to help others and earn benefits!",
        steps: [
          {
            icon: faGift,
            title: "Get Your Code",
            description: "Your unique promo code is automatically generated when you sign up. It's based on your name and is completely unique to you.",
            color: "#10b981"
          },
          {
            icon: faShare,
            title: "Share Your Code",
            description: "Share your promo code with friends, family, or on social media. When someone uses your code, you both get benefits!",
            color: "#3b82f6"
          },
          {
            icon: faUsers,
            title: "Help Others",
            description: "When someone uses your promo code, they get 1 free job application to apply for any job on our platform.",
            color: "#8b5cf6"
          },
          {
            icon: faTrophy,
            title: "Earn Rewards",
            description: "You earn benefits when your code is used. Track your success with our analytics dashboard.",
            color: "#f59e0b"
          }
        ],
        benefits: [
          {
            icon: faBriefcase,
            title: "Free Job Applications",
            description: "Get 1 free job application when you use someone's promo code",
            color: "#10b981"
          },
          {
            icon: faRocket,
            title: "Priority Matching",
            description: "Your applications get priority in our AI matching system",
            color: "#3b82f6"
          },
          {
            icon: faChartLine,
            title: "Analytics Dashboard",
            description: "Track your application success and match scores",
            color: "#8b5cf6"
          }
        ]
      };
    } else {
      return {
        title: "Recruiter Promo Code Guide",
        subtitle: "Share your code to help other recruiters and grow your network!",
        steps: [
          {
            icon: faGift,
            title: "Get Your Code",
            description: "Your unique promo code is automatically generated when you sign up. It's based on your company name and is completely unique to you.",
            color: "#10b981"
          },
          {
            icon: faShare,
            title: "Share Your Code",
            description: "Share your promo code with other recruiters, HR professionals, or on professional networks like LinkedIn.",
            color: "#3b82f6"
          },
          {
            icon: faUsers,
            title: "Help Other Recruiters",
            description: "When someone uses your promo code, they get 1 free job post + 5 free resume views to find the best candidates.",
            color: "#8b5cf6"
          },
          {
            icon: faTrophy,
            title: "Build Your Network",
            description: "Connect with other recruiters and build a professional network while earning benefits.",
            color: "#f59e0b"
          }
        ],
        benefits: [
          {
            icon: faBriefcase,
            title: "Free Job Posts",
            description: "Get 1 free job post when you use someone's promo code",
            color: "#10b981"
          },
          {
            icon: faEye,
            title: "Free Resume Views",
            description: "Get 5 free resume views to find the best candidates",
            color: "#3b82f6"
          },
          {
            icon: faChartLine,
            title: "Advanced Analytics",
            description: "Access detailed recruitment analytics and candidate insights",
            color: "#8b5cf6"
          }
        ]
      };
    }
  };

  const instructions = getInstructions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="promo-code-page">
      {/* Header */}
      <div className="promo-page-header-simple">
        <div className="header-content">
          <div className="header-text">
            <h1>{instructions.title}</h1>
            <p>{instructions.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'myCode' ? 'active' : ''}`}
          onClick={() => setActiveTab('myCode')}
        >
          <FontAwesomeIcon icon={faGift} />
          My Promo Code
        </button>
        <button 
          className={`tab-button ${activeTab === 'useCode' ? 'active' : ''}`}
          onClick={() => setActiveTab('useCode')}
        >
          <FontAwesomeIcon icon={faRocket} />
          Use Promo Code
        </button>
        <button 
          className={`tab-button ${activeTab === 'aksharCoins' ? 'active' : ''}`}
          onClick={() => setActiveTab('aksharCoins')}
        >
          <FontAwesomeIcon icon={faTrophy} />
          Akshar Coins
        </button>
        <button 
          className={`tab-button ${activeTab === 'instructions' ? 'active' : ''}`}
          onClick={() => setActiveTab('instructions')}
        >
          <FontAwesomeIcon icon={faStar} />
          How It Works
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'myCode' && (
          <div className="my-code-section">
            <div className="code-display">
              <PromoCodeCard userType={userType} />
            </div>
            <div className="analytics-display">
              <PromoCodeAnalytics userType={userType} />
            </div>
          </div>
        )}

        {activeTab === 'useCode' && (
          <div className="use-code-section">
            <div className="use-code-container">
              <UsePromoCode 
                userType={userType} 
                onPromoCodeUsed={(benefits) => {
                  console.log('Promo code used:', benefits);
                  // Show success message or refresh data
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'aksharCoins' && (
          <div className="akshar-coins-section">
            <div className="coins-container">
              <div className="coins-balance-wrapper">
                <AksharCoinBalance onBalanceUpdate={(balance) => setCoinBalance(balance)} />
              </div>
              
              <div className="coins-tabs">
                <div className="coins-earn-section">
                  <HowToEarnCoins userType={userType} />
                </div>
                
                <div className="coins-use-section">
                  <HowToUseCoins 
                    userType={userType} 
                    currentBalance={coinBalance}
                    onRedemptionSuccess={(response) => {
                      console.log('Redemption successful:', response);
                      // Refresh balance
                      window.location.reload();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'instructions' && (
          <div className="instructions-section">
            {/* How It Works Steps */}
            <div className="steps-section">
              <h2>How It Works</h2>
              <div className="steps-grid">
                {instructions.steps.map((step, index) => (
                  <div key={index} className="step-card">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-icon" style={{ color: step.color }}>
                      <FontAwesomeIcon icon={step.icon} />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits Section */}
            <div className="benefits-section">
              <h2>What You Get</h2>
              <div className="benefits-grid">
                {instructions.benefits.map((benefit, index) => (
                  <div key={index} className="benefit-card">
                    <div className="benefit-icon" style={{ color: benefit.color }}>
                      <FontAwesomeIcon icon={benefit.icon} />
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            <div className="tips-section">
              <h2>Pro Tips</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <FontAwesomeIcon icon={faShare} className="tip-icon" />
                  <h3>Share Strategically</h3>
                  <p>Share your promo code on professional networks, job boards, and with colleagues who might benefit from our platform.</p>
                </div>
                <div className="tip-card">
                  <FontAwesomeIcon icon={faUsers} className="tip-icon" />
                  <h3>Build Your Network</h3>
                  <p>Connect with other professionals in your field and help each other grow by sharing promo codes.</p>
                </div>
                <div className="tip-card">
                  <FontAwesomeIcon icon={faChartLine} className="tip-icon" />
                  <h3>Track Your Success</h3>
                  <p>Monitor your promo code usage and see how many people you've helped with our analytics dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoCodePage;
