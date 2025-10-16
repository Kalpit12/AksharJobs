import React from 'react';
import '../styles/QuickActionsWidget.css';

const QuickActionsWidget = ({ onPostJob, onViewCandidates, onScheduleInterview, onViewAnalytics }) => {
  const actions = [
    {
      id: 1,
      icon: '🔍',
      title: 'BROWSE JOBS',
      description: 'Search and apply for jobs',
      color: '#ff8c42',
      onClick: onPostJob
    },
    {
      id: 2,
      icon: '📄',
      title: 'UPDATE RESUME',
      description: 'Edit your resume',
      color: '#20b2aa',
      onClick: onViewCandidates
    },
    {
      id: 3,
      icon: '✏️',
      title: 'EDIT PROFILE',
      description: 'Update your profile',
      color: '#ff8c42',
      onClick: onScheduleInterview
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

