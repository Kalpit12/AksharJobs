import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import './StatCard.css';

const StatCard = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  trendLabel = 'last week',
  icon,
  iconColor,
  showGraph = false,
  graphColor = '#3b82f6'
}) => {
  const isPositive = trend >= 0;
  const trendColor = isPositive ? '#10b981' : '#ef4444';
  const trendIcon = isPositive ? faArrowUp : faArrowDown;

  return (
    <div className="modern-stat-card">
      <div className="stat-card-content">
        <div className="stat-card-left">
          <div className="stat-card-title">{title}</div>
          <div className="stat-card-value">{value}</div>
          {trend !== undefined && (
            <div className="stat-card-trend" style={{ color: trendColor }}>
              <FontAwesomeIcon icon={trendIcon} className="trend-arrow" />
              <span className="trend-text">
                {trend > 0 ? '+' : ''}{trend}% {trendValue && `${trendValue} `}{trendLabel}
              </span>
            </div>
          )}
        </div>
        
        {showGraph && (
          <div className="stat-card-graph">
            <div className="mini-graph" style={{ '--graph-color': graphColor }}>
              <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`gradient-${title.replace(/\s/g, '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: graphColor, stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: graphColor, stopOpacity: 0.05 }} />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 30 Q 25 25, 50 15 T 100 10"
                  fill="none"
                  stroke={graphColor}
                  strokeWidth="2"
                />
                <path
                  d="M 0 30 Q 25 25, 50 15 T 100 10 L 100 40 L 0 40 Z"
                  fill={`url(#gradient-${title.replace(/\s/g, '')})`}
                />
              </svg>
              <div className="graph-percentage" style={{ color: graphColor }}>
                {Math.abs(trend)}%
              </div>
            </div>
          </div>
        )}
        
        {icon && !showGraph && (
          <div className="stat-card-icon" style={{ backgroundColor: iconColor || '#3b82f6' }}>
            <FontAwesomeIcon icon={icon} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

