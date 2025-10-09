import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookie, faChartLine, faShieldAlt, faCog, faUsers } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/LegalPages.css';

const CookiePolicy = () => {
  return (
    <div className="legal_page_wrapper">
      <Header />
      
      <section className="legal_hero">
        <div className="legal_container">
          <h1 className="legal_title">
            <FontAwesomeIcon icon={faCookie} />
            Cookie Policy
          </h1>
          <p className="legal_subtitle">
            This Cookie Policy explains how AksharJobs uses cookies and similar technologies to recognize you when you visit our platform.
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
                <li><a href="#what-are-cookies">What Are Cookies</a></li>
                <li><a href="#types-of-cookies">Types of Cookies We Use</a></li>
                <li><a href="#why-we-use-cookies">Why We Use Cookies</a></li>
                <li><a href="#managing-cookies">Managing Cookies</a></li>
                <li><a href="#third-party-cookies">Third-Party Cookies</a></li>
                <li><a href="#contact-info">Contact Information</a></li>
              </ul>
            </div>

            <div className="legal_text">
              <section id="what-are-cookies">
                <h2><FontAwesomeIcon icon={faCookie} /> What Are Cookies</h2>
                <p>Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
              </section>

              <section id="types-of-cookies">
                <h2><FontAwesomeIcon icon={faCog} /> Types of Cookies We Use</h2>
                
                <h3>Essential Cookies</h3>
                <p>These cookies are necessary for the platform to function properly. They enable core functionality such as:</p>
                <ul>
                  <li>User authentication and security</li>
                  <li>Shopping cart functionality</li>
                  <li>Form submission and data persistence</li>
                  <li>Load balancing and performance optimization</li>
                </ul>

                <h3>Performance Cookies</h3>
                <p>These cookies help us understand how visitors interact with our platform by collecting anonymous information:</p>
                <ul>
                  <li>Page views and user journeys</li>
                  <li>Time spent on different pages</li>
                  <li>Error messages and technical issues</li>
                  <li>Browser and device information</li>
                </ul>

                <h3>Functional Cookies</h3>
                <p>These cookies enable enhanced functionality and personalization:</p>
                <ul>
                  <li>Language and region preferences</li>
                  <li>Customized content and recommendations</li>
                  <li>Social media integration</li>
                  <li>Live chat and support features</li>
                </ul>

                <h3>Marketing Cookies</h3>
                <p>These cookies are used to deliver relevant advertisements and track campaign effectiveness:</p>
                <ul>
                  <li>Targeted advertising based on interests</li>
                  <li>Conversion tracking and analytics</li>
                  <li>Social media advertising</li>
                  <li>Email marketing optimization</li>
                </ul>
              </section>

              <section id="why-we-use-cookies">
                <h2><FontAwesomeIcon icon={faChartLine} /> Why We Use Cookies</h2>
                <p>We use cookies to:</p>
                <ul>
                  <li><strong>Improve User Experience:</strong> Remember your preferences and provide personalized content</li>
                  <li><strong>Analyze Performance:</strong> Understand how our platform is used and identify areas for improvement</li>
                  <li><strong>Ensure Security:</strong> Protect against fraud and unauthorized access</li>
                  <li><strong>Provide Support:</strong> Enable customer support features and troubleshooting</li>
                  <li><strong>Marketing:</strong> Show relevant job opportunities and platform features</li>
                </ul>
              </section>

              <section id="managing-cookies">
                <h2><FontAwesomeIcon icon={faCog} /> Managing Cookies</h2>
                <p>You can control and manage cookies in several ways:</p>
                
                <h3>Browser Settings</h3>
                <p>Most browsers allow you to:</p>
                <ul>
                  <li>View and delete cookies</li>
                  <li>Block cookies from specific websites</li>
                  <li>Block all cookies</li>
                  <li>Get notified when cookies are set</li>
                </ul>

                <h3>Platform Settings</h3>
                <p>You can manage cookie preferences through your account settings:</p>
                <ul>
                  <li>Analytics and performance tracking</li>
                  <li>Marketing and advertising cookies</li>
                  <li>Social media integration</li>
                  <li>Personalization features</li>
                </ul>

                <p><strong>Note:</strong> Disabling certain cookies may limit platform functionality and your user experience.</p>
              </section>

              <section id="third-party-cookies">
                <h2><FontAwesomeIcon icon={faUsers} /> Third-Party Cookies</h2>
                <p>We work with trusted third-party services that may set cookies on our platform:</p>
                <ul>
                  <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior insights</li>
                  <li><strong>Social Media Platforms:</strong> LinkedIn, Facebook, Twitter integration</li>
                  <li><strong>Payment Processors:</strong> Secure payment processing and fraud prevention</li>
                  <li><strong>Customer Support:</strong> Live chat and help desk functionality</li>
                  <li><strong>Content Delivery:</strong> Faster loading times and improved performance</li>
                </ul>
              </section>

              <div className="contact_section">
                <h2>Questions About Cookies?</h2>
                <p>If you have any questions about our use of cookies, please contact us:</p>
                <div className="contact_info">
                  <p><strong>Email:</strong> privacy@aksharjobs.com</p>
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

export default CookiePolicy;
