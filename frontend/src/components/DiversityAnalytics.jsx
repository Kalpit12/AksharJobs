import React, { useState, useEffect } from 'react';
import '../styles/DiversityAnalytics.css';

const DiversityAnalytics = ({ onClose }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30days');

  useEffect(() => {
    loadDiversityAnalytics();
  }, [selectedPeriod]);

  const loadDiversityAnalytics = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock data - replace with actual API call
    const mockData = generateMockAnalytics();
    setAnalyticsData(mockData);
    setIsLoading(false);
  };

  const generateMockAnalytics = () => {
    const baseData = {
      totalHires: 45,
      culturalDiversity: {
        communication_styles: {
          formal: 18,
          informal: 15,
          mixed: 12
        },
        leadership_preferences: {
          hierarchical: 20,
          collaborative: 15,
          mentoring: 10
        },
        work_environments: {
          fast_paced: 22,
          stable: 13,
          creative: 10
        },
        language_preferences: {
          english: 25,
          swahili: 12,
          bilingual: 8
        }
      },
      culturalFitScores: {
        excellent: 15,
        good: 18,
        moderate: 8,
        poor: 4
      },
      retentionRates: {
        high_fit: 0.93,
        moderate_fit: 0.78,
        low_fit: 0.45
      },
      onboardingSuccess: {
        cultural_training: 0.89,
        mentorship_programs: 0.92,
        team_integration: 0.85
      }
    };

    // Adjust data based on selected period
    if (selectedPeriod === '90days') {
      baseData.totalHires = 120;
      baseData.culturalDiversity.communication_styles.formal = 48;
      baseData.culturalDiversity.communication_styles.informal = 40;
      baseData.culturalDiversity.communication_styles.mixed = 32;
    } else if (selectedPeriod === '6months') {
      baseData.totalHires = 280;
      baseData.culturalDiversity.communication_styles.formal = 112;
      baseData.culturalDiversity.communication_styles.informal = 93;
      baseData.culturalDiversity.communication_styles.mixed = 75;
    }

    return baseData;
  };

  const calculateDiversityIndex = (data) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    const proportions = Object.values(data).map(value => value / total);
    const diversityIndex = 1 - proportions.reduce((sum, p) => sum + p * p, 0);
    return Math.round(diversityIndex * 100);
  };

  const getDiversityColor = (index) => {
    if (index >= 70) return '#10b981';
    if (index >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getDiversityLabel = (index) => {
    if (index >= 70) return 'High Diversity';
    if (index >= 50) return 'Moderate Diversity';
    return 'Low Diversity';
  };

  if (isLoading) {
    return (
      <div className="diversity-analytics-overlay">
        <div className="diversity-analytics-modal">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h3>Loading Diversity Analytics...</h3>
            <p>Analyzing cultural diversity patterns in your hiring</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diversity-analytics-overlay">
      <div className="diversity-analytics-modal">
        <div className="modal-header">
          <h2>📊 Cultural Diversity Analytics</h2>
          <p>Track and analyze cultural diversity in your hiring practices</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="period-selector">
          <label>Analysis Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="6months">Last 6 Months</option>
          </select>
        </div>

        <div className="analytics-grid">
          {/* Overall Diversity Score */}
          <div className="analytics-card main-metric">
            <h3>Overall Cultural Diversity</h3>
            <div className="diversity-score">
              <div 
                className="score-circle large" 
                style={{ 
                  background: `conic-gradient(${getDiversityColor(calculateDiversityIndex(analyticsData.culturalDiversity.communication_styles))} ${calculateDiversityIndex(analyticsData.culturalDiversity.communication_styles) * 3.6}deg, #f3f4f6 0deg)` 
                }}
              >
                <div className="score-inner">
                  <span className="score-number">{calculateDiversityIndex(analyticsData.culturalDiversity.communication_styles)}%</span>
                  <span className="score-label">{getDiversityLabel(calculateDiversityIndex(analyticsData.culturalDiversity.communication_styles))}</span>
                </div>
              </div>
            </div>
            <p className="metric-description">
              Based on {analyticsData.totalHires} hires in the selected period
            </p>
          </div>

          {/* Cultural Fit Distribution */}
          <div className="analytics-card">
            <h3>Cultural Fit Distribution</h3>
            <div className="fit-distribution">
              <div className="fit-bar">
                <span className="fit-label">Excellent</span>
                <div className="fit-progress">
                  <div 
                    className="fit-fill excellent" 
                    style={{ width: `${(analyticsData.culturalFitScores.excellent / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="fit-count">{analyticsData.culturalFitScores.excellent}</span>
              </div>
              
              <div className="fit-bar">
                <span className="fit-label">Good</span>
                <div className="fit-progress">
                  <div 
                    className="fit-fill good" 
                    style={{ width: `${(analyticsData.culturalFitScores.good / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="fit-count">{analyticsData.culturalFitScores.good}</span>
              </div>
              
              <div className="fit-bar">
                <span className="fit-label">Moderate</span>
                <div className="fit-progress">
                  <div 
                    className="fit-fill moderate" 
                    style={{ width: `${(analyticsData.culturalFitScores.moderate / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="fit-count">{analyticsData.culturalFitScores.moderate}</span>
              </div>
              
              <div className="fit-bar">
                <span className="fit-label">Poor</span>
                <div className="fit-progress">
                  <div 
                    className="fit-fill poor" 
                    style={{ width: `${(analyticsData.culturalFitScores.poor / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="fit-count">{analyticsData.culturalFitScores.poor}</span>
              </div>
            </div>
          </div>

          {/* Communication Styles */}
          <div className="analytics-card">
            <h3>Communication Style Diversity</h3>
            <div className="diversity-chart">
              <div className="chart-item">
                <span className="chart-label">Formal</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{ width: `${(analyticsData.culturalDiversity.communication_styles.formal / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="chart-value">{analyticsData.culturalDiversity.communication_styles.formal}</span>
              </div>
              
              <div className="chart-item">
                <span className="chart-label">Informal</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{ width: `${(analyticsData.culturalDiversity.communication_styles.informal / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="chart-value">{analyticsData.culturalDiversity.communication_styles.informal}</span>
              </div>
              
              <div className="chart-item">
                <span className="chart-label">Mixed</span>
                <div className="chart-bar">
                  <div 
                    className="chart-fill" 
                    style={{ width: `${(analyticsData.culturalDiversity.communication_styles.mixed / analyticsData.totalHires) * 100}%` }}
                  ></div>
                </div>
                <span className="chart-value">{analyticsData.culturalDiversity.communication_styles.mixed}</span>
              </div>
            </div>
          </div>

          {/* Retention Rates */}
          <div className="analytics-card">
            <h3>Retention by Cultural Fit</h3>
            <div className="retention-metrics">
              <div className="retention-item">
                <span className="retention-label">High Fit</span>
                <span className="retention-rate success">{(analyticsData.retentionRates.high_fit * 100).toFixed(1)}%</span>
              </div>
              
              <div className="retention-item">
                <span className="retention-label">Moderate Fit</span>
                <span className="retention-rate warning">{(analyticsData.retentionRates.moderate_fit * 100).toFixed(1)}%</span>
              </div>
              
              <div className="retention-item">
                <span className="retention-label">Low Fit</span>
                <span className="retention-rate danger">{(analyticsData.retentionRates.low_fit * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Onboarding Success */}
          <div className="analytics-card">
            <h3>Onboarding Success Rates</h3>
            <div className="onboarding-metrics">
              <div className="onboarding-item">
                <span className="onboarding-label">Cultural Training</span>
                <span className="onboarding-rate">{(analyticsData.onboardingSuccess.cultural_training * 100).toFixed(1)}%</span>
              </div>
              
              <div className="onboarding-item">
                <span className="onboarding-label">Mentorship Programs</span>
                <span className="onboarding-rate">{(analyticsData.onboardingSuccess.mentorship_programs * 100).toFixed(1)}%</span>
              </div>
              
              <div className="onboarding-item">
                <span className="onboarding-label">Team Integration</span>
                <span className="onboarding-rate">{(analyticsData.onboardingSuccess.team_integration * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="analytics-card recommendations">
            <h3>🎯 Diversity Improvement Recommendations</h3>
            <div className="recommendations-list">
              <div className="recommendation-item">
                <span className="rec-icon">📈</span>
                <div className="rec-content">
                  <h4>Increase Mixed Communication Styles</h4>
                  <p>Consider candidates who adapt their communication based on context</p>
                </div>
              </div>
              
              <div className="recommendation-item">
                <span className="rec-icon">🤝</span>
                <div className="rec-content">
                  <h4>Enhance Cultural Onboarding</h4>
                  <p>Invest in cultural training programs to improve retention rates</p>
                </div>
              </div>
              
              <div className="recommendation-item">
                <span className="rec-icon">🌍</span>
                <div className="rec-content">
                  <h4>Expand Language Diversity</h4>
                  <p>Actively recruit bilingual candidates to improve team communication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiversityAnalytics;
