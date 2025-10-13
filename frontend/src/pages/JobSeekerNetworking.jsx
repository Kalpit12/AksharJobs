import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileViews from '../components/ProfileViews';
import NetworkActivity from '../components/NetworkActivity';
import RecommendationRequests from '../components/RecommendationRequests';
import PortfolioShowcase from '../components/PortfolioShowcase';
import '../styles/JobSeekerDashboard.css';

const JobSeekerNetworking = () => {
  return (
    <>
      <Header />
      <div className="dashboard_wrapper">
        <main className="dashboard_content">
          <section className="profile-networking-section">
            <h2 className="section-title">Profile & Networking</h2>
            <div className="networking-grid">
              <div className="networking-item">
                <ProfileViews />
              </div>
              <div className="networking-item">
                <NetworkActivity />
              </div>
              <div className="networking-item">
                <RecommendationRequests />
              </div>
              <div className="networking-item">
                <PortfolioShowcase />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default JobSeekerNetworking;


