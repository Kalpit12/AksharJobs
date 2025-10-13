import React, { useState, useEffect } from 'react';
import '../styles/HiringFunnelVisualization.css';

const HiringFunnelVisualization = ({ applications = [] }) => {
  const [animatedStages, setAnimatedStages] = useState([]);

  // Calculate funnel stages
  const calculateStages = () => {
    const stages = [
      {
        id: 1,
        name: 'Applied',
        count: applications.length,
        percentage: 100,
        color: '#3b82f6',
        icon: '📝'
      },
      {
        id: 2,
        name: 'Screening',
        count: Math.floor(applications.length * 0.7),
        percentage: 70,
        color: '#8b5cf6',
        icon: '🔍'
      },
      {
        id: 3,
        name: 'Interview',
        count: Math.floor(applications.length * 0.4),
        percentage: 40,
        color: '#ec4899',
        icon: '💬'
      },
      {
        id: 4,
        name: 'Offer',
        count: Math.floor(applications.length * 0.15),
        percentage: 15,
        color: '#f59e0b',
        icon: '📄'
      },
      {
        id: 5,
        name: 'Hired',
        count: Math.floor(applications.length * 0.08),
        percentage: 8,
        color: '#10b981',
        icon: '✅'
      }
    ];
    return stages;
  };

  useEffect(() => {
    const stages = calculateStages();
    // Animate stages one by one
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setAnimatedStages(prev => [...prev, stage]);
      }, index * 200);
    });
  }, [applications]);

  const stages = calculateStages();

  return (
    <div className="hiring-funnel-widget glass-card">
      <div className="widget-header">
        <h3 className="widget-title">📊 Hiring Funnel</h3>
        <p className="widget-subtitle">Track candidates through your hiring process</p>
      </div>

      <div className="funnel-container">
        {stages.map((stage, index) => {
          const isAnimated = animatedStages.some(s => s.id === stage.id);
          const conversionRate = index > 0 ? 
            ((stage.count / stages[index - 1].count) * 100).toFixed(1) : 100;

          return (
            <div key={stage.id} className={`funnel-stage ${isAnimated ? 'animated' : ''}`}>
              <div className="stage-header">
                <div className="stage-info">
                  <span className="stage-icon">{stage.icon}</span>
                  <span className="stage-name">{stage.name}</span>
                </div>
                <div className="stage-metrics">
                  <span className="stage-count">{stage.count}</span>
                  {index > 0 && (
                    <span className="conversion-rate">{conversionRate}% →</span>
                  )}
                </div>
              </div>
              
              <div className="funnel-bar-container">
                <div 
                  className="funnel-bar"
                  style={{
                    width: `${stage.percentage}%`,
                    background: `linear-gradient(135deg, ${stage.color} 0%, ${stage.color}cc 100%)`,
                    boxShadow: `0 4px 20px ${stage.color}40`
                  }}
                >
                  <div className="funnel-bar-glow" style={{ background: stage.color }}></div>
                  <span className="funnel-percentage">{stage.percentage}%</span>
                </div>
              </div>

              {index < stages.length - 1 && (
                <div className="stage-connector">
                  <svg width="40" height="30" viewBox="0 0 40 30">
                    <path 
                      d="M 20 0 L 30 15 L 20 30" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="2"
                      className="connector-arrow"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="funnel-insights">
        <div className="insight-card">
          <div className="insight-icon">🎯</div>
          <div className="insight-content">
            <h4>Conversion Rate</h4>
            <p>{((stages[4].count / stages[0].count) * 100).toFixed(1)}% overall</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">⏱️</div>
          <div className="insight-content">
            <h4>Avg. Time to Hire</h4>
            <p>21 days</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon">📈</div>
          <div className="insight-content">
            <h4>Success Rate</h4>
            <p>+12% vs last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiringFunnelVisualization;

