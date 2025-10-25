import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import axios from 'axios';
import logoImage from '../assets/FINAL LOGO AK.png';
import JobCard from '../components/JobCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Testimonials data moved from login/signup pages
  const testimonials = [
    {
      id: 1,
      quote: "AksharJobs helped me find my dream job in just 2 weeks. The platform is intuitive and the opportunities are amazing!",
      author: "Sarah Johnson",
      role: "Software Engineer at TechCorp"
    },
    {
      id: 2,
      quote: "The job matching algorithm is incredible. I got matched with 5 perfect opportunities within a week of signing up.",
      author: "Michael Chen",
      role: "Product Manager at InnovateLab"
    },
    {
      id: 3,
      quote: "As a recruiter, AksharJobs has given me access to top-tier talent. The quality of candidates is outstanding.",
      author: "Emily Rodriguez",
      role: "HR Director at GlobalTech"
    },
    {
      id: 4,
      quote: "The career resources and interview prep tools helped me land my current role. Highly recommend to anyone job hunting!",
      author: "David Kim",
      role: "Data Scientist at DataFlow"
    },
    {
      id: 5,
      quote: "The community features and networking opportunities are fantastic. I've made valuable professional connections here.",
      author: "Lisa Thompson",
      role: "Marketing Specialist at BrandCo"
    }
  ];

  // Toast management
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Form handlers
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`🔍 Searching for "${searchQuery}" in ${searchLocation || 'all locations'}...`, 'success');
      navigate('/jobs', { state: { query: searchQuery, location: searchLocation } });
    }
  };

  const handleCategoryClick = (category) => {
    showToast(`🔍 Searching for ${category} jobs...`, 'success');
    navigate('/jobs', { state: { category } });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Fetch featured jobs
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        setLoadingJobs(true);
        const response = await axios.get(buildApiUrl('/api/jobs/get_jobs'));
        
        console.log('📊 Jobs API Response:', response.data);
        
        // The API returns an array directly, not wrapped in an object
        const jobsArray = Array.isArray(response.data) ? response.data : (response.data.jobs || []);
        
        if (jobsArray && jobsArray.length > 0) {
          // Get the latest 6 jobs (or less if not enough)
          const latestJobs = jobsArray
            .filter(job => job && job.status === 'active')
            .sort((a, b) => {
              const dateA = new Date(a.postedAt || a.created_at || a.posted_date || 0);
              const dateB = new Date(b.postedAt || b.created_at || b.posted_date || 0);
              return dateB - dateA;
            })
            .slice(0, 6);
          
          console.log('✅ Featured Jobs:', latestJobs);
          setFeaturedJobs(latestJobs);
        } else {
          console.log('⚠️ No jobs found in response');
          setFeaturedJobs([]);
        }
      } catch (error) {
        console.error('❌ Error fetching featured jobs:', error);
        if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('Request error: No response received');
        } else {
          console.error('Error message:', error.message);
        }
        setFeaturedJobs([]);
        showToast('⚠️ Could not load featured jobs. Please try again later.', 'error');
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchFeaturedJobs();
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="homepage">
      {/* Header */}
      <header>
        <div className="nav-container">
          <div className="logo">
            <img src={logoImage} alt="AksharJobs Logo" className="logo-image" />
            <div className="logo-text">
              <span className="logo-name">AksharJobs</span>
              <span className="logo-tagline">CONNECT | DISCOVER | ELEVATE</span>
            </div>
          </div>
          <nav>
            <ul>
              <li><a href="#jobs">Find Jobs</a></li>
              <li><Link to="/companies">Companies</Link></li>
              <li><a href="#categories">Categories</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </nav>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-secondary">
              SIGN IN
            </Link>
            <Link to="/signup" className="btn btn-primary">
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job With <span style={{ color: 'white' }}>AksharJobs</span></h1>
          <p>CONNECT | DISCOVER | ELEVATE - Connect with thousands of employers and discover opportunities that match your skills and aspirations</p>
        </div>
        
        <div className="hero-search-container">
          <form onSubmit={handleSearch} className="hero-search-form">
            <div className="hero-search-wrapper">
              <div className="search-field-group">
                <div className="search-field">
                  <input 
                    type="text" 
                    className="search-field-input" 
                    placeholder="Job title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="search-field">
                  <input 
                    type="text" 
                    className="search-field-input" 
                    placeholder="City, state"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
              <button type="submit" className="hero-search-button">
                Search Jobs
              </button>
            </div>
          </form>
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

          {loadingJobs ? (
            <div className="loading-jobs">
              <div className="spinner"></div>
              <p>Loading featured jobs...</p>
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="no-jobs">
              <p>No jobs available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="featured-jobs-grid">
              {featuredJobs.map((job, index) => {
                // Parse skills array
                let skills = [];
                if (job.required_skills || job.skills || job.requirements) {
                  const skillsData = job.required_skills || job.skills || job.requirements;
                  if (typeof skillsData === 'string') {
                    skills = skillsData.split(',').map(s => s.trim()).filter(Boolean);
                  } else if (Array.isArray(skillsData)) {
                    skills = skillsData;
                  }
                }

                // Format location
                const location = job.location || [job.city, job.state, job.country].filter(Boolean).join(', ') || 'Remote';

                // Format salary
                let salaryRange = 'Competitive';
                if (job.salary_range && job.salary_range.min && job.salary_range.max) {
                  const currency = job.salary_range.currency || 'USD';
                  salaryRange = `${currency} ${job.salary_range.min} - ${job.salary_range.max}`;
                } else if (job.salary_min && job.salary_max) {
                  const currency = job.salary_currency || 'USD';
                  const period = job.salary_period || 'yearly';
                  salaryRange = `${currency} ${job.salary_min}K - ${job.salary_max}K ${period}`;
                }

                // Calculate posted time
                const postedDate = new Date(job.postedAt || job.created_at || job.posted_date || Date.now());
                const now = new Date();
                const diffTime = Math.abs(now - postedDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                let postedText = 'Just posted';
                if (diffDays === 1) postedText = 'Posted yesterday';
                else if (diffDays < 7) postedText = `Posted ${diffDays} days ago`;
                else if (diffDays < 30) postedText = `Posted ${Math.floor(diffDays / 7)} weeks ago`;
                else postedText = `Posted ${Math.floor(diffDays / 30)} months ago`;

                return (
                  <div className="job-card" key={job._id || index}>
                    {index < 3 && <div className="featured-badge">Featured</div>}
                    <h3 className="job-title">{job.title || job.job_title || 'Job Title'}</h3>
                    <p className="company-name">{job.companyName || job.company_name || job.company || 'Company'}</p>
                    
                    <div className="job-details">
                      <div className="job-detail">
                        <span className="icon">📍</span>
                        <span>{location}</span>
                      </div>
                      <div className="job-detail">
                        <span className="icon">💼</span>
                        <span>{job.job_type || job.jobType || job.type || 'Full-time'}</span>
                      </div>
                      <div className="job-detail">
                        <span className="icon">🎓</span>
                        <span>{job.experience_level || job.experienceLevel || 'All Levels'}</span>
                      </div>
                      <div className="job-detail salary">
                        <span className="icon">💰</span>
                        <span>{salaryRange}</span>
                      </div>
                    </div>
                    
                    <div className="skills">
                      {skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                      {skills.length > 3 && (
                        <span className="skill-tag">+{skills.length - 3} more</span>
                      )}
                    </div>
                    
                    <div className="job-actions">
                      <button 
                        className="btn-apply"
                        onClick={() => {
                          const companyName = job.companyName || job.company_name || job.company || 'this company';
                          const jobTitle = job.title || job.job_title || 'this position';
                          showToast(`🚀 Applying to ${jobTitle} at ${companyName}...`, 'success');
                          navigate('/jobseeker-dashboard');
                        }}
                      >
                        <span>🚀</span>
                        Apply Now
                      </button>
                      <button 
                        className="btn-view"
                        onClick={() => {
                          const jobTitle = job.title || job.job_title || 'this position';
                          showToast(`👀 Viewing details for ${jobTitle}...`, 'success');
                          navigate('/jobseeker-dashboard');
                        }}
                      >
                        <span>👀</span>
                        View Details
                      </button>
                    </div>
                    
                    <div className="posted-date">
                      <span>🕒</span>
                      <span>{postedText}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/jobseeker-dashboard" className="btn btn-primary btn-large">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-subtitle">Real stories from professionals who found success with AksharJobs</p>
          
          <div className="testimonial-slider">
            <div className="testimonial-content">
              <div className="quote-icon">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <blockquote className="testimonial-quote">
                {testimonials[currentTestimonial].quote}
              </blockquote>
              <div className="testimonial-author">
                <div className="author-info">
                  <span className="author-name">{testimonials[currentTestimonial].author}</span>
                  <span className="author-role">{testimonials[currentTestimonial].role}</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-controls">
              <button 
                className="testimonial-btn prev-btn"
                onClick={prevTestimonial}
                aria-label="Previous testimonial"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              
              <div className="testimonial-dots">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                    onClick={() => setCurrentTestimonial(index)}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              
              <button 
                className="testimonial-btn next-btn"
                onClick={nextTestimonial}
                aria-label="Next testimonial"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Take the Next Step?</h2>
          <p>
            Join thousands of professionals who found their perfect job through AksharJobs. Create your profile today and get discovered by top employers.
          </p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">
              🚀 GET STARTED
            </Link>
            <Link to="/post-job" className="btn btn-secondary">
              💼 Post a Job Opening
            </Link>
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
              <li><Link to="/companies">Browse Companies</Link></li>
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

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={closeToast}>&times;</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;