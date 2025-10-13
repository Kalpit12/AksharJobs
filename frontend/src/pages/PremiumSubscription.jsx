import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PremiumSubscription.css';

const PremiumSubscription = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    // Trigger animations on mount
    setIsVisible(true);
    
    // Check if user is already premium
    checkPremiumStatus();
    
    // Auto-scroll testimonials
    const interval = setInterval(() => {
      if (testimonialsRef.current) {
        testimonialsRef.current.scrollLeft += 1;
        if (testimonialsRef.current.scrollLeft >= testimonialsRef.current.scrollWidth / 2) {
          testimonialsRef.current.scrollLeft = 0;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const checkPremiumStatus = async () => {
    if (!isAuthenticated) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/subscription/is-premium', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsPremium(data.isPremium);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const recruiterPlans = [
    {
      id: 'basic-rec',
      name: 'Basic',
      price: '0',
      currency: 'KSH',
      period: 'month',
      features: [
        'Post 2 jobs per month',
        'Basic candidate matching',
        'Standard support',
        'Basic analytics',
        'Email notifications'
      ],
      popular: false,
      recommended: false,
      color: '#64748b',
      icon: '📋'
    },
    {
      id: 'starter-rec',
      name: 'Starter',
      price: '3,500',
      currency: 'KSH',
      period: 'month',
      features: [
        'Post 10 jobs per month',
        'Advanced candidate matching',
        'Priority support',
        'Enhanced analytics',
        'Candidate database access',
        'Job alerts & notifications',
        'Basic reporting'
      ],
      popular: false,
      recommended: true,
      color: '#3b82f6',
      icon: '🚀'
    },
    {
      id: 'professional-rec',
      name: 'Professional',
      price: '7,500',
      currency: 'KSH',
      period: 'month',
      features: [
        'Unlimited job postings',
        'AI-powered candidate matching',
        'Advanced analytics dashboard',
        'Priority support',
        'Full candidate database',
        'Custom branding',
        'Bulk messaging',
        'Advanced reporting',
        'API access'
      ],
      popular: true,
      recommended: false,
      color: '#8b5cf6',
      icon: '💼'
    },
    {
      id: 'enterprise-rec',
      name: 'Enterprise',
      price: '15,000',
      currency: 'KSH',
      period: 'month',
      features: [
        'All Professional features',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced reporting',
        'White-label solutions',
        'Full API access',
        'Priority onboarding',
        'Custom workflows',
        '24/7 phone support'
      ],
      popular: false,
      recommended: false,
      color: '#1e40af',
      icon: '🏢'
    }
  ];

  const jobSeekerPlans = [
    {
      id: 'basic-js',
      name: 'Basic',
      price: '0',
      currency: 'KSH',
      period: 'month',
      features: [
        'Basic job matching',
        'Limited applications (5/month)',
        'Basic resume analysis',
        'Standard support',
        'Email notifications'
      ],
      popular: false,
      recommended: false,
      color: '#64748b',
      icon: '📋'
    },
    {
      id: 'starter-js',
      name: 'Starter',
      price: '1,500',
      currency: 'KSH',
      period: 'month',
      features: [
        'Advanced job matching',
        'Unlimited job applications',
        'Enhanced resume analysis',
        'Priority support',
        'Job alerts & notifications',
        'Basic career tips',
        'Resume optimization'
      ],
      popular: false,
      recommended: true,
      color: '#3b82f6',
      icon: '🚀'
    },
    {
      id: 'professional-js',
      name: 'Professional',
      price: '3,500',
      currency: 'KSH',
      period: 'month',
      features: [
        'AI-powered job matching',
        'Unlimited applications',
        'Advanced resume optimization',
        'Priority support',
        'Smart job alerts',
        'Career coaching tips',
        'Interview preparation tools',
        'Salary insights',
        'LinkedIn optimization'
      ],
      popular: true,
      recommended: false,
      color: '#8b5cf6',
      icon: '💼'
    },
    {
      id: 'premium-js',
      name: 'Premium',
      price: '5,500',
      currency: 'KSH',
      period: 'month',
      features: [
        'All Professional features',
        'Personal career advisor',
        'Exclusive job opportunities',
        'Resume writing service',
        'Mock interview sessions',
        'Salary negotiation guidance',
        'LinkedIn profile optimization',
        'Career transition support',
        'Priority job matching'
      ],
      popular: false,
      recommended: false,
      color: '#1e40af',
      icon: '👑'
    }
  ];

  const kenyanCompanies = [
    {
      name: 'Safaricom',
      logo: require('../assets/SAF-MAIN-LOGO.png'),
      website: 'https://www.safaricom.co.ke'
    },
    {
      name: 'KCB Group',
      logo: require('../assets/KCB.jpg'),
      website: 'https://www.kcbgroup.com'
    },
    {
      name: 'Equity Bank',
      logo: require('../assets/Equity_Group_Logo.png'),
      website: 'https://www.equitybank.co.ke'
    },
    {
      name: 'Co-op Bank',
      logo: require('../assets/c-operative_bank_logo.png'),
      website: 'https://www.co-opbank.co.ke'
    },
    {
      name: 'Kenya Airways',
      logo: require('../assets/KENYA AIRWAYSS.png'),
      website: 'https://www.kenya-airways.com'
    },
    {
      name: 'Nairobi Securities Exchange',
      logo: require('../assets/SAF-MAIN-LOGO.png'), // Using existing logo as placeholder
      website: 'https://www.nse.co.ke'
    },
    {
      name: 'Kenya Power',
      logo: require('../assets/KCB.jpg'), // Using existing logo as placeholder
      website: 'https://www.kplc.co.ke'
    },
    {
      name: 'Kenya Commercial Bank',
      logo: require('../assets/Equity_Group_Logo.png'), // Using existing logo as placeholder
      website: 'https://www.kcbgroup.com'
    },
    {
      name: 'Standard Chartered',
      logo: require('../assets/c-operative_bank_logo.png'), // Using existing logo as placeholder
      website: 'https://www.sc.com/ke'
    },
    {
      name: 'Absa Bank',
      logo: require('../assets/KENYA AIRWAYSS.png'), // Using existing logo as placeholder
      website: 'https://www.absabank.co.ke'
    }
  ];

  const testimonials = user?.role === 'recruiter' ? [
    {
      name: 'Sarah Mwangi',
      role: 'HR Director',
      company: 'Safaricom',
      text: 'RocketMatch has revolutionized our hiring process. The AI-powered matching saves us hours of screening time and delivers exceptional candidates.',
      rating: 5,
      avatar: '/default-avatar.png'
    },
    {
      name: 'John Kamau',
      role: 'Talent Manager',
      company: 'KCB Group',
      text: 'The quality of candidates we get through RocketMatch is exceptional. Our hiring efficiency improved by 40% since we started using the platform.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Grace Wanjiku',
      role: 'Recruitment Lead',
      company: 'Equity Bank',
      text: 'The analytics dashboard gives us insights we never had before. We can now make data-driven hiring decisions with confidence.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Ochieng',
      role: 'Head of HR',
      company: 'Co-op Bank',
      text: 'RocketMatch transformed our recruitment strategy. We now hire top talent in half the time with better results.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  ] : [
    {
      name: 'David Ochieng',
      role: 'Software Engineer',
      company: 'Safaricom',
      text: 'RocketMatch helped me find my dream job in just 2 weeks. The AI matching is incredibly accurate and saved me so much time.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Mary Njeri',
      role: 'Marketing Manager',
      company: 'Nation Media',
      text: 'The resume optimization tools are game-changing. I got 3 job offers within a month of upgrading to Professional.',
      rating: 5,
      avatar: '/default-avatar.png'
    },
    {
      name: 'Peter Kiprop',
      role: 'Data Analyst',
      company: 'Kenya Airways',
      text: 'Premium features like career coaching and interview prep made all the difference in my job search. Highly recommended!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Jane Wambui',
      role: 'UX Designer',
      company: 'KCB Group',
      text: 'RocketMatch connected me with opportunities I never knew existed. The career guidance is invaluable for my growth.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const handlePlanSelect = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedPlan(plan);
    
    // Store plan data for payment processing
    const paymentData = {
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      userRole: user?.role
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(paymentData));
    
    // Direct redirect to Pesapal product page
    if (plan.pesapalProductCode) {
      const pesapalUrl = `https://store.pesapal.com/shop/cptjqn-rocketmatch?productCode=${plan.pesapalProductCode}`;
      window.location.href = pesapalUrl;
    } else {
      // Fallback to general Pesapal store
      window.location.href = 'https://store.pesapal.com/aksharjobs';
    }
  };

  const plans = user?.role === 'recruiter' ? recruiterPlans : jobSeekerPlans;

  if (isPremium) {
    return (
      <div className="premium-container">
        <div className="premium-success">
          <div className="success-icon">🎉</div>
          <h1>You're Already Premium!</h1>
          <p>Enjoy all the premium features and benefits of your subscription.</p>
          <button 
            className="dashboard-btn"
            onClick={() => navigate(user?.role === 'recruiter' ? '/recruiter-dashboard' : '/jobseeker-dashboard')}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`premium-container ${isVisible ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <div className="premium-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Unlock Your <span className="gradient-text">Premium Potential</span>
          </h1>
          <p className="hero-subtitle">
            Join thousands of professionals who've accelerated their careers with our premium features
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">95%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="trusted-by-section">
        <p className="trusted-text">Trusted by leading Kenyan companies</p>
        <div className="logos-slider-container">
          <div className="logos-flow">
            <div className="logos-track">
              {[...kenyanCompanies, ...kenyanCompanies].map((company, index) => (
                <div 
                  key={`${company.name}-${index}`} 
                  className="company-logo"
                >
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="company-logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      e.target.nextSibling.style.display = 'none';
                    }}
                  />
                  <div className="company-name-fallback" style={{ display: 'none' }}>
                    <span className="company-name">{company.name}</span>
                  </div>
                  <span className="company-name">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="pricing-section">
        <div className="section-header">
          <h2>Choose Your Perfect Plan</h2>
          <p>Flexible pricing designed to grow with your career</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.recommended ? 'recommended' : ''}`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                '--plan-color': plan.color
              }}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              {plan.recommended && <div className="recommended-badge">Recommended</div>}
              
              <div className="plan-header">
                <div className="plan-icon">{plan.icon}</div>
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="currency">{plan.currency}</span>
                  <span className="amount">{plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="feature-item">
                    <span className="checkmark">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`select-plan-btn ${plan.popular ? 'popular' : ''} ${plan.recommended ? 'recommended' : ''}`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.price === '0' ? 'Get Started Free' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2>What Our Users Say</h2>
            <p>Real stories from real professionals</p>
          </div>
          
          <div className="testimonials-flow" ref={testimonialsRef}>
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <img src={testimonial.avatar} alt={testimonial.name} className="author-avatar" />
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                    <span className="author-company">{testimonial.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our premium plans</p>
        </div>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate any differences.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a free trial?</h4>
            <p>Yes, all paid plans come with a 7-day free trial. No credit card required to start your trial.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept M-Pesa, Airtel Money, Pesapal, and all major credit/debit cards for your convenience.</p>
          </div>
          <div className="faq-item">
            <h4>Can I cancel my subscription?</h4>
            <p>Absolutely! You can cancel your subscription at any time with no cancellation fees. Your access continues until the end of your billing period.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer refunds?</h4>
            <p>We offer a 30-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.</p>
          </div>
          <div className="faq-item">
            <h4>Is my data secure?</h4>
            <p>Yes, we use enterprise-grade security to protect your data. All information is encrypted and stored securely.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who've already upgraded to premium</p>
          <button 
            className="cta-button"
            onClick={() => {
              const recommendedPlan = plans.find(plan => plan.recommended);
              if (recommendedPlan) {
                handlePlanSelect(recommendedPlan);
              }
            }}
          >
            Start Your Premium Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;
