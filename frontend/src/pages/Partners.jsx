import React from 'react';
import '../styles/StaticPages.css';

const Partners = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Our Partners</h1>
        
        <div className="page-section">
          <h2>Building Success Together</h2>
          <p>
            AksharJobs partners with leading companies, educational institutions, and technology providers 
            to create the most comprehensive job matching ecosystem. Our partnerships enable us to deliver 
            exceptional value to both job seekers and employers.
          </p>
        </div>

        <div className="page-section">
          <h2>Technology Partners</h2>
          <div className="partners-grid">
            <div className="partner-card">
              <h3>AI & Machine Learning</h3>
              <p>Advanced algorithms for intelligent job matching and candidate screening.</p>
            </div>
            
            <div className="partner-card">
              <h3>Cloud Infrastructure</h3>
              <p>Scalable and secure cloud solutions for reliable platform performance.</p>
            </div>
            
            <div className="partner-card">
              <h3>Data Analytics</h3>
              <p>Comprehensive analytics tools for insights and performance optimization.</p>
            </div>
          </div>
        </div>

        <div className="page-section">
          <h2>Educational Partners</h2>
          <p>
            We collaborate with universities and educational institutions to help students 
            and recent graduates transition smoothly into their professional careers.
          </p>
        </div>

        <div className="page-section">
          <h2>Become a Partner</h2>
          <p>
            Interested in partnering with AksharJobs? We're always looking for strategic partnerships 
            that can benefit our users and advance our mission.
          </p>
          <div className="contact-info">
            <p><strong>Partnership Inquiries:</strong> partners@aksharjobs.com</p>
            <p><strong>Business Development:</strong> +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="page-section">
          <h2>Partnership Benefits</h2>
          <ul className="benefits-list">
            <li>🤝 Access to our growing network of job seekers and employers</li>
            <li>📊 Shared insights and market intelligence</li>
            <li>🚀 Co-marketing and promotional opportunities</li>
            <li>💡 Collaborative innovation and product development</li>
            <li>🌟 Enhanced service offerings for mutual customers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Partners;
