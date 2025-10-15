import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/FINAL AKLOGO.jpg';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Job details data (same as in HTML)
  const jobDetails = {
    job1: {
      title: 'Senior Software Engineer',
      company: 'TechCorp Solutions',
      logo: 'TC',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120K - $180K',
      posted: '2 days ago',
      description: 'We are seeking a talented Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions that power our platform.',
      responsibilities: [
        'Design and develop scalable web applications',
        'Collaborate with cross-functional teams to define and implement new features',
        'Write clean, maintainable, and efficient code',
        'Participate in code reviews and mentor junior developers',
        'Optimize application performance and scalability'
      ],
      requirements: [
        '5+ years of software development experience',
        'Strong proficiency in React and Node.js',
        'Experience with AWS cloud services',
        'Excellent problem-solving and communication skills',
        'Bachelor\'s degree in Computer Science or related field'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Flexible work schedule and remote options',
        'Professional development opportunities'
      ],
      tags: ['React', 'Node.js', 'AWS', 'Remote Available']
    },
    job2: {
      title: 'Product Designer',
      company: 'Design Innovations Inc.',
      logo: 'DI',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90K - $130K',
      posted: '1 week ago',
      description: 'Join our creative team as a Product Designer where you will craft beautiful and intuitive user experiences for our digital products.',
      responsibilities: [
        'Create wireframes, prototypes, and high-fidelity designs',
        'Conduct user research and usability testing',
        'Collaborate with product managers and developers',
        'Maintain and evolve our design system',
        'Present design concepts to stakeholders'
      ],
      requirements: [
        '3+ years of product design experience',
        'Expert proficiency in Figma',
        'Strong portfolio demonstrating UI/UX skills',
        'Understanding of design systems and accessibility',
        'Excellent communication and presentation skills'
      ],
      benefits: [
        'Competitive salary and benefits',
        'Creative and collaborative work environment',
        'Latest design tools and equipment',
        'Hybrid work model',
        'Annual design conference budget'
      ],
      tags: ['Figma', 'UI/UX', 'Prototyping', 'Hybrid']
    },
    job3: {
      title: 'Marketing Manager',
      company: 'FutureMark Agency',
      logo: 'FM',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$80K - $110K',
      posted: '3 days ago',
      description: 'We are looking for a strategic Marketing Manager to lead our digital marketing initiatives and drive brand growth.',
      responsibilities: [
        'Develop and execute marketing strategies',
        'Manage digital marketing campaigns across channels',
        'Analyze campaign performance and optimize ROI',
        'Lead content creation and SEO initiatives',
        'Collaborate with sales team to generate leads'
      ],
      requirements: [
        '4+ years of marketing experience',
        'Proven track record in digital marketing',
        'Strong analytical and project management skills',
        'Experience with SEO, SEM, and content marketing',
        'Bachelor\'s degree in Marketing or related field'
      ],
      benefits: [
        'Competitive compensation package',
        'Health and wellness benefits',
        'Professional development budget',
        'Flexible remote work options',
        'Dynamic and growing team'
      ],
      tags: ['Digital Marketing', 'SEO', 'Content Strategy', 'Remote Option']
    }
  };

  // Modal management
  const openModal = (modalId, jobTitle, companyName) => {
    setActiveModal(modalId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalId) => {
    setActiveModal(null);
    document.body.style.overflow = 'auto';
  };

  // Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Form handlers
  const handleSignIn = (e) => {
    e.preventDefault();
    showToast('✅ Successfully signed in! Welcome back.', 'success');
    closeModal('signinModal');
    navigate('/login');
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    showToast('✅ Account created successfully! Welcome to AksharJobs.', 'success');
    closeModal('signupModal');
    navigate('/signup');
  };

  const handleJobApplication = (e) => {
    e.preventDefault();
    const jobTitle = document.getElementById('applyJobTitle')?.textContent || 'this position';
    showToast(`✅ Application submitted successfully for ${jobTitle}!`, 'success');
    closeModal('applicationModal');
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    showToast('✅ Job posted successfully! It will be live within 24 hours.', 'success');
    closeModal('postJobModal');
    navigate('/post-job');
  };

  const socialLogin = (provider) => {
    showToast(`🔄 Connecting to ${provider}...`, 'success');
    navigate('/oauth');
  };

  const saveJob = (jobId) => {
    const job = jobDetails[jobId];
    showToast(`💾 ${job.title} saved to your profile!`, 'success');
  };

  // Search functionality
  const performSearch = () => {
    if (!searchQuery && !searchLocation) {
      showToast('⚠️ Please enter a job title or location to search', 'error');
      return;
    }
    
    showToast(`🔍 Searching for "${searchQuery}" in "${searchLocation}"...`, 'success');
    
    // Navigate to job search page
    setTimeout(() => {
      navigate('/job-search', { 
        state: { 
          query: searchQuery, 
          location: searchLocation 
        } 
      });
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  // Category card click
  const handleCategoryClick = (category) => {
    showToast(`📂 Browsing ${category} jobs...`, 'success');
    setTimeout(() => {
      navigate('/job-search', { state: { category } });
    }, 500);
  };

  const handleViewAllJobs = () => {
    showToast('📋 Loading more jobs...', 'success');
    navigate('/job-search');
  };

  // Open job detail modal
  const openJobDetail = (jobId) => {
    setActiveModal('jobDetailModal');
    // Job details will be displayed in the modal
  };

  // Welcome message on page load
  useEffect(() => {
    setTimeout(() => {
      showToast('👋 Welcome to AksharJobs! Find your dream job today.', 'success');
    }, 1000);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains('modal')) {
        setActiveModal(null);
        document.body.style.overflow = 'auto';
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && activeModal) {
        setActiveModal(null);
        document.body.style.overflow = 'auto';
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeModal]);

  return (
    <div className="homepage">
      {/* Header */}
      <header>
        <div className="nav-container">
          <div className="logo">
            <img src={logoImage} alt="AksharJobs Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-name">AksharJobs</span>
              <span className="logo-tagline">CONNECT|DISCOVER|ELEVATE</span>
            </div>
          </div>
          <nav>
            <ul>
              <li><a href="#jobs">Find Jobs</a></li>
              <li><a href="#companies">Companies</a></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
          <div className="cta-buttons">
            {user ? (
              <>
                <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                  Dashboard
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/post-job')}>
                  Post a Job
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-secondary" onClick={() => openModal('signinModal')}>
                  Sign In
                </button>
                <button className="btn btn-primary" onClick={() => openModal('postJobModal')}>
                  Post a Job
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job With AksharJobs</h1>
          <p>CONNECT | DISCOVER | ELEVATE - Connect with thousands of employers and discover opportunities that match your skills and aspirations</p>
        </div>
        
        <div className="search-container">
          <div className="search-box">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Job title, keywords, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <input 
              type="text" 
              className="search-input" 
              placeholder="City, state, or remote"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn btn-search" onClick={performSearch}>
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3>50,000+</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Companies</p>
          </div>
          <div className="stat-item">
            <h3>2M+</h3>
            <p>Job Seekers</p>
          </div>
          <div className="stat-item">
            <h3>100K+</h3>
            <p>Successful Hires</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories" id="categories">
        <h2 className="section-title">Browse Jobs by Category</h2>
        <p className="section-subtitle">Explore opportunities across various industries and specializations</p>
        
        <div className="category-grid">
          <div className="category-card" onClick={() => handleCategoryClick('Technology & IT')}>
            <div className="category-icon">💻</div>
            <h3>Technology & IT</h3>
            <p>12,450 open positions</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Healthcare')}>
            <div className="category-icon">🏥</div>
            <h3>Healthcare</h3>
            <p>8,320 open positions</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Finance & Accounting')}>
            <div className="category-icon">📊</div>
            <h3>Finance & Accounting</h3>
            <p>6,890 open positions</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Design & Creative')}>
            <div className="category-icon">🎨</div>
            <h3>Design & Creative</h3>
            <p>4,560 open positions</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Marketing & Sales')}>
            <div className="category-icon">📱</div>
            <h3>Marketing & Sales</h3>
            <p>7,230 open positions</p>
          </div>
          <div className="category-card" onClick={() => handleCategoryClick('Education')}>
            <div className="category-icon">🎓</div>
            <h3>Education</h3>
            <p>3,890 open positions</p>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="featured-jobs" id="jobs">
        <div className="jobs-container">
          <h2 className="section-title">Featured Jobs</h2>
          <p className="section-subtitle">Hand-picked opportunities from top companies</p>

          <div className="job-card" onClick={() => openJobDetail('job1')}>
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">TC</div>
                <div className="job-info">
                  <h3 className="job-title">Senior Software Engineer</h3>
                  <p className="company-name">TechCorp Solutions</p>
                  <div className="job-meta">
                    <span>📍 San Francisco, CA</span>
                    <span>💼 Full-time</span>
                    <span>💰 $120K - $180K</span>
                    <span>⏰ Posted 2 days ago</span>
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('applicationModal');
                  document.getElementById('applyJobTitle').textContent = 'Senior Software Engineer';
                  document.getElementById('applyCompanyName').textContent = 'TechCorp Solutions';
                }}
              >
                Apply Now
              </button>
            </div>
            <div className="job-tags">
              <span className="tag">React</span>
              <span className="tag">Node.js</span>
              <span className="tag">AWS</span>
              <span className="tag">Remote Available</span>
            </div>
          </div>

          <div className="job-card" onClick={() => openJobDetail('job2')}>
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">DI</div>
                <div className="job-info">
                  <h3 className="job-title">Product Designer</h3>
                  <p className="company-name">Design Innovations Inc.</p>
                  <div className="job-meta">
                    <span>📍 New York, NY</span>
                    <span>💼 Full-time</span>
                    <span>💰 $90K - $130K</span>
                    <span>⏰ Posted 1 week ago</span>
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('applicationModal');
                  document.getElementById('applyJobTitle').textContent = 'Product Designer';
                  document.getElementById('applyCompanyName').textContent = 'Design Innovations Inc.';
                }}
              >
                Apply Now
              </button>
            </div>
            <div className="job-tags">
              <span className="tag">Figma</span>
              <span className="tag">UI/UX</span>
              <span className="tag">Prototyping</span>
              <span className="tag">Hybrid</span>
            </div>
          </div>

          <div className="job-card" onClick={() => openJobDetail('job3')}>
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">FM</div>
                <div className="job-info">
                  <h3 className="job-title">Marketing Manager</h3>
                  <p className="company-name">FutureMark Agency</p>
                  <div className="job-meta">
                    <span>📍 Austin, TX</span>
                    <span>💼 Full-time</span>
                    <span>💰 $80K - $110K</span>
                    <span>⏰ Posted 3 days ago</span>
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  openModal('applicationModal');
                  document.getElementById('applyJobTitle').textContent = 'Marketing Manager';
                  document.getElementById('applyCompanyName').textContent = 'FutureMark Agency';
                }}
              >
                Apply Now
              </button>
            </div>
            <div className="job-tags">
              <span className="tag">Digital Marketing</span>
              <span className="tag">SEO</span>
              <span className="tag">Content Strategy</span>
              <span className="tag">Remote Option</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary btn-large" onClick={handleViewAllJobs}>
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="cta-section" 
        style={{
          background: 'linear-gradient(135deg, #6A8EEB 0%, #8A6AEB 100%) !important',
          color: 'white !important',
          padding: '4rem 2rem !important',
          textAlign: 'center !important'
        }}
      >
        <div className="cta-content">
          <h2 style={{ color: 'white !important', fontSize: '2.5rem !important', fontWeight: 'bold !important' }}>
            Ready to Take the Next Step?
          </h2>
          <p style={{ color: 'white !important', fontSize: '1.2rem !important' }}>
            Join thousands of professionals who found their perfect job through AksharJobs. Create your profile today and get discovered by top employers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary btn-large" 
              onClick={() => openModal('signupModal')}
              style={{
                background: '#4285F4 !important',
                color: 'white !important',
                border: 'none !important'
              }}
            >
              Create Your Profile
            </button>
            <button 
              className="btn btn-secondary btn-large" 
              onClick={() => openModal('postJobModal')}
              style={{
                background: 'transparent !important',
                color: '#C3B1E1 !important',
                border: '2px solid white !important'
              }}
            >
              Post a Job Opening
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>For Job Seekers</h3>
            <ul>
              <li><a href="#browse">Browse Jobs</a></li>
              <li><a href="#companies">Browse Companies</a></li>
              <li><a href="#salary">Salary Calculator</a></li>
              <li><a href="#resources">Career Resources</a></li>
              <li><a href="#resume">Resume Builder</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>For Employers</h3>
            <ul>
              <li><a href="#post">Post a Job</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#talent">Browse Talent</a></li>
              <li><a href="#solutions">Hiring Solutions</a></li>
              <li><a href="#ads">Advertise</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>About AksharJobs</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#press">Press</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#accessibility">Accessibility</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 AksharJobs. All rights reserved. | Connecting talent with opportunity.</p>
        </div>
      </footer>

      {/* Modals */}
      {/* Sign In Modal */}
      {activeModal === 'signinModal' && (
        <div className="modal active">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('signinModal')}>&times;</button>
            <div className="modal-header">
              <h2>Welcome Back!</h2>
              <p>Sign in to access your AksharJobs account</p>
            </div>
            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Enter your password" />
              </div>
              <div className="checkbox-group" style={{ marginBottom: '1rem' }}>
                <input type="checkbox" id="remember" />
                <label htmlFor="remember" style={{ margin: 0 }}>Remember me</label>
              </div>
              <button type="submit" className="btn-submit">Sign In</button>
            </form>
            <div className="form-divider">
              <span>or continue with</span>
            </div>
            <div className="social-login">
              <button className="btn-social" onClick={() => socialLogin('Google')}>🔍 Google</button>
              <button className="btn-social" onClick={() => socialLogin('LinkedIn')}>💼 LinkedIn</button>
            </div>
            <div className="form-footer">
              Don't have an account? <a href="#" onClick={() => setActiveModal('signupModal')}>Sign up</a>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {activeModal === 'signupModal' && (
        <div className="modal active">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('signupModal')}>&times;</button>
            <div className="modal-header">
              <h2>Create Your Account</h2>
              <p>Join thousands of job seekers finding their dream careers</p>
            </div>
            <form onSubmit={handleSignUp}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" required placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" required placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Create a strong password" />
              </div>
              <div className="form-group">
                <label>I am a:</label>
                <select required>
                  <option value="">Select your role</option>
                  <option value="jobseeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                  <option value="recruiter">Recruiter</option>
                </select>
              </div>
              <div className="checkbox-group" style={{ marginBottom: '1rem' }}>
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms" style={{ margin: 0 }}>I agree to the Terms & Conditions</label>
              </div>
              <button type="submit" className="btn-submit">Create Account</button>
            </form>
            <div className="form-divider">
              <span>or sign up with</span>
            </div>
            <div className="social-login">
              <button className="btn-social" onClick={() => socialLogin('Google')}>🔍 Google</button>
              <button className="btn-social" onClick={() => socialLogin('LinkedIn')}>💼 LinkedIn</button>
            </div>
            <div className="form-footer">
              Already have an account? <a href="#" onClick={() => setActiveModal('signinModal')}>Sign in</a>
            </div>
          </div>
        </div>
      )}

      {/* Job Application Modal */}
      {activeModal === 'applicationModal' && (
        <div className="modal active">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('applicationModal')}>&times;</button>
            <div className="modal-header">
              <h2>Apply for <span id="applyJobTitle"></span></h2>
              <p>at <span id="applyCompanyName"></span></p>
            </div>
            <form onSubmit={handleJobApplication}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" required placeholder="John" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" required placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" required placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" required placeholder="+1 (555) 000-0000" />
              </div>
              <div className="form-group">
                <label>Resume/CV *</label>
                <input type="file" accept=".pdf,.doc,.docx" required />
              </div>
              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea placeholder="Tell us why you're a great fit for this position..."></textarea>
              </div>
              <div className="form-group">
                <label>LinkedIn Profile</label>
                <input type="url" placeholder="https://linkedin.com/in/yourprofile" />
              </div>
              <div className="form-group">
                <label>Portfolio/Website</label>
                <input type="url" placeholder="https://yourportfolio.com" />
              </div>
              <button type="submit" className="btn-submit">Submit Application</button>
            </form>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      {activeModal === 'postJobModal' && (
        <div className="modal active">
          <div className="modal-content">
            <button className="modal-close" onClick={() => closeModal('postJobModal')}>&times;</button>
            <div className="modal-header">
              <h2>Post a New Job</h2>
              <p>Find your next great hire on AksharJobs</p>
            </div>
            <form onSubmit={handlePostJob}>
              <div className="form-group">
                <label>Job Title *</label>
                <input type="text" required placeholder="e.g., Senior Software Engineer" />
              </div>
              <div className="form-group">
                <label>Company Name *</label>
                <input type="text" required placeholder="Your Company" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input type="text" required placeholder="City, State" />
                </div>
                <div className="form-group">
                  <label>Job Type *</label>
                  <select required>
                    <option value="">Select type</option>
                    <option value="fulltime">Full-time</option>
                    <option value="parttime">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Salary Range *</label>
                  <input type="text" required placeholder="e.g., $80K - $120K" />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select required>
                    <option value="">Select category</option>
                    <option value="tech">Technology & IT</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance & Accounting</option>
                    <option value="design">Design & Creative</option>
                    <option value="marketing">Marketing & Sales</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Job Description *</label>
                <textarea required placeholder="Describe the role, responsibilities, and requirements..." rows="6"></textarea>
              </div>
              <div className="form-group">
                <label>Application Deadline</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Company Email *</label>
                <input type="email" required placeholder="hr@company.com" />
              </div>
              <button type="submit" className="btn-submit">Post Job - $99</button>
            </form>
            <div className="form-footer">
              <small>By posting, you agree to our posting guidelines and terms</small>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {activeModal === 'jobDetailModal' && (
        <div className="modal active">
          <div className="modal-content job-detail-content">
            <button className="modal-close" onClick={() => closeModal('jobDetailModal')}>&times;</button>
            <div id="jobDetailContent">
              {/* Job details will be displayed here */}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type} active`}>
          <span className="toast-message">{toast.message}</span>
          <button onClick={closeToast} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
