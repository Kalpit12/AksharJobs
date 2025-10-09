import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faRocket, 
  faChartLine, 
  faShieldAlt,
  faBrain,
  faHandshake,
  faGlobe,
  faClock,
  faCheckCircle,
  faArrowRight,
  faStar,
  faBuilding,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/RecruitmentSolutions.css';

const RecruitmentSolutions = () => {
  const solutions = [
    {
      title: 'AI-Powered Candidate Matching',
      description: 'Our advanced AI analyzes resumes and job requirements to find the perfect matches with 95% accuracy.',
      features: ['Intelligent skill matching', 'Cultural fit assessment', 'Automated screening', 'Bias reduction'],
      icon: faBrain,
      popular: true
    },
    {
      title: 'Global Talent Pool Access',
      description: 'Tap into our diverse network of 50,000+ verified professionals across multiple industries.',
      features: ['Pre-screened candidates', 'Global reach', 'Industry expertise', 'Quality assurance'],
      icon: faGlobe,
      popular: false
    },
    {
      title: 'Streamlined Hiring Process',
      description: 'Reduce time-to-hire by 60% with our automated workflows and integrated communication tools.',
      features: ['Automated workflows', 'Interview scheduling', 'Real-time updates', 'Team collaboration'],
      icon: faRocket,
      popular: true
    },
    {
      title: 'Advanced Analytics & Insights',
      description: 'Make data-driven hiring decisions with comprehensive analytics and market intelligence.',
      features: ['Hiring analytics', 'Market insights', 'Performance metrics', 'ROI tracking'],
      icon: faChartLine,
      popular: false
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams and startups',
      features: [
        '5 job postings',
        'Basic candidate matching',
        'Email support',
        'Standard analytics',
        'Up to 3 team members'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing companies',
      features: [
        '25 job postings',
        'AI-powered matching',
        'Priority support',
        'Advanced analytics',
        'Up to 10 team members',
        'Custom branding',
        'Interview scheduling'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations with specific needs',
      features: [
        'Unlimited job postings',
        'Full AI suite',
        'Dedicated account manager',
        'Custom integrations',
        'Unlimited team members',
        'White-label solution',
        'Advanced security',
        'Custom reporting'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      company: 'TechCorp Solutions',
      logo: 'TC',
      quote: 'AksharJobs reduced our time-to-hire by 65% and improved candidate quality significantly.',
      author: 'Sarah Johnson',
      position: 'Head of Talent Acquisition'
    },
    {
      company: 'Innovation Labs',
      logo: 'IL',
      quote: 'The AI matching is incredibly accurate. We\'ve made our best hires through this platform.',
      author: 'Michael Chen',
      position: 'CTO'
    },
    {
      company: 'Global Dynamics',
      logo: 'GD',
      quote: 'Excellent platform for finding diverse talent across different regions and skill sets.',
      author: 'Priya Patel',
      position: 'Recruitment Director'
    }
  ];

  return (
    <div className="recruitment_solutions_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="recruitment_hero">
        <div className="recruitment_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              Recruitment Solutions That Scale
            </h1>
            <p className="hero_subtitle">
              Transform your hiring process with AI-powered recruitment tools designed for modern businesses. 
              Find top talent faster, reduce costs, and build exceptional teams.
            </p>
            <div className="hero_stats">
              <div className="stat">
                <span className="stat_number">50,000+</span>
                <span className="stat_label">Qualified Candidates</span>
              </div>
              <div className="stat">
                <span className="stat_number">95%</span>
                <span className="stat_label">Match Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat_number">60%</span>
                <span className="stat_label">Faster Hiring</span>
              </div>
            </div>
            <div className="hero_actions">
              <button className="btn btn_primary">
                <FontAwesomeIcon icon={faRocket} />
                Start Free Trial
              </button>
              <button className="btn btn_secondary">
                <FontAwesomeIcon icon={faUsers} />
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="solutions_section">
        <div className="recruitment_container">
          <h2 className="section_title">Our Recruitment Solutions</h2>
          <div className="solutions_grid">
            {solutions.map((solution, index) => (
              <div key={index} className={`solution_card ${solution.popular ? 'popular' : ''}`}>
                {solution.popular && <div className="popular_badge">Most Popular</div>}
                <div className="solution_icon">
                  <FontAwesomeIcon icon={solution.icon} />
                </div>
                <h3>{solution.title}</h3>
                <p className="solution_description">{solution.description}</p>
                <ul className="solution_features">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="solution_btn">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing_section">
        <div className="recruitment_container">
          <h2 className="section_title">Choose Your Plan</h2>
          <div className="pricing_grid">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`pricing_card ${plan.popular ? 'popular' : ''}`}>
                {plan.popular && <div className="popular_badge">Recommended</div>}
                <div className="pricing_header">
                  <h3>{plan.name}</h3>
                  <div className="pricing_price">
                    <span className="price">{plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </div>
                  <p className="pricing_description">{plan.description}</p>
                </div>
                <ul className="pricing_features">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`pricing_btn ${plan.popular ? 'primary' : 'secondary'}`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials_section">
        <div className="recruitment_container">
          <h2 className="section_title">What Our Clients Say</h2>
          <div className="testimonials_grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial_card">
                <div className="testimonial_header">
                  <div className="company_logo">{testimonial.logo}</div>
                  <div className="company_info">
                    <h4>{testimonial.company}</h4>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="testimonial_quote">
                  "{testimonial.quote}"
                </blockquote>
                <div className="testimonial_author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.position}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RecruitmentSolutions;
