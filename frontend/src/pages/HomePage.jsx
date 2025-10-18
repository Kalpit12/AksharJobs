import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImage from '../assets/FINAL LOGO AK.png';
import '../styles/HomePage.css';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

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
          <h1>Find Your Dream Job With AksharJobs</h1>
          <p>CONNECT | DISCOVER | ELEVATE - Connect with thousands of employers and discover opportunities that match your skills and aspirations</p>
        </div>
        
        <div className="search-container">
          <form onSubmit={handleSearch}>
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
              <button type="submit" className="btn btn-search">
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

          <div className="job-card">
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">TC</div>
                <div className="job-info">
                  <h3 className="job-title">Senior Software Engineer</h3>
                  <p className="company-name">TechCorp Solutions</p>
                </div>
              </div>
            </div>
            <div className="job-meta">
              <span>📍 San Francisco, CA</span>
              <span>💼 Full-time</span>
              <span>💰 $120K - $180K</span>
              <span>⏰ Posted 2 days ago</span>
            </div>
            <div className="job-tags">
              <span className="tag">React</span>
              <span className="tag">Node.js</span>
              <span className="tag">AWS</span>
              <span className="tag">Remote Available</span>
            </div>
          </div>

          <div className="job-card">
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">DI</div>
                <div className="job-info">
                  <h3 className="job-title">Product Designer</h3>
                  <p className="company-name">Design Innovations Inc.</p>
                </div>
              </div>
            </div>
            <div className="job-meta">
              <span>📍 New York, NY</span>
              <span>💼 Full-time</span>
              <span>💰 $90K - $130K</span>
              <span>⏰ Posted 1 week ago</span>
            </div>
            <div className="job-tags">
              <span className="tag">Figma</span>
              <span className="tag">UI/UX</span>
              <span className="tag">Prototyping</span>
              <span className="tag">Hybrid</span>
            </div>
          </div>

          <div className="job-card">
            <div className="job-header">
              <div style={{ display: 'flex', flex: 1 }}>
                <div className="company-logo">FM</div>
                <div className="job-info">
                  <h3 className="job-title">Marketing Manager</h3>
                  <p className="company-name">FutureMark Agency</p>
                </div>
              </div>
            </div>
            <div className="job-meta">
              <span>📍 Austin, TX</span>
              <span>💼 Full-time</span>
              <span>💰 $80K - $110K</span>
              <span>⏰ Posted 3 days ago</span>
            </div>
            <div className="job-tags">
              <span className="tag">Digital Marketing</span>
              <span className="tag">SEO</span>
              <span className="tag">Content Strategy</span>
              <span className="tag">Remote Option</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/jobs" className="btn btn-primary btn-large">
              View All Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="cta-section" 
        style={{
          background: 'linear-gradient(135deg, #4FC3F7 0%, #66BB6A 50%, #FFB74D 100%) !important',
          color: 'white !important',
          padding: '4rem 2rem !important',
          textAlign: 'center !important'
        }}
      >
        <div className="cta-content">
          <h2 style={{ color: 'white !important', fontSize: '2.5rem !important', marginBottom: '1rem !important' }}>
            Ready to Take the Next Step?
          </h2>
          <p style={{ color: 'white !important', fontSize: '1.2rem !important' }}>
            Join thousands of professionals who found their perfect job through AksharJobs. Create your profile today and get discovered by top employers.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              to="/signup"
              className="btn btn-primary btn-large" 
              style={{
                background: '#4285F4 !important',
                color: 'white !important',
                border: 'none !important',
                textDecoration: 'none !important'
              }}
            >
              GET STARTED
            </Link>
            <Link 
              to="/post-job"
              className="btn btn-secondary btn-large" 
              style={{
                background: 'transparent !important',
                color: 'white !important',
                border: '2px solid white !important',
                textDecoration: 'none !important'
              }}
            >
              Post a Job Opening
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