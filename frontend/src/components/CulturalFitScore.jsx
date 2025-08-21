import React, { useState, useEffect } from 'react';
import '../styles/CulturalFitScore.css';

const CulturalFitScore = ({ candidateProfile, companyCulture, onClose }) => {
  const [fitScore, setFitScore] = useState(null);
  const [scoreBreakdown, setScoreBreakdown] = useState({});
  const [isCalculating, setIsCalculating] = useState(true);
  const [onboardingTips, setOnboardingTips] = useState([]);

  useEffect(() => {
    calculateCulturalFit();
  }, [candidateProfile, companyCulture]);

  const calculateCulturalFit = async () => {
    setIsCalculating(true);
    
    // Simulate AI calculation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Calculate cultural fit score based on profile compatibility
    const score = calculateCompatibilityScore();
    const breakdown = calculateScoreBreakdown();
    const tips = generateOnboardingTips(score, breakdown);
    
    setFitScore(score);
    setScoreBreakdown(breakdown);
    setOnboardingTips(tips);
    setIsCalculating(false);
  };

  const calculateCompatibilityScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    // Communication style compatibility
    if (candidateProfile.communication_style === companyCulture.communication_style) {
      totalScore += 20;
    } else if (
      (candidateProfile.communication_style === 'mixed' || companyCulture.communication_style === 'mixed') ||
      (candidateProfile.communication_style === 'informal' && companyCulture.communication_style === 'casual')
    ) {
      totalScore += 15;
    } else {
      totalScore += 5;
    }
    maxScore += 20;

    // Leadership approach compatibility
    if (candidateProfile.leadership_approach === companyCulture.leadership_approach) {
      totalScore += 20;
    } else if (
      (candidateProfile.leadership_approach === 'mentoring' && companyCulture.leadership_approach === 'collaborative') ||
      (candidateProfile.leadership_approach === 'collaborative' && companyCulture.leadership_approach === 'mentoring')
    ) {
      totalScore += 15;
    } else {
      totalScore += 5;
    }
    maxScore += 20;

    // Work environment compatibility
    if (candidateProfile.work_environment === companyCulture.work_environment) {
      totalScore += 20;
    } else if (
      (candidateProfile.work_environment === 'creative' && companyCulture.work_environment === 'fast_paced') ||
      (candidateProfile.work_environment === 'stable' && companyCulture.work_environment === 'traditional')
    ) {
      totalScore += 15;
    } else {
      totalScore += 5;
    }
    maxScore += 20;

    // Team dynamics compatibility
    if (candidateProfile.team_dynamics === companyCulture.team_dynamics) {
      totalScore += 20;
    } else if (
      (candidateProfile.team_dynamics === 'cross_functional' && companyCulture.team_dynamics === 'collaborative') ||
      (candidateProfile.team_dynamics === 'supportive' && companyCulture.team_dynamics === 'collaborative')
    ) {
      totalScore += 15;
    } else {
      totalScore += 5;
    }
    maxScore += 20;

    // Language preference compatibility
    if (candidateProfile.language_preference === companyCulture.language_policy) {
      totalScore += 20;
    } else if (
      candidateProfile.language_preference === 'bilingual' ||
      companyCulture.language_policy === 'flexible'
    ) {
      totalScore += 15;
    } else {
      totalScore += 5;
    }
    maxScore += 20;

    return Math.round((totalScore / maxScore) * 100);
  };

  const calculateScoreBreakdown = () => {
    return {
      communication: calculateCategoryScore('communication_style', 'communication_style'),
      leadership: calculateCategoryScore('leadership_approach', 'leadership_approach'),
      environment: calculateCategoryScore('work_environment', 'work_environment'),
      teamwork: calculateCategoryScore('team_dynamics', 'team_dynamics'),
      language: calculateCategoryScore('language_preference', 'language_policy')
    };
  };

  const calculateCategoryScore = (candidateField, companyField) => {
    const candidate = candidateProfile[candidateField];
    const company = companyCulture[companyField];
    
    if (candidate === company) return 100;
    if (
      (candidate === 'mixed' || company === 'mixed') ||
      (candidate === 'bilingual' || company === 'flexible')
    ) return 75;
    if (
      (candidate === 'informal' && company === 'casual') ||
      (candidate === 'mentoring' && company === 'collaborative') ||
      (candidate === 'creative' && company === 'fast_paced')
    ) return 60;
    return 25;
  };

  const generateOnboardingTips = (score, breakdown) => {
    const tips = [];
    
    if (score >= 80) {
      tips.push({
        type: 'success',
        title: 'Excellent Cultural Fit!',
        description: 'This candidate should integrate seamlessly into your team.'
      });
    } else if (score >= 60) {
      tips.push({
        type: 'warning',
        title: 'Good Potential with Support',
        description: 'Consider providing cultural onboarding support for optimal integration.'
      });
    } else {
      tips.push({
        type: 'info',
        title: 'Cultural Adaptation Required',
        description: 'This candidate will need significant cultural onboarding and support.'
      });
    }

    // Add specific tips based on breakdown
    if (breakdown.communication < 60) {
      tips.push({
        type: 'tip',
        title: 'Communication Style',
        description: 'Provide clear communication guidelines and consider language training if needed.'
      });
    }

    if (breakdown.leadership < 60) {
      tips.push({
        type: 'tip',
        title: 'Leadership Approach',
        description: 'Set clear expectations about decision-making processes and reporting structures.'
      });
    }

    if (breakdown.teamwork < 60) {
      tips.push({
        type: 'tip',
        title: 'Team Integration',
        description: 'Assign a team mentor to help with initial integration and relationship building.'
      });
    }

    return tips;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Fit';
    if (score >= 60) return 'Good Fit';
    if (score >= 40) return 'Moderate Fit';
    return 'Poor Fit';
  };

  if (isCalculating) {
    return (
      <div className="cultural-fit-overlay">
        <div className="cultural-fit-modal">
          <div className="calculating-container">
            <div className="loading-spinner"></div>
            <h3>Calculating Cultural Fit...</h3>
            <p>Our AI is analyzing compatibility between candidate and company culture</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cultural-fit-overlay">
      <div className="cultural-fit-modal">
        <div className="modal-header">
          <h2>🌍 Cultural Fit Assessment</h2>
          <p>AI-powered compatibility analysis between candidate and company culture</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="score-section">
          <div className="main-score">
            <div 
              className="score-circle" 
              style={{ 
                background: `conic-gradient(${getScoreColor(fitScore)} ${fitScore * 3.6}deg, #f3f4f6 0deg)` 
              }}
            >
              <div className="score-inner">
                <span className="score-number">{fitScore}%</span>
                <span className="score-label">{getScoreLabel(fitScore)}</span>
              </div>
            </div>
          </div>

          <div className="score-breakdown">
            <h4>Detailed Breakdown</h4>
            <div className="breakdown-items">
              <div className="breakdown-item">
                <span className="category">Communication</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scoreBreakdown.communication}%`, backgroundColor: getScoreColor(scoreBreakdown.communication) }}
                  ></div>
                </div>
                <span className="score">{scoreBreakdown.communication}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="category">Leadership</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scoreBreakdown.leadership}%`, backgroundColor: getScoreColor(scoreBreakdown.leadership) }}
                  ></div>
                </div>
                <span className="score">{scoreBreakdown.leadership}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="category">Work Environment</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scoreBreakdown.environment}%`, backgroundColor: getScoreColor(scoreBreakdown.environment) }}
                  ></div>
                </div>
                <span className="score">{scoreBreakdown.environment}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="category">Team Dynamics</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scoreBreakdown.teamwork}%`, backgroundColor: getScoreColor(scoreBreakdown.teamwork) }}
                  ></div>
                </div>
                <span className="score">{scoreBreakdown.teamwork}%</span>
              </div>
              
              <div className="breakdown-item">
                <span className="category">Language</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${scoreBreakdown.language}%`, backgroundColor: getScoreColor(scoreBreakdown.language) }}
                  ></div>
                </div>
                <span className="score">{scoreBreakdown.language}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="onboarding-tips">
          <h4>🎯 Cultural Onboarding Recommendations</h4>
          <div className="tips-container">
            {onboardingTips.map((tip, index) => (
              <div key={index} className={`tip-item ${tip.type}`}>
                <div className="tip-icon">
                  {tip.type === 'success' && '✅'}
                  {tip.type === 'warning' && '⚠️'}
                  {tip.type === 'info' && 'ℹ️'}
                  {tip.type === 'tip' && '💡'}
                </div>
                <div className="tip-content">
                  <h5>{tip.title}</h5>
                  <p>{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onClose}>
            Close Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CulturalFitScore;
