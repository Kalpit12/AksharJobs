import React from 'react';

const Careers = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Careers at AksharJobs</h1>
        
        <div className="page-section">
          <h2>Join Our Mission</h2>
          <p>
            At AksharJobs, we're revolutionizing the way people find jobs and companies discover talent. 
            We're looking for passionate individuals who want to make a real impact in the world of recruitment and career development.
          </p>
        </div>

        <div className="page-section">
          <h2>Why Work With Us?</h2>
          <ul className="benefits-list">
            <li>🚀 Work with cutting-edge AI and machine learning technologies</li>
            <li>💡 Shape the future of job matching and recruitment</li>
            <li>🌍 Remote-first culture with flexible working hours</li>
            <li>📈 Competitive salary and equity packages</li>
            <li>🎓 Continuous learning and development opportunities</li>
            <li>🏥 Comprehensive health and wellness benefits</li>
          </ul>
        </div>

        <div className="page-section">
          <h2>Open Positions</h2>
          <div className="job-openings">
            <div className="job-card">
              <h3>Senior Full Stack Developer</h3>
              <p>Help us build the next generation of our job matching platform using React, Node.js, and Python.</p>
              <span className="job-location">Remote • Full-time</span>
            </div>
            
            <div className="job-card">
              <h3>Product Manager</h3>
              <p>Drive product strategy and roadmap for our AI-powered recruitment solutions.</p>
              <span className="job-location">Remote • Full-time</span>
            </div>
            
            <div className="job-card">
              <h3>UX/UI Designer</h3>
              <p>Design intuitive and beautiful user experiences for job seekers and employers.</p>
              <span className="job-location">Remote • Full-time</span>
            </div>
          </div>
        </div>

        <div className="page-section">
          <h2>Ready to Apply?</h2>
          <p>
            Send your resume and a cover letter to <a href="mailto:careers@aksharjobs.com">careers@aksharjobs.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Careers;
