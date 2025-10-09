import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faComments, 
  faPoll, 
  faUsers, 
  faQuestionCircle,
  faChartBar,
  faClock,
  faFire,
  faThumbsUp,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import QASession from '../components/QASession';
import LivePoll from '../components/LivePoll';
import '../styles/Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('qa');
  const [communityStats, setCommunityStats] = useState({
    activeUsers: 0,
    questionsAnswered: 0,
    pollsCreated: 0,
    totalEngagement: 0
  });

  const tabs = [
    { id: 'qa', label: 'Q&A Sessions', icon: faComments, description: 'Ask questions and get answers from the community' },
    { id: 'polls', label: 'Live Polls', icon: faPoll, description: 'Participate in real-time polls and surveys' },
    { id: 'discussions', label: 'Discussions', icon: faUsers, description: 'Join ongoing community discussions' }
  ];

  const recentActivity = [
    { id: 1, type: 'question', title: 'What are the best practices for remote work?', user: 'Sarah Johnson', time: '2 minutes ago', votes: 15 },
    { id: 2, type: 'poll', title: 'Preferred work arrangement survey', user: 'Mike Chen', time: '5 minutes ago', votes: 89 },
    { id: 3, type: 'answer', title: 'Re: Career transition advice', user: 'Emily Davis', time: '8 minutes ago', votes: 7 },
    { id: 4, type: 'discussion', title: 'Industry trends 2024', user: 'Alex Rodriguez', time: '12 minutes ago', votes: 23 }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'qa':
        return <QASession />;
      case 'polls':
        return <LivePoll />;
      case 'discussions':
        return (
          <div className="discussions-placeholder">
            <div className="placeholder-content">
              <FontAwesomeIcon icon={faUsers} className="placeholder-icon" />
              <h3>Community Discussions</h3>
              <p>Join ongoing discussions and share your insights with the community.</p>
              <button className="coming-soon-btn">Coming Soon</button>
            </div>
          </div>
        );
      default:
        return <QASession />;
    }
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Community Hub</h1>
            <p>Connect, learn, and engage with professionals from around the world</p>
          </div>
          <div className="community-stats">
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{communityStats.activeUsers.toLocaleString()}</span>
                <span className="stat-label">Active Users</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{communityStats.questionsAnswered}</span>
                <span className="stat-label">Questions Answered</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faPoll} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{communityStats.pollsCreated}</span>
                <span className="stat-label">Polls Created</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FontAwesomeIcon icon={faFire} />
              </div>
              <div className="stat-content">
                <span className="stat-number">{communityStats.totalEngagement.toLocaleString()}</span>
                <span className="stat-label">Total Engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="community-content">
        <div className="community-main">
          <div className="modern-tabs-container">
            <div className="modern-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`modern-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="tab-icon">
                    <FontAwesomeIcon icon={tab.icon} />
                  </div>
                  <div className="tab-info">
                    <span className="tab-title">{tab.label}</span>
                    <span className="tab-subtitle">{tab.description}</span>
                  </div>
                  {activeTab === tab.id && <div className="tab-indicator"></div>}
                </button>
              ))}
            </div>
          </div>

          <div className="tab-content-area">
            {renderTabContent()}
          </div>
        </div>

        <div className="community-sidebar">
          <div className="sidebar-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <FontAwesomeIcon 
                      icon={
                        activity.type === 'question' ? faQuestionCircle :
                        activity.type === 'poll' ? faPoll :
                        activity.type === 'answer' ? faComments :
                        faUsers
                      } 
                    />
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                    <div className="activity-stats">
                      <span className="activity-votes">
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {activity.votes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>Community Guidelines</h3>
            <div className="guidelines">
              <div className="guideline-item">
                <FontAwesomeIcon icon={faThumbsUp} />
                <span>Be respectful and constructive</span>
              </div>
              <div className="guideline-item">
                <FontAwesomeIcon icon={faComments} />
                <span>Stay on topic and relevant</span>
              </div>
              <div className="guideline-item">
                <FontAwesomeIcon icon={faUsers} />
                <span>Help others when you can</span>
              </div>
              <div className="guideline-item">
                <FontAwesomeIcon icon={faEye} />
                <span>Report inappropriate content</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
