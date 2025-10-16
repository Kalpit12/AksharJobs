import React from 'react';

const Accessibility = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Accessibility Statement</h1>
        
        <div className="page-section">
          <h2>Our Commitment to Accessibility</h2>
          <p>
            AksharJobs is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards to ensure we provide equal access to all users.
          </p>
        </div>

        <div className="page-section">
          <h2>Accessibility Standards</h2>
          <p>
            Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 
            Level AA standards. These guidelines help make web content more accessible to people 
            with disabilities, including:
          </p>
          <ul className="accessibility-list">
            <li>Visual impairments (blindness, low vision, color blindness)</li>
            <li>Hearing impairments (deafness, hard of hearing)</li>
            <li>Motor impairments (difficulty using a mouse, slow response time)</li>
            <li>Cognitive impairments (learning disabilities, distractibility)</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Accessibility Features</h2>
          <ul className="features-list">
            <li>✓ Keyboard navigation support</li>
            <li>✓ Screen reader compatibility</li>
            <li>✓ High contrast color schemes</li>
            <li>✓ Resizable text up to 200%</li>
            <li>✓ Alternative text for images</li>
            <li>✓ Clear heading structure</li>
            <li>✓ Focus indicators for interactive elements</li>
            <li>✓ Consistent navigation throughout the site</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Ongoing Improvements</h2>
          <p>
            We regularly review our website's accessibility and make improvements. Our development 
            team follows accessibility best practices and conducts regular audits to identify and 
            address potential barriers.
          </p>
        </div>

        <div className="page-section">
          <h2>Feedback and Support</h2>
          <p>
            We welcome feedback on the accessibility of AksharJobs. If you encounter any 
            accessibility barriers or have suggestions for improvement, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> accessibility@aksharjobs.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Response Time:</strong> We aim to respond within 2 business days</p>
          </div>
        </div>

        <div className="page-section">
          <h2>Third-Party Content</h2>
          <p>
            Some content on our website may be provided by third parties. We work with our 
            partners to ensure their content meets accessibility standards, but if you encounter 
            issues with third-party content, please let us know.
          </p>
        </div>

        <div className="page-section">
          <h2>Accessibility Resources</h2>
          <p>
            For more information about web accessibility, visit:
          </p>
          <ul className="resource-links">
            <li><a href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer">Web Accessibility Initiative (WAI)</a></li>
            <li><a href="https://www.ada.gov/" target="_blank" rel="noopener noreferrer">Americans with Disabilities Act (ADA)</a></li>
            <li><a href="https://webaim.org/" target="_blank" rel="noopener noreferrer">WebAIM - Web Accessibility In Mind</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
