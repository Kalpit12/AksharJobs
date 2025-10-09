import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faSearch, 
  faChevronDown,
  faChevronUp,
  faUser,
  faBriefcase,
  faBuilding,
  faCog,
  faShieldAlt,
  faEnvelope,
  faPhone,
  faComments,
  faBook,
  faVideo,
  faLifeRing
} from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HelpCenter.css';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqCategories = [
    { id: 'all', name: 'All Topics', icon: faBook },
    { id: 'account', name: 'Account & Profile', icon: faUser },
    { id: 'jobs', name: 'Job Search', icon: faBriefcase },
    { id: 'employers', name: 'For Employers', icon: faBuilding },
    { id: 'technical', name: 'Technical Issues', icon: faCog },
    { id: 'privacy', name: 'Privacy & Security', icon: faShieldAlt }
  ];

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I create an account on AksharJobs?',
      answer: 'Click "Sign Up" on the homepage, choose your role (Job Seeker or Recruiter), fill in your details, and verify your email address. You can also sign up using Google or LinkedIn for faster registration.'
    },
    {
      id: 2,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Go to your dashboard and click "Edit Profile" or "Edit Personal Info" in any section. You can update your contact information, skills, experience, education, and projects directly from your profile page.'
    },
    {
      id: 3,
      category: 'jobs',
      question: 'How does the AI job matching work?',
      answer: 'Our AI analyzes your resume, skills, experience, and preferences to match you with relevant job opportunities. The system uses advanced algorithms to calculate match scores based on job requirements and your qualifications.'
    },
    {
      id: 4,
      category: 'jobs',
      question: 'Can I apply to jobs without creating an account?',
      answer: 'You can browse public job listings, but you need to create an account to apply for jobs, save positions, and access personalized job recommendations.'
    },
    {
      id: 5,
      category: 'employers',
      question: 'How do I post a job on AksharJobs?',
      answer: 'After creating a recruiter account, go to your dashboard and click "Post a Job". Fill in the job details, requirements, and company information. Your job will be reviewed and published within 24 hours.'
    },
    {
      id: 6,
      category: 'employers',
      question: 'What are the pricing plans for recruiters?',
      answer: 'We offer flexible pricing plans starting from $99/month for small teams to custom enterprise solutions. Each plan includes different features like number of job postings, AI matching, and support levels.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'Why can\'t I upload my resume?',
      answer: 'Ensure your resume is in PDF, DOC, or DOCX format and under 5MB. Clear your browser cache and try again. If the issue persists, contact our support team.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'The website is loading slowly. What should I do?',
      answer: 'Try refreshing the page, clearing your browser cache, or switching to a different browser. If you\'re on mobile, ensure you have a stable internet connection.'
    },
    {
      id: 9,
      category: 'privacy',
      question: 'How is my personal data protected?',
      answer: 'We use enterprise-grade security measures including SSL encryption, secure servers, and strict data access controls. We never share your personal information without your explicit consent.'
    },
    {
      id: 10,
      category: 'privacy',
      question: 'Can I delete my account and data?',
      answer: 'Yes, you can delete your account anytime from your profile settings. This will permanently remove all your data from our systems within 30 days.'
    }
  ];

  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      icon: faComments,
      availability: '24/7',
      responseTime: 'Immediate'
    },
    {
      title: 'Email Support',
      description: 'Send us detailed questions via email',
      icon: faEnvelope,
      availability: 'Always',
      responseTime: '&lt; 4 hours'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      icon: faPhone,
      availability: 'Mon-Fri 9AM-6PM',
      responseTime: 'Immediate'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      icon: faVideo,
      availability: 'Always',
      responseTime: 'Self-service'
    }
  ];

  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const searchedFAQs = filteredFAQs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="help_center_wrapper">
      <Header />
      
      {/* Hero Section */}
      <section className="help_hero">
        <div className="help_hero_container">
          <div className="hero_content">
            <h1 className="hero_title">
              <FontAwesomeIcon icon={faLifeRing} />
              Help Center
            </h1>
            <p className="hero_subtitle">
              Find answers to common questions, get support, and learn how to make the most of AksharJobs.
            </p>
            
            {/* Search Bar */}
            <div className="help_search">
              <FontAwesomeIcon icon={faSearch} className="search_icon" />
              <input
                type="text"
                placeholder="Search for help topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search_input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="support_options_section">
        <div className="help_container">
          <h2 className="section_title">Get Support</h2>
          <div className="support_grid">
            {supportOptions.map((option, index) => (
              <div key={index} className="support_card">
                <div className="support_icon">
                  <FontAwesomeIcon icon={option.icon} />
                </div>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <div className="support_details">
                  <span className="availability">Available: {option.availability}</span>
                  <span className="response_time">Response: {option.responseTime}</span>
                </div>
                <button className="support_btn">
                  Contact Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq_section">
        <div className="help_container">
          <h2 className="section_title">Frequently Asked Questions</h2>
          
          {/* Category Filter */}
          <div className="faq_filters">
            {faqCategories.map(category => (
              <button
                key={category.id}
                className={`faq_filter ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <FontAwesomeIcon icon={category.icon} />
                {category.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="faq_list">
            {searchedFAQs.map(faq => (
              <div key={faq.id} className={`faq_item ${openFAQ === faq.id ? 'open' : ''}`}>
                <button 
                  className="faq_question"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span>{faq.question}</span>
                  <FontAwesomeIcon 
                    icon={openFAQ === faq.id ? faChevronUp : faChevronDown} 
                    className="faq_icon"
                  />
                </button>
                <div className="faq_answer">
                  <p>{faq.answer}</p>
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

export default HelpCenter;
