import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeHeader.css';

const HomeHeader = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`home-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="home-header-container">
        {/* Logo Section - Left Side */}
        <div className="home-header-left">
          <div className="home-logo-container" onClick={() => navigate('/')}>
            <div className="home-logo-svg">
              <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            </div>
            <div className="home-logo-text">
              <h1 className="home-logo">AksharJobs</h1>
              <p className="home-tagline">Where Opportunity Meets Talent</p>
            </div>
          </div>
        </div>

        {/* Navigation Section - Center */}
        <nav className="home-nav">
          <div className="nav-item">
            <button 
              className="nav-link"
              onClick={() => navigate('/about')}
            >
              About Us
            </button>
          </div>
          <div className="nav-item">
            <button 
              className="nav-link"
              onClick={() => navigate('/pricing')}
            >
              Pricing Plans
            </button>
          </div>
          <div className="nav-item">
            <button 
              className="nav-link"
              onClick={() => navigate('/contact')}
            >
              Contact
            </button>
          </div>
          <div className="nav-item">
            <button 
              className="nav-link"
              onClick={() => navigate('/jobs')}
            >
              Browse Jobs
            </button>
          </div>
        </nav>

        {/* Auth Section - Right Side */}
        <div className="home-header-right">
          <div className="home-auth-buttons">
            <button 
              className="home-login-btn"
              onClick={() => navigate('/login')}
            >
              <span className="btn-icon">🔐</span>
              Sign In
            </button>
            <button 
              className="home-signup-btn"
              onClick={() => navigate('/signup')}
            >
              <span className="btn-icon">🚀</span>
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          <button 
            className="mobile-nav-link"
            onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
          >
            About Us
          </button>
          <button 
            className="mobile-nav-link"
            onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }}
          >
            Pricing Plans
          </button>
          <button 
            className="mobile-nav-link"
            onClick={() => { navigate('/contact'); setIsMobileMenuOpen(false); }}
          >
            Contact
          </button>
          <button 
            className="mobile-nav-link"
            onClick={() => { navigate('/jobs'); setIsMobileMenuOpen(false); }}
          >
            Browse Jobs
          </button>
          <div className="mobile-auth-buttons">
            <button 
              className="mobile-login-btn"
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
            >
              Sign In
            </button>
            <button 
              className="mobile-signup-btn"
              onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
