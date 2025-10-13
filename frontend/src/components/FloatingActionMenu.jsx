import React, { useState } from 'react';
import '../styles/FloatingActionMenu.css';

const FloatingActionMenu = ({ onPostJob, onAIAssist, onBulkAction, onExport }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 1,
      icon: '➕',
      label: 'Post Job',
      color: '#667eea',
      onClick: onPostJob
    },
    {
      id: 2,
      icon: '🤖',
      label: 'AI Assist',
      color: '#8b5cf6',
      onClick: onAIAssist
    },
    {
      id: 3,
      icon: '⚡',
      label: 'Bulk Actions',
      color: '#ec4899',
      onClick: onBulkAction
    },
    {
      id: 4,
      icon: '📊',
      label: 'Export Data',
      color: '#10b981',
      onClick: onExport
    }
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`floating-action-menu ${isOpen ? 'open' : ''}`}>
      <div className="fab-actions">
        {actions.map((action, index) => (
          <button
            key={action.id}
            className="fab-action-btn"
            style={{
              '--action-color': action.color,
              '--action-index': index,
            }}
            onClick={() => {
              action.onClick?.();
              setIsOpen(false);
            }}
            title={action.label}
          >
            <span className="fab-icon">{action.icon}</span>
            <span className="fab-label">{action.label}</span>
          </button>
        ))}
      </div>

      <button
        className="fab-main-btn"
        onClick={toggleMenu}
        aria-label="Open Actions Menu"
      >
        <span className={`fab-main-icon ${isOpen ? 'rotate' : ''}`}>
          {isOpen ? '✕' : '⚡'}
        </span>
        <div className="fab-ripple"></div>
      </button>

      {isOpen && <div className="fab-overlay" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

export default FloatingActionMenu;

