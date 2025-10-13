import React from 'react';
import '../styles/QuickActionsWidget.css';

const QuickActionsWidget = ({ onPostJob, onViewCandidates, onScheduleInterview, onViewAnalytics }) => {
  const actions = [
    {
      id: 1,
      icon: '➕',
      title: 'Post New Job',
      description: 'Create a new job posting',
      color: '#667eea',
      onClick: onPostJob
    },
    {
      id: 2,
      icon: '👥',
      title: 'Browse Candidates',
      description: 'View candidate profiles',
      color: '#f093fb',
      onClick: onViewCandidates
    },
    {
      id: 3,
      icon: '📅',
      title: 'Schedule Interview',
      description: 'Set up interviews',
      color: '#4facfe',
      onClick: onScheduleInterview
    },
    {
      id: 4,
      icon: '📊',
      title: 'View Analytics',
      description: 'Check your metrics',
      color: '#43e97b',
      onClick: onViewAnalytics
    },
    {
      id: 5,
      icon: '💬',
      title: 'AI Assistant',
      description: 'Get AI help',
      color: '#fa709a',
      onClick: () => console.log('AI Assistant')
    },
    {
      id: 6,
      icon: '⚡',
      title: 'Bulk Actions',
      description: 'Process multiple items',
      color: '#feca57',
      onClick: () => console.log('Bulk Actions')
    }
  ];

  return (
    <div className="quick-actions-widget glass-card">
      <div className="widget-header">
        <h3 className="widget-title">⚡ Quick Actions</h3>
        <p className="widget-subtitle">Frequently used actions at your fingertips</p>
      </div>
      
      <div className="actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="action-card"
            onClick={action.onClick}
            style={{ '--card-color': action.color }}
          >
            <div className="action-icon" style={{ background: action.color }}>
              {action.icon}
            </div>
            <div className="action-content">
              <h4 className="action-title">{action.title}</h4>
              <p className="action-description">{action.description}</p>
            </div>
            <div className="action-arrow">→</div>
            <div className="action-glow" style={{ background: `${action.color}33` }}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsWidget;

