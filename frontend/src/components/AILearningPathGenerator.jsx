import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faSpinner, 
  faCheckCircle,
  faBook,
  faClock,
  faChartLine,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AILearningPathGenerator.css';

const AILearningPathGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState(null);
  const [error, setError] = useState('');

  const generateLearningPath = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/learning-path-generator'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setLearningPath(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate learning path');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseColor = (phase) => {
    const colors = {
      'phase_1': '#10b981',
      'phase_2': '#3b82f6',
      'phase_3': '#8b5cf6',
      'phase_4': '#f59e0b'
    };
    return colors[phase] || '#6b7280';
  };

  const getPhaseStatus = (status) => {
    const statusMap = {
      'current': { label: 'In Progress', color: '#10b981' },
      'upcoming': { label: 'Upcoming', color: '#6b7280' },
      'completed': { label: 'Completed', color: '#667eea' }
    };
    return statusMap[status] || statusMap['upcoming'];
  };

  return (
    <div className="ai-learning-path-generator">
      <div className="generator-header">
        <h2><FontAwesomeIcon icon={faGraduationCap} /> AI Learning Path Generator</h2>
        <p>Get a structured learning plan tailored to your internship and career goals</p>
      </div>

      {!learningPath && (
        <div className="generator-intro">
          <div className="intro-content">
            <div className="intro-icon">📚</div>
            <h3>Your Personalized Learning Journey</h3>
            <p>Our AI will create a week-by-week learning plan including:</p>
            <ul>
              <li>✓ 4 Learning phases with specific topics</li>
              <li>✓ Curated resources (courses, books, workshops)</li>
              <li>✓ Weekly schedule and milestones</li>
              <li>✓ Skill progression tracking</li>
              <li>✓ Practical learning tips</li>
            </ul>
            
            <button 
              className="generate-btn"
              onClick={generateLearningPath}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Creating Your Learning Path...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Generate Learning Path
                </>
              )}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {learningPath && (
        <div className="learning-path-container">
          <div className="path-header">
            <div className="header-info">
              <h3>Your {learningPath.total_duration_weeks}-Week Learning Plan</h3>
              <p>Estimated {learningPath.estimated_hours} hours total</p>
            </div>
            <button className="refresh-btn" onClick={generateLearningPath}>
              <FontAwesomeIcon icon={faGraduationCap} /> Refresh
            </button>
          </div>

          {/* Skill Progression Summary */}
          <div className="skill-progression">
            <h4>Your Skill Progression</h4>
            <div className="progression-bar">
              <div className="progression-level start">
                {learningPath.skill_progression.current_level}
              </div>
              <div className="progression-arrow">
                <div className="arrow-line"></div>
                <div className="arrow-head">→</div>
              </div>
              <div className="progression-level end">
                {learningPath.skill_progression.target_level}
              </div>
            </div>
            <div className="progression-confidence">
              Success Probability: <strong>{learningPath.skill_progression.confidence}</strong>
            </div>
          </div>

          {/* Learning Phases */}
          <div className="learning-phases">
            <h4><FontAwesomeIcon icon={faBook} /> Learning Phases</h4>
            <div className="phases-grid">
              {Object.entries(learningPath.learning_plan).map(([phaseKey, phase], idx) => {
                const phaseNum = idx + 1;
                const statusInfo = getPhaseStatus(phase.status);
                
                return (
                  <div 
                    key={phaseKey} 
                    className={`phase-card ${phase.status}`}
                    style={{ borderTopColor: getPhaseColor(phaseKey) }}
                  >
                    <div className="phase-header">
                      <div className="phase-number" style={{ background: getPhaseColor(phaseKey) }}>
                        Phase {phaseNum}
                      </div>
                      <span 
                        className="phase-status"
                        style={{ color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="phase-week">Week {phase.week}</div>

                    <div className="phase-topics">
                      <strong>Topics:</strong>
                      <ul>
                        {phase.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="phase-resources">
                      <strong>Resources:</strong>
                      {phase.resources.map((resource, i) => (
                        <div key={i} className="resource-item">
                          <span className="resource-type">{resource.type}</span>
                          <span className="resource-title">{resource.title}</span>
                          <span className="resource-hours">{resource.hours}h</span>
                        </div>
                      ))}
                    </div>

                    <div className="phase-milestone">
                      <FontAwesomeIcon icon={faTrophy} />
                      <span>Milestone: {phase.milestone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="weekly-schedule">
            <h4><FontAwesomeIcon icon={faClock} /> Next 4 Weeks Schedule</h4>
            <div className="schedule-grid">
              {learningPath.weekly_schedule.map((week, idx) => (
                <div key={idx} className="week-card">
                  <div className="week-header">
                    <span className="week-number">Week {week.week}</span>
                    <span className="week-hours">{week.hours}h</span>
                  </div>
                  <div className="week-focus">{week.focus}</div>
                  <div className="week-activities">
                    {week.activities.map((activity, i) => (
                      <div key={i} className="activity-item">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Tips */}
          <div className="learning-tips">
            <h4><FontAwesomeIcon icon={faChartLine} /> Learning Tips for Success</h4>
            <div className="tips-list">
              {learningPath.tips.map((tip, idx) => (
                <div key={idx} className="tip-item">
                  <span className="tip-icon">💡</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-footer">
            <FontAwesomeIcon icon={faGraduationCap} />
            <span>AI Learning Plan • Confidence: {(learningPath.ai_confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AILearningPathGenerator;

