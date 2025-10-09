import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb, 
  faRocket, 
  faBullseye, 
  faNetworkWired,
  faChartLine,
  faBrain,
  faHandshake,
  faGraduationCap,
  faBriefcase,
  faUsers,
  faArrowRight,
  faBookOpen,
  faStar,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CareerAdvice.css';

const CareerAdvice = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const careerTips = [
    {
      id: 1,
      category: 'job-search',
      title: 'Optimize Your Resume for ATS',
      excerpt: 'Learn how to make your resume pass Applicant Tracking Systems and reach human recruiters.',
      content: 'Use relevant keywords from job descriptions, maintain clean formatting, and include quantifiable achievements.',
      icon: faBullseye,
      readTime: '5 min read',
      difficulty: 'Beginner'
    },
    {
      id: 2,
      category: 'networking',
      title: 'Build Your Professional Network',
      excerpt: 'Discover effective strategies to expand your professional network and create meaningful connections.',
      content: 'Attend industry events, engage on LinkedIn, join professional associations, and maintain regular contact.',
      icon: faNetworkWired,
      readTime: '8 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 3,
      category: 'skills',
      title: 'Future-Proof Your Skills',
      excerpt: 'Stay ahead of industry trends by developing in-demand skills for the digital economy.',
      content: 'Focus on AI/ML, cloud computing, data analysis, and soft skills like emotional intelligence.',
      icon: faBrain,
      readTime: '10 min read',
      difficulty: 'Advanced'
    },
    {
      id: 4,
      category: 'interview',
      title: 'Master the Interview Process',
      excerpt: 'Comprehensive guide to acing interviews from preparation to follow-up.',
      content: 'Research the company, practice STAR method responses, prepare thoughtful questions, and send thank-you notes.',
      icon: faHandshake,
      readTime: '12 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 5,
      category: 'career-growth',
      title: 'Accelerate Career Progression',
      excerpt: 'Strategic approaches to advance your career and increase your earning potential.',
      content: 'Set clear goals, seek mentorship, take on challenging projects, and continuously learn new skills.',
      icon: faChartLine,
      readTime: '7 min read',
      difficulty: 'Intermediate'
    },
    {
      id: 6,
      category: 'job-search',
      title: 'Navigate Career Transitions',
      excerpt: 'Successfully transition between industries or roles with confidence.',
      content: 'Identify transferable skills, gain relevant experience through projects, and leverage your network.',
      icon: faRocket,
      readTime: '9 min read',
      difficulty: 'Advanced'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Topics', icon: faBookOpen },
    { id: 'job-search', name: 'Job Search', icon: faBullseye },
    { id: 'networking', name: 'Networking', icon: faNetworkWired },
    { id: 'skills', name: 'Skill Development', icon: faBrain },
    { id: 'interview', name: 'Interview Prep', icon: faHandshake },
    { id: 'career-growth', name: 'Career Growth', icon: faChartLine }
  ];

  const careerPaths = [
    {
      title: 'Software Development',
      description: 'Build applications and systems that power the digital world',
      steps: ['Learn Programming Basics', 'Build Projects', 'Contribute to Open Source', 'Apply for Junior Roles'],
      avgSalary: '$75,000 - $150,000',
      timeToEntry: '6-12 months'
    },
    {
      title: 'Data Science',
      description: 'Extract insights from data to drive business decisions',
      steps: ['Master Statistics & Python', 'Learn ML Algorithms', 'Complete Data Projects', 'Build Portfolio'],
      avgSalary: '$80,000 - $160,000',
      timeToEntry: '8-15 months'
    },
    {
      title: 'Product Management',
      description: 'Guide product strategy and coordinate cross-functional teams',
      steps: ['Understand Business Strategy', 'Learn User Research', 'Practice Product Thinking', 'Lead Projects'],
      avgSalary: '$90,000 - $180,000',
      timeToEntry: '12-24 months'
    },
    {
      title: 'Digital Marketing',
      description: 'Drive growth through digital channels and data-driven campaigns',
      steps: ['Learn Digital Channels', 'Master Analytics', 'Create Campaigns', 'Build Results Portfolio'],
      avgSalary: '$50,000 - $120,000',
      timeToEntry: '4-8 months'
    }
  ];

  const filteredTips = activeCategory === 'all' 
    ? careerTips 
    : careerTips.filter(tip => tip.category === activeCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="career_advice_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="advice_hero">
        <div className="advice_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faLightbulb} />
              Career Advice & Guidance
            </h1>
            <p className="hero_subtitle">
              Expert insights, practical tips, and proven strategies to accelerate your career growth. 
              From job searching to skill development, we've got you covered.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category_filter_section">
        <div className="advice_container">
          <div className="category_filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category_btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Career Tips */}
      <section className="career_tips_section">
        <div className="advice_container">
          <h2 className="section_title">Career Tips & Insights</h2>
          <div className="tips_grid">
            {filteredTips.map(tip => (
              <div key={tip.id} className="tip_card">
                <div className="tip_header">
                  <div className="tip_icon">
                    <FontAwesomeIcon icon={tip.icon} />
                  </div>
                  <div className="tip_meta">
                    <span className="read_time">{tip.readTime}</span>
                    <span 
                      className="difficulty"
                      style={{ color: getDifficultyColor(tip.difficulty) }}
                    >
                      {tip.difficulty}
                    </span>
                  </div>
                </div>
                <h3 className="tip_title">{tip.title}</h3>
                <p className="tip_excerpt">{tip.excerpt}</p>
                <div className="tip_content">
                  <p>{tip.content}</p>
                </div>
                <button className="read_more_btn">
                  <FontAwesomeIcon icon={faArrowRight} />
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="career_paths_section">
        <div className="advice_container">
          <h2 className="section_title">Popular Career Paths</h2>
          <div className="paths_grid">
            {careerPaths.map((path, index) => (
              <div key={index} className="path_card">
                <div className="path_header">
                  <h3>{path.title}</h3>
                  <p className="path_description">{path.description}</p>
                </div>
                
                <div className="path_details">
                  <div className="path_stat">
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>Avg Salary: {path.avgSalary}</span>
                  </div>
                  <div className="path_stat">
                    <FontAwesomeIcon icon={faGraduationCap} />
                    <span>Time to Entry: {path.timeToEntry}</span>
                  </div>
                </div>
                
                <div className="path_steps">
                  <h4>Learning Path:</h4>
                  <ul>
                    {path.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="path_btn">
                  <FontAwesomeIcon icon={faRocket} />
                  Start This Path
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="advice_cta">
        <div className="advice_container">
          <div className="cta_content">
            <h2>Ready to Accelerate Your Career?</h2>
            <p>Join thousands of professionals who have transformed their careers with AksharJobs</p>
            <div className="cta_buttons">
              <button className="cta_btn primary">
                <FontAwesomeIcon icon={faRocket} />
                Browse Jobs
              </button>
              <button className="cta_btn secondary">
                <FontAwesomeIcon icon={faUsers} />
                Join Community
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareerAdvice;
