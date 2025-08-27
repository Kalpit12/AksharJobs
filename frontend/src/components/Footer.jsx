import React from 'react';
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
            <img src="/RocketJobs_Logo.jpg" alt="RocketJobs Logo" />
            <div className="footer-logo-text">RocketJobs</div>
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
              <li><a href="/about">About Us</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/partners">Partners</a></li>
            </ul>
          </div>

          {/* For Job Seekers */}
          <div className="footer-section">
            <h3>Job Seekers</h3>
            <ul>
              <li><a href="/allJobs">Browse Jobs</a></li>
              <li><a href="/upload">Upload Resume</a></li>
              <li><a href="/profile">Create Profile</a></li>
              <li><a href="/salary-guide">Salary Guide</a></li>
              <li><a href="/career-advice">Career Advice</a></li>
            </ul>
          </div>

          {/* For Employers */}
          <div className="footer-section">
            <h3>Employers</h3>
            <ul>
              <li><a href="/post-job">Post a Job</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/recruitment-solutions">Recruitment Solutions</a></li>
              <li><a href="/employer-resources">Resources</a></li>
              <li><a href="/contact">Contact Sales</a></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="footer-section">
            <h3>Support & Legal</h3>
            <ul>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
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
                <span>hello@rocketjobs.com</span>
              </div>
              <div className="contact-item">
                <FontAwesomeIcon icon={faGlobe} />
                <span>www.rocketjobs.com</span>
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
              © {currentYear} RocketJobs. All rights reserved. Made with <FontAwesomeIcon icon={faHeart} className="heart-icon" /> for job seekers and employers.
            </div>
            <div className="footer-links">
              <a href="/sitemap" className="footer-bottom-link">Sitemap</a>
              <a href="/accessibility" className="footer-bottom-link">Accessibility</a>
              <a href="/security" className="footer-bottom-link">Security</a>
              <a href="/status" className="footer-bottom-link">Status</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
