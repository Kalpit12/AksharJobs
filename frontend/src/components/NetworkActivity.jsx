import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserPlus, 
  faHandshake, 
  faComments, 
  faHeart,
  faShare,
  faThumbsUp,
  faMessage,
  faUsers,
  faClock,
  faExternalLinkAlt,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from './animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/NetworkActivity.css';

const NetworkActivity = () => {
  const [networkActivity, setNetworkActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchNetworkActivity();
  }, []);

  const fetchNetworkActivity = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/network/activity')
      );

      if (response && response.ok) {
        const data = await response.json();
        setNetworkActivity(data.activities || []);
      } else {
        // Mock data for demonstration
        setNetworkActivity([
          {
            id: 1,
            type: 'connection_request',
            user: {
              name: 'Alex Thompson',
              title: 'Software Engineer',
              company: 'Google',
              avatar: null
            },
            action: 'sent you a connection request',
            timestamp: '2024-01-15T14:30:00Z',
            status: 'pending'
          },
          {
            id: 2,
            type: 'profile_view',
            user: {
              name: 'Maria Garcia',
              title: 'HR Director',
              company: 'Microsoft',
              avatar: null
            },
            action: 'viewed your profile',
            timestamp: '2024-01-15T10:15:00Z',
            status: 'completed'
          },
          {
            id: 3,
            type: 'message',
            user: {
              name: 'David Kim',
              title: 'Senior Developer',
              company: 'Apple',
              avatar: null
            },
            action: 'sent you a message',
            timestamp: '2024-01-14T16:45:00Z',
            status: 'unread',
            messagePreview: 'Hi! I saw your profile and would love to connect...'
          },
          {
            id: 4,
            type: 'endorsement',
            user: {
              name: 'Sarah Wilson',
              title: 'Product Manager',
              company: 'Meta',
              avatar: null
            },
            action: 'endorsed your skills',
            timestamp: '2024-01-14T09:20:00Z',
            status: 'completed',
            skills: ['React', 'JavaScript', 'Node.js']
          },
          {
            id: 5,
            type: 'post_like',
            user: {
              name: 'John Smith',
              title: 'Tech Lead',
              company: 'Amazon',
              avatar: null
            },
            action: 'liked your post',
            timestamp: '2024-01-13T11:30:00Z',
            status: 'completed',
            postTitle: 'My thoughts on modern web development'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching network activity:', error);
      setError('Failed to load network activity');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const activityTime = new Date(dateString);
    const diffInHours = Math.floor((now - activityTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityTime.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'connection_request':
        return faUserPlus;
      case 'profile_view':
        return faEye;
      case 'message':
        return faMessage;
      case 'endorsement':
        return faThumbsUp;
      case 'post_like':
        return faHeart;
      case 'post_share':
        return faShare;
      default:
        return faUsers;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'connection_request':
        return '#3b82f6';
      case 'profile_view':
        return '#10b981';
      case 'message':
        return '#f59e0b';
      case 'endorsement':
        return '#8b5cf6';
      case 'post_like':
        return '#ef4444';
      case 'post_share':
        return '#06b6d4';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Pending</span>;
      case 'unread':
        return <span className="status-badge unread">Unread</span>;
      case 'completed':
        return <span className="status-badge completed">Completed</span>;
      default:
        return null;
    }
  };

  const filteredActivities = activeTab === 'all' 
    ? networkActivity 
    : networkActivity.filter(activity => activity.type === activeTab);

  const handleAction = (activity) => {
    switch (activity.type) {
      case 'connection_request':
        // Handle connection request
        console.log('Handle connection request:', activity.id);
        break;
      case 'message':
        // Handle message
        console.log('Handle message:', activity.id);
        break;
      default:
        console.log('Handle activity:', activity);
    }
  };

  if (loading) {
    return (
      <div className="network-activity-container">
        <div className="network-activity-header">
          <h3>Network Activity</h3>
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
      <div className="network-activity-container">
        <div className="network-activity-header">
          <h3>Network Activity</h3>
          <div className="error-message">
            <FontAwesomeIcon icon={faUsers} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="network-activity-container">
      <div className="network-activity-header">
        <h3>Network Activity</h3>
        <div className="activity-tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`tab ${activeTab === 'connection_request' ? 'active' : ''}`}
            onClick={() => setActiveTab('connection_request')}
          >
            Connections
          </button>
          <button 
            className={`tab ${activeTab === 'message' ? 'active' : ''}`}
            onClick={() => setActiveTab('message')}
          >
            Messages
          </button>
        </div>
      </div>

      {filteredActivities.length === 0 ? (
        <div className="no-activity">
          <FontAwesomeIcon icon={faUsers} />
          <p>No network activity yet</p>
          <span>Start connecting with professionals to see activity here</span>
        </div>
      ) : (
        <div className="activity-list">
          {filteredActivities.map((activity, index) => (
            <FadeInUp key={activity.id} delay={index * 0.1}>
              <div className={`activity-item ${activity.status === 'unread' ? 'unread' : ''}`}>
                <div className="activity-icon">
                  <FontAwesomeIcon 
                    icon={getActivityIcon(activity.type)} 
                    style={{ color: getActivityColor(activity.type) }}
                  />
                </div>

                <div className="activity-content">
                  <div className="activity-user">
                    <div className="user-avatar">
                      {activity.user.avatar ? (
                        <img src={activity.user.avatar} alt={activity.user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {activity.user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="user-info">
                      <div className="user-name">{activity.user.name}</div>
                      <div className="user-title">{activity.user.title} at {activity.user.company}</div>
                    </div>
                  </div>

                  <div className="activity-action">
                    <span className="action-text">{activity.action}</span>
                    {activity.skills && (
                      <div className="skills-endorsed">
                        {activity.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                    {activity.messagePreview && (
                      <div className="message-preview">
                        "{activity.messagePreview}"
                      </div>
                    )}
                    {activity.postTitle && (
                      <div className="post-title">
                        "{activity.postTitle}"
                      </div>
                    )}
                  </div>

                  <div className="activity-meta">
                    <div className="activity-time">
                      <FontAwesomeIcon icon={faClock} />
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>

                <div className="activity-actions">
                  {(activity.type === 'connection_request' || activity.type === 'message') && (
                    <button 
                      className="action-btn primary"
                      onClick={() => handleAction(activity)}
                    >
                      {activity.type === 'connection_request' ? 'Accept' : 'Reply'}
                    </button>
                  )}
                  <button className="action-btn secondary">
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </button>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      )}

      {filteredActivities.length > 0 && (
        <div className="activity-footer">
          <button className="view-all-btn">
            View All Activity
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </button>
        </div>
      )}
    </div>
  );
};

export default NetworkActivity;
