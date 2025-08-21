import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const [fontAwesomeLoaded, setFontAwesomeLoaded] = useState(false);

  useEffect(() => {
    // Check if Font Awesome is loaded
    const checkFontAwesome = () => {
      console.log('Checking if Font Awesome is loaded...');
      
      const testIcon = document.createElement('i');
      testIcon.className = 'fab fa-instagram';
      document.body.appendChild(testIcon);
      
      const computedStyle = window.getComputedStyle(testIcon, '::before');
      const content = computedStyle.content;
      
      console.log('Font Awesome content:', content);
      
      document.body.removeChild(testIcon);
      
      // If Font Awesome is loaded, content will be a string, not 'none'
      if (content && content !== 'none') {
        console.log('Font Awesome is loaded!');
        setFontAwesomeLoaded(true);
      } else {
        console.log('Font Awesome failed to load, showing fallback text');
      }
    };

    // Check after a short delay to ensure Font Awesome has time to load
    const timer = setTimeout(checkFontAwesome, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer className="footer">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#667eea"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#667eea"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#667eea"></path>
        </svg>
      </div>
      
      <div className="footer-content">
        <div className="footer-main">
          {/* Company Info Section */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <div className="footer-logo-svg">
                <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="50" height="50" rx="8" fill="url(#footerGradient)"/>
                  <path d="M25 10L30 20L25 30L20 20L25 10Z" fill="white"/>
                  <path d="M25 30L25 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="25" cy="35" r="2" fill="white"/>
                  <defs>
                    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFD700"/>
                      <stop offset="100%" stopColor="#FFA500"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="footer-brand">
                <h3 className="footer-title">RocketJobs</h3>
                <p className="footer-subtitle">Where Opportunity Meets Talent</p>
              </div>
            </div>
            <p className="footer-description">
              Connecting exceptional talent with outstanding opportunities through intelligent AI-powered matching. 
              Transform your career or find the perfect candidate for your organization.
            </p>
            <div className="footer-contact">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <span>support@rocketjobs.ai</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🌐</span>
                <span>www.rocketjobs.ai</span>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-section quick-links">
            <h4 className="footer-heading">Quick Links</h4>
            <div className="footer-links-grid">
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/jobs" className="footer-link">Browse Jobs</Link>
              <Link to="/pricing" className="footer-link">Pricing Plans</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms of Service</Link>
            </div>
          </div>

          {/* Services Section */}
          <div className="footer-section services">
            <h4 className="footer-heading">Our Services</h4>
            <div className="footer-links-grid">
              <span className="footer-link">AI Job Matching</span>
              <span className="footer-link">Resume Analysis</span>
              <span className="footer-link">Skill Assessment</span>
              <span className="footer-link">Career Guidance</span>
              <span className="footer-link">Recruiter Tools</span>
              <span className="footer-link">Analytics Dashboard</span>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="footer-section social-media">
            <h4 className="footer-heading">Connect With Us</h4>
            <p className="social-description">
              Follow us for the latest job opportunities, career tips, and industry insights.
            </p>
            <div className="social-icons">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={`social-icon ${fontAwesomeLoaded ? 'fa-loaded' : ''}`}>
                <i className="fab fa-instagram"></i>
                <span className="icon-fallback">IG</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`social-icon ${fontAwesomeLoaded ? 'fa-loaded' : ''}`}>
                <i className="fab fa-linkedin"></i>
                <span className="icon-fallback">LI</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={`social-icon ${fontAwesomeLoaded ? 'fa-loaded' : ''}`}>
                <i className="fab fa-twitter"></i>
                <span className="icon-fallback">TW</span>
              </a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className={`social-icon ${fontAwesomeLoaded ? 'fa-loaded' : ''}`}>
                <i className="fab fa-whatsapp"></i>
                <span className="icon-fallback">WA</span>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={`social-icon ${fontAwesomeLoaded ? 'fa-loaded' : ''}`}>
                <i className="fab fa-facebook"></i>
                <span className="icon-fallback">FB</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">© 2025 RocketJobs. All rights reserved.</p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="bottom-link">Privacy</Link>
              <Link to="/terms" className="bottom-link">Terms</Link>
              <Link to="/cookies" className="bottom-link">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
