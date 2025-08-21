import React from 'react';
import '../styles/AboutUs.css';
import Header from '../components/Header';

const About = () => {
  return (
    <div className="about_us_section">
      <Header />
      <div className="about-content">
        <h1>About Us</h1>
        <p>
          Welcome to <strong>RocketJobs</strong> – your intelligent career companion!
          <br /><br />
          At RocketJobs, we are revolutionizing the recruitment landscape through the power of Artificial Intelligence. Our platform is designed to bridge the gap between job seekers and recruiters by offering seamless, smart, and secure matchmaking of resumes with job descriptions.
        </p>

        <div className="about_us_highlights">
          <div className="about_us_highlight">
            <h3>🎯 Smart Matching</h3>
            <p>Our AI uses SBERT-based NLP to compute accurate match scores between resumes and job descriptions.</p>
          </div>

          <div className="about_us_highlight">
            <h3>📋 Job Listings</h3>
            <p>Explore curated job opportunities from verified recruiters, updated in real-time.</p>
          </div>

          <div className="about_us_highlight">
            <h3>📊 Dashboards</h3>
            <p>Personalized dashboards for both seekers and recruiters to manage jobs, resumes, and matches.</p>
          </div>

          <div className="about_us_highlight">
            <h3>🔐 Privacy First</h3>
            <p>We ensure your data is securely stored and never shared without your consent.</p>
          </div>
        </div>

        <p style={{ marginTop: '40px' }}>
          Our mission is to <strong>simplify hiring</strong>, empower job seekers, and enhance decision-making with meaningful AI-driven insights.
          Join us and experience the future of intelligent hiring!
        </p>
      </div>
    </div>
  );
};

export default About;