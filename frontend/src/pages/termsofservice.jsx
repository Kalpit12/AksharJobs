import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGavel, faUserCheck, faExclamationTriangle, faHandshake, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LegalPages.css';

const TermsOfService = () => {
  return (
    <div className="legal_page_wrapper">
      <Header />
      
      <section className="legal_hero">
        <div className="legal_container">
          <h1 className="legal_title">
            <FontAwesomeIcon icon={faGavel} />
            Terms of Service
          </h1>
          <p className="legal_subtitle">
            Please read these terms carefully before using AksharJobs. By accessing our platform, you agree to be bound by these terms.
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
                <li><a href="#acceptance">Acceptance of Terms</a></li>
                <li><a href="#eligibility">Eligibility</a></li>
                <li><a href="#user-accounts">User Accounts</a></li>
                <li><a href="#platform-use">Platform Use</a></li>
                <li><a href="#prohibited-conduct">Prohibited Conduct</a></li>
                <li><a href="#intellectual-property">Intellectual Property</a></li>
                <li><a href="#limitation-liability">Limitation of Liability</a></li>
                <li><a href="#termination">Termination</a></li>
              </ul>
            </div>

            <div className="legal_text">
              <section id="acceptance">
                <h2><FontAwesomeIcon icon={faHandshake} /> Acceptance of Terms</h2>
                <p>By accessing and using AksharJobs, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
              </section>

              <section id="eligibility">
                <h2><FontAwesomeIcon icon={faUserCheck} /> Eligibility</h2>
                <p>You must be at least 18 years old to use AksharJobs. By using our platform, you represent and warrant that:</p>
                <ul>
                  <li>You are at least 18 years of age</li>
                  <li>You have the legal capacity to enter into this agreement</li>
                  <li>Your use of the platform will not violate any applicable law or regulation</li>
                  <li>All information you provide is accurate and truthful</li>
                </ul>
              </section>

              <section id="user-accounts">
                <h2><FontAwesomeIcon icon={faUserCheck} /> User Accounts</h2>
                <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:</p>
                <ul>
                  <li>Safeguarding your account password and login credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Maintaining accurate and up-to-date account information</li>
                </ul>
              </section>

              <section id="platform-use">
                <h2><FontAwesomeIcon icon={faShieldAlt} /> Platform Use</h2>
                <p>AksharJobs grants you a limited, non-exclusive, non-transferable license to use our platform for its intended purpose. You agree to:</p>
                <ul>
                  <li>Use the platform only for lawful purposes</li>
                  <li>Not interfere with or disrupt the platform's operation</li>
                  <li>Not attempt to gain unauthorized access to our systems</li>
                  <li>Respect the intellectual property rights of others</li>
                  <li>Provide accurate information in job applications and profiles</li>
                </ul>
              </section>

              <section id="prohibited-conduct">
                <h2><FontAwesomeIcon icon={faExclamationTriangle} /> Prohibited Conduct</h2>
                <p>You may not use AksharJobs to:</p>
                <ul>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Spam or send unsolicited communications</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Attempt to reverse engineer our platform</li>
                  <li>Use automated systems to access our services</li>
                </ul>
              </section>

              <section id="intellectual-property">
                <h2><FontAwesomeIcon icon={faShieldAlt} /> Intellectual Property</h2>
                <p>The AksharJobs platform and its original content, features, and functionality are and will remain the exclusive property of AksharJobs and its licensors. The platform is protected by copyright, trademark, and other laws.</p>
                <p>You retain ownership of content you submit to our platform, but grant us a license to use, display, and distribute such content as necessary to provide our services.</p>
              </section>

              <section id="limitation-liability">
                <h2><FontAwesomeIcon icon={faExclamationTriangle} /> Limitation of Liability</h2>
                <p>In no event shall AksharJobs, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the platform.</p>
              </section>

              <section id="termination">
                <h2><FontAwesomeIcon icon={faGavel} /> Termination</h2>
                <p>We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.</p>
                <p>You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.</p>
              </section>

              <div className="contact_section">
                <h2>Questions About These Terms?</h2>
                <p>If you have any questions about these Terms of Service, please contact us:</p>
                <div className="contact_info">
                  <p><strong>Email:</strong> legal@aksharjobs.com</p>
                  <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  <p><strong>Address:</strong> 123 Innovation Drive, Tech City, Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfService;