import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const siteStructure = {
    'Main Pages': [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
      { name: 'Blog', path: '/blog' },
      { name: 'Contact', path: '/contact' },
    ],
    'For Job Seekers': [
      { name: 'Browse Jobs', path: '/jobs' },
      { name: 'Upload Resume', path: '/modern-upload' },
      { name: 'Create Profile', path: '/profile' },
      { name: 'Job Seeker Dashboard', path: '/jobseeker-dashboard' },
      { name: 'Application Tracker', path: '/application-tracker' },
      { name: 'Resume Builder', path: '/resume-builder' },
      { name: 'Salary Guide', path: '/salary-guide' },
      { name: 'Career Advice', path: '/career-advice' },
    ],
    'For Employers': [
      { name: 'Post a Job', path: '/post-job' },
      { name: 'Recruiter Dashboard', path: '/recruiter-dashboard' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Recruitment Solutions', path: '/recruitment-solutions' },
      { name: 'Resources', path: '/resources' },
      { name: 'Contact Sales', path: '/contact-sales' },
    ],
    'Company': [
      { name: 'Careers', path: '/careers' },
      { name: 'Press', path: '/press' },
      { name: 'Partners', path: '/partners' },
    ],
    'Support & Legal': [
      { name: 'Help Center', path: '/help-center' },
      { name: 'Contact Us', path: '/contact-us' },
      { name: 'Privacy Policy', path: '/privacy-policy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookie-policy' },
    ],
    'Account': [
      { name: 'Sign Up', path: '/signup' },
      { name: 'Login', path: '/login' },
      { name: 'Premium', path: '/premium' },
    ]
  };

  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Sitemap</h1>
        
        <div className="page-section">
          <p>
            Find all pages and sections of AksharJobs easily with our comprehensive sitemap.
          </p>
        </div>

        <div className="sitemap-grid">
          {Object.entries(siteStructure).map(([section, links]) => (
            <div key={section} className="sitemap-section">
              <h2 className="sitemap-heading">{section}</h2>
              <ul className="sitemap-links">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="sitemap-link">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="page-section">
          <h2>Can't Find What You're Looking For?</h2>
          <p>
            If you can't find a specific page or need help navigating our site, 
            please <Link to="/contact-us">contact our support team</Link> for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
