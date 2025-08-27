import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/PricingPlans.css';

const PricingPlans = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    // Trigger animations on mount
    setIsVisible(true);
    
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
        'Basic analytics'
      ],
      popular: false,
      recommended: false,
      color: '#6A9C89'
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
        'Candidate database access'
      ],
      popular: false,
      recommended: true,
      color: '#4A7C59'
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
        'Bulk messaging'
      ],
      popular: true,
      recommended: false,
      color: '#16423C'
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
        'API access',
        'Priority onboarding'
      ],
      popular: false,
      recommended: false,
      color: '#2D5A4A'
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
        'Limited job applications (5/month)',
        'Basic resume analysis',
        'Standard support'
      ],
      popular: false,
      recommended: false,
      color: '#6A9C89'
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
        'Job alerts'
      ],
      popular: false,
      recommended: true,
      color: '#4A7C59'
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
        'Job alerts & notifications',
        'Career coaching tips',
        'Interview preparation tools'
      ],
      popular: true,
      recommended: false,
      color: '#16423C'
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
        'LinkedIn profile optimization'
      ],
      popular: false,
      recommended: false,
      color: '#2D5A4A'
    }
  ];

  const kenyanCompanies = [
    { 
      name: 'Safaricom', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Safaricom_Logo.svg/1200px-Safaricom_Logo.svg.png',
      website: 'https://www.safaricom.co.ke'
    },
    { 
      name: 'KCB Group', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/KCB_Group_logo.svg/1200px-KCB_Group_logo.svg.png',
      website: 'https://www.kcbgroup.com'
    },
    { 
      name: 'Equity Bank', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Equity_Bank_Kenya_logo.svg/1200px-Equity_Bank_Kenya_logo.svg.png',
      website: 'https://www.equitybank.co.ke'
    },
    { 
      name: 'Co-op Bank', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Co-operative_Bank_of_Kenya_logo.svg/1200px-Co-operative_Bank_of_Kenya_logo.svg.png',
      website: 'https://www.co-opbank.co.ke'
    },
    { 
      name: 'Nation Media', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nation_Media_Group_logo.svg/1200px-Nation_Media_Group_logo.svg.png',
      website: 'https://www.nation.co.ke'
    },
    { 
      name: 'Kenya Airways', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Kenya_Airways_logo.svg/1200px-Kenya_Airways_logo.svg.png',
      website: 'https://www.kenya-airways.com'
    },
    { 
      name: 'Bamburi Cement', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Bamburi_Cement_logo.svg/1200px-Bamburi_Cement_logo.svg.png',
      website: 'https://www.bamburicement.com'
    },
    { 
      name: 'East African Breweries', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/East_African_Breweries_logo.svg/1200px-East_African_Breweries_logo.svg.png',
      website: 'https://www.eabl.com'
    }
  ];

  const testimonials = userRole === 'recruiter' ? [
    {
      name: 'Sarah Mwangi',
      role: 'HR Director',
      company: 'Safaricom',
      text: 'RocketMatch has revolutionized our hiring process. The AI-powered matching saves us hours of screening time.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'John Kamau',
      role: 'Talent Manager',
      company: 'KCB Group',
      text: 'The quality of candidates we get through RocketMatch is exceptional. Highly recommended for any HR team.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Grace Wanjiku',
      role: 'Recruitment Lead',
      company: 'Equity Bank',
      text: 'The analytics dashboard gives us insights we never had before. Our hiring efficiency improved by 40%.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Ochieng',
      role: 'Head of HR',
      company: 'Co-op Bank',
      text: 'RocketMatch transformed our recruitment strategy. We now hire top talent in half the time.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Faith Njeri',
      role: 'Talent Acquisition',
      company: 'Nation Media',
      text: 'The AI matching is incredibly accurate. We\'ve reduced our time-to-hire by 60%.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'David Kiprop',
      role: 'HR Manager',
      company: 'Kenya Airways',
      text: 'RocketMatch delivers exceptional candidates consistently. Our hiring quality has never been better.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Winnie Akinyi',
      role: 'Recruitment Specialist',
      company: 'Bamburi Cement',
      text: 'The platform is intuitive and powerful. We\'ve streamlined our entire hiring process.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Robert Muthoni',
      role: 'Talent Director',
      company: 'East African Breweries',
      text: 'RocketMatch exceeded our expectations. The ROI on our recruitment investment is remarkable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    }
  ] : [
    {
      name: 'David Ochieng',
      role: 'Software Engineer',
      company: 'Safaricom',
      text: 'RocketMatch helped me find my dream job in just 2 weeks. The AI matching is incredibly accurate!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Mary Njeri',
      role: 'Marketing Manager',
      company: 'Nation Media',
      text: 'The resume optimization tools are game-changing. I got 3 job offers within a month of upgrading.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Peter Kiprop',
      role: 'Data Analyst',
      company: 'Kenya Airways',
      text: 'Premium features like career coaching and interview prep made all the difference in my job search.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Jane Wambui',
      role: 'UX Designer',
      company: 'KCB Group',
      text: 'RocketMatch connected me with opportunities I never knew existed. The career guidance is invaluable.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'James Mutua',
      role: 'Product Manager',
      company: 'Equity Bank',
      text: 'The AI job matching is spot-on. I found a role that perfectly fits my skills and career goals.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Lucy Akinyi',
      role: 'Business Analyst',
      company: 'Co-op Bank',
      text: 'Premium features accelerated my career growth. The interview preparation tools are excellent.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Kevin Odhiambo',
      role: 'DevOps Engineer',
      company: 'Bamburi Cement',
      text: 'RocketMatch helped me transition into a new role seamlessly. The platform is incredibly user-friendly.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Ann Muthoni',
      role: 'Sales Manager',
      company: 'East African Breweries',
      text: 'The career coaching and salary negotiation guidance helped me secure a 30% pay increase.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    // Redirect to Pesapal payment page
    const paymentData = {
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      userRole: userRole
    };
    
    // Store plan data in localStorage for payment processing
    localStorage.setItem('selectedPlan', JSON.stringify(paymentData));
    
    // Redirect to payment page (you'll need to implement this)
    navigate('/payment', { state: { plan: paymentData } });
  };

  const handleGoBack = () => {
    // Check if user came from a specific page or use default navigation
    const referrer = document.referrer;
    const currentPath = window.location.pathname;
    
    if (referrer && referrer.includes(window.location.origin)) {
      // User came from within the app, go back
      navigate(-1);
    } else {
      // User came from outside or direct link, go to appropriate dashboard
      const userRole = localStorage.getItem('role');
      if (userRole === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else if (userRole === 'jobseeker') {
        navigate('/jobseeker-dashboard');
      } else {
        // Fallback to home page
        navigate('/');
      }
    }
  };

  const plans = userRole === 'recruiter' ? recruiterPlans : jobSeekerPlans;

  return (
    <div className={`pricing-container ${isVisible ? 'fade-in' : ''}`}>

      <div className="pricing-header animate-slide-down">
        <h1>Choose Your Perfect Plan</h1>
        <p>Unlock your potential with our tailored subscription plans</p>
        <div className="role-indicator">
          <span className={`role-badge ${userRole === 'recruiter' ? 'recruiter' : 'jobseeker'}`}>
            {userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'} Plans
          </span>
        </div>
      </div>

      <div className="trusted-by animate-slide-up">
        <p>Trusted by leading Kenyan companies</p>
        <div className="company-logos">
          {kenyanCompanies.map((company, index) => (
            <div 
              key={index} 
              className="company-logo animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <img 
                src={company.logo} 
                alt={company.name}
                className="company-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="company-name">{company.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div 
            key={plan.id} 
            className={`pricing-card ${plan.popular ? 'popular' : ''} ${plan.recommended ? 'recommended' : ''} animate-card`}
            style={{ 
              borderColor: plan.color,
              animationDelay: `${index * 0.2}s`
            }}
          >
            {plan.popular && <div className="popular-badge animate-bounce">Most Popular</div>}
            {plan.recommended && <div className="recommended-badge animate-pulse">Recommended</div>}
            <div className="plan-header">
              <h3>{plan.name}</h3>
              <div className="price">
                <span className="currency">{plan.currency}</span>
                <span className="amount">{plan.price}</span>
                <span className="period">/{plan.period}</span>
              </div>
            </div>
            <ul className="features">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="animate-feature" style={{ animationDelay: `${featureIndex * 0.1}s` }}>
                  <span className="checkmark">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <button 
              className={`select-plan-btn ${plan.popular ? 'popular' : ''} ${plan.recommended ? 'recommended' : ''}`}
              onClick={() => handlePlanSelect(plan)}
              style={{ backgroundColor: plan.color }}
            >
              {plan.price === '0' ? 'Get Started Free' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      <div className="testimonials-section animate-slide-up">
        <h2>What Our Users Say</h2>
        <div className="testimonials-flow" ref={testimonialsRef}>
          <div className="testimonials-track">
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="testimonial-card animate-testimonial">
                <div className="testimonial-avatar">
                  <img src={testimonial.avatar} alt={testimonial.name} />
                </div>
                <div className="testimonial-rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="star">⭐</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                    <span className="company">{testimonial.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="faq-section animate-slide-up">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item animate-fade-in">
            <h4>Can I change my plan anytime?</h4>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div className="faq-item animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h4>Is there a free trial?</h4>
            <p>Yes, all paid plans come with a 7-day free trial. No credit card required to start.</p>
          </div>
          <div className="faq-item animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major payment methods including M-Pesa, Pesapal, and international cards.</p>
          </div>
          <div className="faq-item animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h4>Can I cancel my subscription?</h4>
            <p>Absolutely! You can cancel your subscription at any time with no cancellation fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
