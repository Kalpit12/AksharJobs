import React, { useState, useEffect } from 'react';
import '../styles/ActivityFeed.css';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate real-time activity feed
    const mockActivities = [
      {
        id: 1,
        type: 'application',
        icon: '📝',
        user: 'John Doe',
        action: 'applied for',
        target: 'Senior Developer',
        time: new Date(Date.now() - 2 * 60000),
        color: '#3b82f6'
      },
      {
        id: 2,
        type: 'interview',
        icon: '📅',
        user: 'Sarah Johnson',
        action: 'scheduled interview with',
        target: 'Frontend Engineer',
        time: new Date(Date.now() - 15 * 60000),
        color: '#8b5cf6'
      },
      {
        id: 3,
        type: 'offer',
        icon: '✉️',
        user: 'Michael Brown',
        action: 'accepted offer for',
        target: 'Product Manager',
        time: new Date(Date.now() - 45 * 60000),
        color: '#10b981'
      },
      {
        id: 4,
        type: 'review',
        icon: '⭐',
        user: 'Emily Davis',
        action: 'completed review of',
        target: 'Backend Developer',
        time: new Date(Date.now() - 90 * 60000),
        color: '#f59e0b'
      },
      {
        id: 5,
        type: 'shortlist',
        icon: '📋',
        user: 'David Wilson',
        action: 'was shortlisted for',
        target: 'DevOps Engineer',
        time: new Date(Date.now() - 120 * 60000),
        color: '#ec4899'
      }
    ];

    setActivities(mockActivities);

    // Simulate new activities
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: 'application',
        icon: '📝',
        user: `Candidate ${Math.floor(Math.random() * 100)}`,
        action: 'applied for',
        target: 'Software Engineer',
        time: new Date(),
        color: '#3b82f6'
      };
      setActivities(prev => [newActivity, ...prev].slice(0, 10));
    }, 30000); // New activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTimeAgo = (time) => {
    const seconds = Math.floor((new Date() - time) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.type === filter);

  return (
    <div className="activity-feed glass-card">
      <div className="feed-header">
        <div className="header-content">
          <h3 className="feed-title">⚡ Live Activity Feed</h3>
          <span className="live-indicator">
            <span className="pulse-dot"></span>
            Live
          </span>
        </div>
        
        <div className="feed-filters">
          {['all', 'application', 'interview', 'offer'].map((type) => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="activity-list">
        {filteredActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="activity-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className="activity-icon-wrapper"
              style={{ background: `${activity.color}20` }}
            >
              <span className="activity-icon">{activity.icon}</span>
            </div>
            
            <div className="activity-content">
              <p className="activity-text">
                <strong>{activity.user}</strong> {activity.action}{' '}
                <span className="activity-target">{activity.target}</span>
              </p>
              <span className="activity-time">{getTimeAgo(activity.time)}</span>
            </div>
            
            <div className="activity-actions">
              <button className="action-icon-btn" title="View Details">
                👁️
              </button>
              <button className="action-icon-btn" title="More Options">
                ⋯
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="empty-feed">
          <span className="empty-icon">📭</span>
          <p>No activities to show</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;

