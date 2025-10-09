import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUserCheck, 
  faUserPlus, 
  faEnvelope, 
  faClock,
  faCheckCircle,
  faTimesCircle,
  faExternalLinkAlt,
  faSearch,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import { FadeInUp } from './animations';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/RecommendationRequests.css';

const RecommendationRequests = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('received');
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/recommendations/requests')
      );

      if (response && response.ok) {
        const data = await response.json();
        setRecommendations(data.received || []);
        setSentRequests(data.sent || []);
      } else {
        // Mock data for demonstration
        setRecommendations([
          {
            id: 1,
            requester: {
              name: 'John Smith',
              title: 'Senior Developer',
              company: 'TechCorp',
              avatar: null
            },
            message: 'Hi! I\'d love to get a recommendation from you for my recent project work.',
            requestedAt: '2024-01-15T10:30:00Z',
            status: 'pending',
            skills: ['React', 'Node.js', 'JavaScript']
          },
          {
            id: 2,
            requester: {
              name: 'Sarah Johnson',
              title: 'Product Manager',
              company: 'StartupXYZ',
              avatar: null
            },
            message: 'Could you please write a recommendation for my leadership skills?',
            requestedAt: '2024-01-14T15:45:00Z',
            status: 'pending',
            skills: ['Leadership', 'Product Management', 'Agile']
          }
        ]);

        setSentRequests([
          {
            id: 3,
            recipient: {
              name: 'Michael Chen',
              title: 'Tech Lead',
              company: 'Google',
              avatar: null
            },
            message: 'I worked with Michael on several projects and would like a recommendation.',
            sentAt: '2024-01-13T09:20:00Z',
            status: 'pending'
          },
          {
            id: 4,
            recipient: {
              name: 'Emily Rodriguez',
              title: 'Senior Engineer',
              company: 'Microsoft',
              avatar: null
            },
            message: 'Emily was my mentor and I\'d appreciate a recommendation.',
            sentAt: '2024-01-12T14:15:00Z',
            status: 'accepted'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError('Failed to load recommendation requests');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const requestTime = new Date(dateString);
    const diffInHours = Math.floor((now - requestTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return requestTime.toLocaleDateString();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return faClock;
      case 'accepted':
        return faCheckCircle;
      case 'declined':
        return faTimesCircle;
      default:
        return faClock;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'declined':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleAcceptRecommendation = async (recommendationId) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl(`/api/recommendations/${recommendationId}/accept`),
        { method: 'POST' }
      );

      if (response && response.ok) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, status: 'accepted' }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Error accepting recommendation:', error);
    }
  };

  const handleDeclineRecommendation = async (recommendationId) => {
    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl(`/api/recommendations/${recommendationId}/decline`),
        { method: 'POST' }
      );

      if (response && response.ok) {
        setRecommendations(prev => 
          prev.map(rec => 
            rec.id === recommendationId 
              ? { ...rec, status: 'declined' }
              : rec
          )
        );
      }
    } catch (error) {
      console.error('Error declining recommendation:', error);
    }
  };

  const filteredRecommendations = recommendations.filter(rec =>
    rec.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.requester.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSentRequests = sentRequests.filter(req =>
    req.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.recipient.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="recommendation-requests-container">
        <div className="recommendation-requests-header">
          <h3>Recommendation Requests</h3>
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
      <div className="recommendation-requests-container">
        <div className="recommendation-requests-header">
          <h3>Recommendation Requests</h3>
          <div className="error-message">
            <FontAwesomeIcon icon={faUserCheck} />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendation-requests-container">
      <div className="recommendation-requests-header">
        <h3>Recommendation Requests</h3>
        <div className="header-actions">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="new-request-btn"
            onClick={() => setShowNewRequest(true)}
          >
            <FontAwesomeIcon icon={faUserPlus} />
            Request Recommendation
          </button>
        </div>
      </div>

      <div className="recommendation-tabs">
        <button 
          className={`tab ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({recommendations.length})
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({sentRequests.length})
        </button>
      </div>

      {activeTab === 'received' ? (
        <div className="recommendations-list">
          {filteredRecommendations.length === 0 ? (
            <div className="no-requests">
              <FontAwesomeIcon icon={faUserCheck} />
              <p>No recommendation requests</p>
              <span>You'll see requests from colleagues here</span>
            </div>
          ) : (
            filteredRecommendations.map((recommendation, index) => (
              <FadeInUp key={recommendation.id} delay={index * 0.1}>
                <div className="recommendation-item">
                  <div className="requester-info">
                    <div className="requester-avatar">
                      {recommendation.requester.avatar ? (
                        <img src={recommendation.requester.avatar} alt={recommendation.requester.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {recommendation.requester.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="requester-details">
                      <div className="requester-name">{recommendation.requester.name}</div>
                      <div className="requester-title">{recommendation.requester.title} at {recommendation.requester.company}</div>
                      <div className="request-time">
                        <FontAwesomeIcon icon={faClock} />
                        {formatTimeAgo(recommendation.requestedAt)}
                      </div>
                    </div>
                  </div>

                  <div className="recommendation-content">
                    <div className="request-message">
                      "{recommendation.message}"
                    </div>
                    {recommendation.skills && (
                      <div className="requested-skills">
                        <span className="skills-label">Skills to highlight:</span>
                        <div className="skills-tags">
                          {recommendation.skills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="recommendation-actions">
                    <div className="status-indicator">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(recommendation.status)}
                        style={{ color: getStatusColor(recommendation.status) }}
                      />
                      <span style={{ color: getStatusColor(recommendation.status) }}>
                        {recommendation.status.charAt(0).toUpperCase() + recommendation.status.slice(1)}
                      </span>
                    </div>
                    
                    {recommendation.status === 'pending' && (
                      <div className="action-buttons">
                        <button 
                          className="accept-btn"
                          onClick={() => handleAcceptRecommendation(recommendation.id)}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Accept
                        </button>
                        <button 
                          className="decline-btn"
                          onClick={() => handleDeclineRecommendation(recommendation.id)}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </FadeInUp>
            ))
          )}
        </div>
      ) : (
        <div className="sent-requests-list">
          {filteredSentRequests.length === 0 ? (
            <div className="no-requests">
              <FontAwesomeIcon icon={faEnvelope} />
              <p>No sent requests</p>
              <span>Request recommendations from your network</span>
            </div>
          ) : (
            filteredSentRequests.map((request, index) => (
              <FadeInUp key={request.id} delay={index * 0.1}>
                <div className="sent-request-item">
                  <div className="recipient-info">
                    <div className="recipient-avatar">
                      {request.recipient.avatar ? (
                        <img src={request.recipient.avatar} alt={request.recipient.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {request.recipient.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="recipient-details">
                      <div className="recipient-name">{request.recipient.name}</div>
                      <div className="recipient-title">{request.recipient.title} at {request.recipient.company}</div>
                      <div className="sent-time">
                        <FontAwesomeIcon icon={faClock} />
                        Sent {formatTimeAgo(request.sentAt)}
                      </div>
                    </div>
                  </div>

                  <div className="request-content">
                    <div className="request-message">
                      "{request.message}"
                    </div>
                  </div>

                  <div className="request-status">
                    <div className="status-indicator">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(request.status)}
                        style={{ color: getStatusColor(request.status) }}
                      />
                      <span style={{ color: getStatusColor(request.status) }}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            ))
          )}
        </div>
      )}

      {(filteredRecommendations.length > 0 || filteredSentRequests.length > 0) && (
        <div className="recommendations-footer">
          <button className="view-all-btn">
            View All Recommendations
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationRequests;
