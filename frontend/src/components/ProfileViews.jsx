import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faUser, 
  faClock, 
  faBuilding,
  faMapMarkerAlt,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from './animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/ProfileViews.css';

const ProfileViews = () => {
  const [profileViews, setProfileViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfileViews();
  }, []);

  const fetchProfileViews = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/profile/views')
      );

      if (response && response.ok) {
        const data = await response.json();
        setProfileViews(data.views || []);
      } else {
        // Mock data for demonstration
        setProfileViews([
          {
            id: 1,
            viewerName: 'Sarah Johnson',
            viewerTitle: 'HR Manager',
            company: 'TechCorp Solutions',
            location: 'New York, NY',
            viewedAt: '2024-01-15T10:30:00Z',
            viewerType: 'recruiter',
            avatar: null
          },
          {
            id: 2,
            viewerName: 'Michael Chen',
            viewerTitle: 'Senior Developer',
            company: 'InnovateTech',
            location: 'San Francisco, CA',
            viewedAt: '2024-01-14T15:45:00Z',
            viewerType: 'professional',
            avatar: null
          },
          {
            id: 3,
            viewerName: 'Emily Rodriguez',
            viewerTitle: 'Talent Acquisition',
            company: 'StartupXYZ',
            location: 'Austin, TX',
            viewedAt: '2024-01-13T09:15:00Z',
            viewerType: 'recruiter',
            avatar: null
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching profile views:', error);
      setError('Failed to load profile views');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const viewedAt = new Date(dateString);
    const diffInHours = Math.floor((now - viewedAt) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return viewedAt.toLocaleDateString();
  };

  const getViewerTypeIcon = (viewerType) => {
    switch (viewerType) {
      case 'recruiter':
        return faBuilding;
      case 'professional':
        return faUser;
      default:
        return faEye;
    }
  };

  const getViewerTypeColor = (viewerType) => {
    switch (viewerType) {
      case 'recruiter':
        return '#3b82f6';
      case 'professional':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div className="profile-views-container">
        <div className="profile-views-header">
          <h3>Profile Views</h3>
          <div className="loading-skeleton">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-views-container">
        <div className="profile-views-header">
          <h3>Profile Views</h3>
          <div className="error-message">
            <FontAwesomeIcon icon={faEye} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-views-container">
      <div className="profile-views-header">
        <h3>Profile Views</h3>
        <span className="views-count">{profileViews.length} views</span>
      </div>

      {profileViews.length === 0 ? (
        <div className="no-views">
          <FontAwesomeIcon icon={faEye} />
          <p>No profile views yet</p>
          <span>Complete your profile to increase visibility</span>
        </div>
      ) : (
        <div className="views-list">
          {profileViews.map((view, index) => (
            <FadeInUp key={view.id} delay={index * 0.1}>
              <div className="view-item">
                <div className="viewer-avatar">
                  {view.avatar ? (
                    <img src={view.avatar} alt={view.viewerName} />
                  ) : (
                    <div className="avatar-placeholder">
                      <FontAwesomeIcon icon={getViewerTypeIcon(view.viewerType)} />
                    </div>
                  )}
                  <div 
                    className="viewer-type-badge"
                    style={{ backgroundColor: getViewerTypeColor(view.viewerType) }}
                  >
                    {view.viewerType === 'recruiter' ? 'R' : 'P'}
                  </div>
                </div>

                <div className="viewer-info">
                  <div className="viewer-name">{view.viewerName}</div>
                  <div className="viewer-title">{view.viewerTitle}</div>
                  <div className="viewer-company">
                    <FontAwesomeIcon icon={faBuilding} />
                    {view.company}
                  </div>
                  <div className="viewer-location">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    {view.location}
                  </div>
                </div>

                <div className="view-meta">
                  <div className="view-time">
                    <FontAwesomeIcon icon={faClock} />
                    {formatTimeAgo(view.viewedAt)}
                  </div>
                  <button className="view-profile-btn">
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                    View Profile
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      )}

      {profileViews.length > 0 && (
        <div className="views-footer">
          <button className="view-all-btn">
            View All Profile Views
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileViews;
