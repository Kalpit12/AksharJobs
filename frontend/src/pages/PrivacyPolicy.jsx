import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase, faGavel, faEnvelope, faUsers, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../styles/LegalPages.css';

const PrivacyPolicy = () => {
  return (
    <div className="legal_page_wrapper">
      <div className="back-button-container">
        <Link to="/signup" className="back-to-signup-button">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Signup
        </Link>
      </div>
      
      <section className="legal_hero">
        <div className="legal_container">
          <h1 className="legal_title">
            <FontAwesomeIcon icon={faShieldAlt} />
            Privacy Policy
          </h1>
          <p className="legal_subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="last_updated">Last updated: January 1, 2024</p>
        </div>
      </section>

      <section className="legal_content">
        <div className="legal_container">
          <div className="content_grid">
            <div className="table_of_contents">
              <h3>Table of Contents</h3>
              <ul>
                <li><a href="#information-collection">Information We Collect</a></li>
                <li><a href="#information-use">How We Use Information</a></li>
                <li><a href="#information-sharing">Information Sharing</a></li>
                <li><a href="#data-security">Data Security</a></li>
                <li><a href="#your-rights">Your Rights</a></li>
                <li><a href="#cookies">Cookies and Tracking</a></li>
                <li><a href="#contact-info">Contact Information</a></li>
              </ul>
            </div>

            <div className="legal_text">
              <section id="information-collection">
                <h2><FontAwesomeIcon icon={faDatabase} /> Information We Collect</h2>
                <p>We collect information you provide directly to us, such as when you:</p>
                <ul>
                  <li>Create an account or profile</li>
                  <li>Upload your resume or CV</li>
                  <li>Apply for jobs through our platform</li>
                  <li>Contact us for support</li>
                  <li>Subscribe to our newsletter</li>
                </ul>
                <p>This may include your name, email address, phone number, work experience, education, skills, and other professional information.</p>
              </section>

              <section id="information-use">
                <h2><FontAwesomeIcon icon={faUserShield} /> How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and improve our services</li>
                  <li>Match you with relevant job opportunities</li>
                  <li>Communicate with you about our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section id="information-sharing">
                <h2><FontAwesomeIcon icon={faUsers} /> Information Sharing</h2>
                <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul>
                  <li><strong>With potential employers:</strong> When you apply for jobs, we share relevant profile information with employers</li>
                  <li><strong>Service providers:</strong> With trusted third-party services that help us operate our platform</li>
                  <li><strong>Legal compliance:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </section>

              <section id="data-security">
                <h2><FontAwesomeIcon icon={faLock} /> Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information:</p>
                <ul>
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure servers with regular security updates</li>
                  <li>Access controls and authentication systems</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Data backup and recovery procedures</li>
                </ul>
              </section>

              <section id="your-rights">
                <h2><FontAwesomeIcon icon={faGavel} /> Your Rights</h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong>Objection:</strong> Object to certain uses of your information</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent for data processing</li>
                </ul>
              </section>

              <section id="cookies">
                <h2><FontAwesomeIcon icon={faDatabase} /> Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to:</p>
                <ul>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Ensure platform security and prevent fraud</li>
                </ul>
                <p>You can control cookie settings through your browser preferences.</p>
              </section>

              <section id="contact-info">
                <h2><FontAwesomeIcon icon={faEnvelope} /> Contact Information</h2>
                <p>If you have questions about this Privacy Policy, please contact us:</p>
                <div className="contact_details">
                  <p><strong>Email:</strong> privacy@aksharjobs.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Innovation Drive, Tech City, Nairobi, Kenya</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;