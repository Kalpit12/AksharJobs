import React from 'react';
import '../styles/StaticPages.css';

const Press = () => {
  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">Press & Media</h1>
        
        <div className="page-section">
          <h2>About AksharJobs</h2>
          <p>
            AksharJobs is a revolutionary job matching platform that uses AI-powered technology to connect 
            top talent with amazing opportunities. Our mission is to make job searching and recruitment 
            more efficient, accurate, and meaningful for everyone involved.
          </p>
        </div>

        <div className="page-section">
          <h2>Press Releases</h2>
          <div className="press-releases">
            <article className="press-item">
              <h3>AksharJobs Launches AI-Powered Job Matching Platform</h3>
              <p className="press-date">December 2024</p>
              <p>
                Revolutionary platform uses advanced machine learning algorithms to match job seekers 
                with perfect opportunities based on skills, experience, and career goals.
              </p>
            </article>
            
            <article className="press-item">
              <h3>AksharJobs Reaches 10,000 Active Users Milestone</h3>
              <p className="press-date">November 2024</p>
              <p>
                Platform celebrates significant growth with over 10,000 active users and 95% 
                job matching success rate within first year of operation.
              </p>
            </article>
          </div>
        </div>

        <div className="page-section">
          <h2>Media Kit</h2>
          <p>
            For media inquiries, press releases, or interview requests, please contact our press team:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> press@aksharjobs.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="page-section">
          <h2>Company Facts</h2>
          <ul className="facts-list">
            <li><strong>Founded:</strong> 2024</li>
            <li><strong>Headquarters:</strong> Tech City, TC</li>
            <li><strong>Industry:</strong> HR Technology, Recruitment, AI</li>
            <li><strong>Users:</strong> 10,000+ active job seekers and employers</li>
            <li><strong>Success Rate:</strong> 95% job matching accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Press;
