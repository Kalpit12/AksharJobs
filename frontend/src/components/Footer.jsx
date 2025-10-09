import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faGlobe,
  faHeart
} from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faTwitter, faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/AK_logo.jpg" alt="AksharJobs Logo" />
            <div className="footer-logo-text">AksharJobs</div>
          </div>
          <p className="footer-tagline">
            Connecting top talent with amazing opportunities through AI-powered job matching. 
            Your career journey starts here.
          </p>
        </div>

        {/* Footer Content Grid */}
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/partners">Partners</Link></li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="footer-section">
            <h3>Job Seekers</h3>
            <ul>
              <li><Link to="/jobs">Browse Jobs</Link></li>
              <li><Link to="/modern-upload">Upload Resume</Link></li>
              <li><Link to="/profile">Create Profile</Link></li>
              <li><Link to="/salary-guide">Salary Guide</Link></li>
              <li><Link to="/career-advice">Career Advice</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="footer-section">
            <h3>Employers</h3>
            <ul>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/recruitment-solutions">Recruitment Solutions</Link></li>
              <li><Link to="/resources">Resources</Link></li>
              <li><Link to="/contact-sales">Contact Sales</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-section">
            <h3>Support & Legal</h3>
            <ul>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie-policy">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="footer-section">
            <h3>Contact</h3>
            <div className="footer-contact">
              <div className="contact-item">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
                <span>123 Innovation Drive, Tech City, TC 12345</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faPhone} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faEnvelope} />
                <span>hello@aksharjobs.com</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faGlobe} />
                <span>www.aksharjobs.com</span>
              </div>
            </div>
            
            {/* Social Media Links */}
            <div className="footer-social">
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="footer-newsletter">
          <h3 className="newsletter-title">Stay Updated</h3>
          <p className="newsletter-description">
            Get the latest job opportunities, career tips, and industry insights delivered to your inbox.
          </p>
          <form className="newsletter-form">
            <input
              type="email"
              className="newsletter-input"
              placeholder="Enter your email address"
              required
            />
            <button type="submit" className="newsletter-button">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © {currentYear} AksharJobs. All rights reserved. Made with <FontAwesomeIcon icon={faHeart} className="heart-icon" /> for job seekers and employers.
            </div>
            <div className="footer-links">
              <Link to="/sitemap" className="footer-bottom-link">Sitemap</Link>
              <Link to="/accessibility" className="footer-bottom-link">Accessibility</Link>
              <Link to="/security" className="footer-bottom-link">Security</Link>
              <Link to="/status" className="footer-bottom-link">Status</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
