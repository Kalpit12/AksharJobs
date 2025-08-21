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
              <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="50" height="50" rx="8" fill="url(#gradient)"/>
                <path d="M25 10L30 20L25 30L20 20L25 10Z" fill="white"/>
                <path d="M25 30L25 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="25" cy="35" r="2" fill="white"/>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700"/>
                    <stop offset="100%" stopColor="#FFA500"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="home-logo-text">
              <h1 className="home-logo">RocketJobs</h1>
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
