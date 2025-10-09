import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase } from '@fortawesome/free-solid-svg-icons';
import '../styles/StaticPages.css';

const Security = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Security & Data Protection</h1>
        
        <div className="page-section">
          <h2>Your Security is Our Priority</h2>
          <p>
            At AksharJobs, we take the security and privacy of your personal information seriously. 
            We implement industry-leading security measures to protect your data and ensure a safe 
            experience on our platform.
          </p>
        </div>

        <div className="security-features">
          <div className="security-card">
            <FontAwesomeIcon icon={faShieldAlt} className="security-icon" />
            <h3>Data Encryption</h3>
            <p>All data transmitted between your device and our servers is encrypted using SSL/TLS encryption.</p>
          </div>
          
          <div className="security-card">
            <FontAwesomeIcon icon={faLock} className="security-icon" />
            <h3>Secure Authentication</h3>
            <p>Multi-factor authentication and secure password requirements protect your account.</p>
          </div>
          
          <div className="security-card">
            <FontAwesomeIcon icon={faUserShield} className="security-icon" />
            <h3>Privacy Controls</h3>
            <p>Comprehensive privacy settings give you control over who can see your information.</p>
          </div>
          
          <div className="security-card">
            <FontAwesomeIcon icon={faDatabase} className="security-icon" />
            <h3>Secure Storage</h3>
            <p>Your data is stored in secure, encrypted databases with regular backups.</p>
          </div>
        </div>

        <div className="page-section">
          <h2>Security Measures</h2>
          <ul className="security-measures">
            <li><strong>256-bit SSL Encryption:</strong> All data in transit is protected with bank-level encryption</li>
            <li><strong>Regular Security Audits:</strong> Third-party security experts regularly test our systems</li>
            <li><strong>Access Controls:</strong> Strict employee access controls and monitoring</li>
            <li><strong>Incident Response:</strong> 24/7 monitoring and rapid response to security threats</li>
            <li><strong>Data Minimization:</strong> We only collect data necessary for our services</li>
            <li><strong>Secure Infrastructure:</strong> Cloud infrastructure with enterprise-grade security</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Your Role in Security</h2>
          <p>Help us keep your account secure by following these best practices:</p>
          <ul className="user-security-tips">
            <li>Use a strong, unique password for your AksharJobs account</li>
            <li>Enable two-factor authentication when available</li>
            <li>Keep your contact information up to date</li>
            <li>Log out of your account when using shared computers</li>
            <li>Report suspicious activity immediately</li>
            <li>Be cautious of phishing emails claiming to be from AksharJobs</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Compliance & Certifications</h2>
          <p>
            AksharJobs complies with major data protection regulations and industry standards:
          </p>
          <ul className="compliance-list">
            <li>General Data Protection Regulation (GDPR)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>SOC 2 Type II Compliance</li>
            <li>ISO 27001 Security Standards</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Report Security Issues</h2>
          <p>
            If you discover a security vulnerability or have security concerns, 
            please report them immediately:
          </p>
          <div className="contact-info">
            <p><strong>Security Team:</strong> security@aksharjobs.com</p>
            <p><strong>Emergency Contact:</strong> +1 (555) 123-4567</p>
            <p><strong>Response Time:</strong> We investigate all reports within 24 hours</p>
          </div>
        </div>

        <div className="page-section">
          <h2>Security Updates</h2>
          <p>
            This security statement was last updated on December 2024. We regularly review 
            and update our security practices to address emerging threats and maintain the 
            highest level of protection for our users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Security;
