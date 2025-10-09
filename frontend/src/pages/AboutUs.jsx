import React from 'react';
import '../styles/AboutUs.css';

const About = () => {
  return (
    <div className="about_us_section">
      <div className="about-content">
        {/* Hero Section */}
        <div className="hero_section">
          <h1>About Us</h1>
          <p className="hero_subtitle">
            Welcome to <strong>AksharJobs</strong> – your intelligent career companion!
          </p>
          <p className="hero_description">
            At AksharJobs, we are revolutionizing the recruitment landscape through the power of Artificial Intelligence. 
            Our platform is designed to bridge the gap between job seekers and recruiters by offering seamless, smart, 
            and secure matchmaking of resumes with job descriptions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features_grid">
          <div className="feature_card">
            <div className="feature_icon">🎯</div>
            <h3>Smart Matching</h3>
            <p>Our AI uses SBERT-based NLP to compute accurate match scores between resumes and job descriptions, ensuring the perfect fit for both parties.</p>
          </div>

          <div className="feature_card">
            <div className="feature_icon">📋</div>
            <h3>Job Listings</h3>
            <p>Explore curated job opportunities from verified recruiters, updated in real-time with comprehensive details and requirements.</p>
          </div>

          <div className="feature_card">
            <div className="feature_icon">📊</div>
            <h3>Smart Dashboards</h3>
            <p>Personalized dashboards for both seekers and recruiters to manage jobs, resumes, matches, and track application progress.</p>
          </div>

          <div className="feature_card">
            <div className="feature_icon">🔐</div>
            <h3>Privacy First</h3>
            <p>We ensure your data is securely stored and never shared without your consent, maintaining the highest security standards.</p>
          </div>

          <div className="feature_card">
            <div className="feature_icon">🚀</div>
            <h3>AI-Powered Insights</h3>
            <p>Get intelligent recommendations and insights to improve your job search strategy and application success rate.</p>
          </div>

          <div className="feature_card">
            <div className="feature_icon">💼</div>
            <h3>Career Growth</h3>
            <p>Access resources and tools designed to help you advance your career and achieve your professional goals.</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission_section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to <strong>simplify hiring</strong>, empower job seekers, and enhance decision-making 
            with meaningful AI-driven insights. We believe that everyone deserves the opportunity to find their 
            perfect career match, and we're committed to making that process as seamless and intelligent as possible.
          </p>
          <p>
            Join us and experience the future of intelligent hiring, where technology meets human potential 
            to create meaningful connections and career opportunities.
          </p>
        </div>

        {/* Stats Section */}
        <div className="stats_section">
          <div className="stat_item">
            <div className="stat_number">500+</div>
            <div className="stat_label">Jobs Posted</div>
          </div>
          <div className="stat_item">
            <div className="stat_number">250+</div>
            <div className="stat_label">Active Users</div>
          </div>
          <div className="stat_item">
            <div className="stat_number">92%</div>
            <div className="stat_label">Match Accuracy</div>
          </div>
          <div className="stat_item">
            <div className="stat_number">24/7</div>
            <div className="stat_label">AI Support</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;