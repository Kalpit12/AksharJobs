import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './CompanyProfileCard.css';

const CompanyProfileCard = ({ userData, isPremium, subscriptionData }) => {
  const { isOnline, status } = useOnlineStatus();
  
  return (
    <div className="company_profile_card">
      {/* Header with Company Icon and Status */}
      <div className="company_header">
        <div className="company_icon_container">
          <div className="company_icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 21H21V19L13 11L9 15L3 9V21Z" fill="#6B7280"/>
              <path d="M3 9L9 15L13 11L21 19V3H3V9Z" fill="#9CA3AF"/>
            </svg>
          </div>
          <div className={`status_badge ${isOnline ? 'active' : 'inactive'}`}>
            <span className="status_dot"></span>
            <span className="status_text">{isOnline ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
        
        <div className="company_info_section">
          <h2 className="company_name">{userData?.companyName || "Sarah Johnson Inc."}</h2>
          <div className="badge_container">
            <span className="recruiter_badge">Recruiter</span>
            {isPremium && subscriptionData && (
              <div className="premium_badge">
                <span className="crown_icon">👑</span>
                <span>PREMIUM PRO</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="contact_section">
        <div className="contact_item">
          <span className="contact_icon">📧</span>
          <span>{userData?.email || "sarah.johnson@company.com"}</span>
        </div>
        <div className="contact_item">
          <span className="contact_icon">📱</span>
          <span>{userData?.phoneNumber || userData?.phone || "+1 (555) 987-6543"}</span>
        </div>
        <div className="contact_item">
          <span className="contact_icon">💼</span>
          <a href={userData?.linkedInProfile || "https://linkedin.com/in/sarahjohnson"} target="_blank" rel="noopener noreferrer">
            LinkedIn Profile
          </a>
        </div>
      </div>

      {/* Company Details */}
      <div className="company_details_section">
        <div className="company_info_left">
          <span className="company_label">Company: {userData?.companyName || "Sarah Johnson Inc."}</span>
        </div>
        <div className="company_info_right">
          <a href={userData?.companyWebsite || userData?.website || "https://sarahjohnsoninc.com"} target="_blank" rel="noopener noreferrer" className="visit_website_btn">
            Visit Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfileCard;
