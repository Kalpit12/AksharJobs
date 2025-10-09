import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faSpinner,
  faCheckCircle,
  faTimes,
  faExclamationTriangle,
  faThumbsUp,
  faThumbsDown,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AIApplicationReview.css';

const AIApplicationReview = ({ applicationId, onReviewComplete }) => {
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');

  const reviewApplication = async () => {
    if (!applicationId) {
      setError('No application selected');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/application-review'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId })
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setReview(data);
        if (onReviewComplete) {
          onReviewComplete(data);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to review application');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation.includes('Strong Yes')) return { icon: faCheckCircle, color: '#10b981' };
    if (recommendation.includes('Yes')) return { icon: faThumbsUp, color: '#3b82f6' };
    if (recommendation.includes('Maybe')) return { icon: faQuestionCircle, color: '#f59e0b' };
    return { icon: faThumbsDown, color: '#ef4444' };
  };

  return (
    <div className="ai-application-review">
      {!review && (
        <div className="review-trigger">
          <button 
            className="ai-review-btn"
            onClick={reviewApplication}
            disabled={loading}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                AI Analyzing...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRobot} />
                AI Quick Review
              </>
            )}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </div>
      )}

      {review && (
        <div className="review-results">
          <div className="review-header">
            <h3>
              <FontAwesomeIcon icon={faRobot} />
              AI Application Analysis
            </h3>
            <button className="close-review" onClick={() => setReview(null)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Score Overview */}
          <div className="score-overview">
            <div className="score-circle" style={{ borderColor: getScoreColor(review.overall_score) }}>
              <div className="score-value" style={{ color: getScoreColor(review.overall_score) }}>
                {review.overall_score}
              </div>
              <div className="score-label">Match Score</div>
            </div>

            <div className="recommendation-box">
              <div 
                className="recommendation-icon"
                style={{ color: getRecommendationIcon(review.recommendation).color }}
              >
                <FontAwesomeIcon icon={getRecommendationIcon(review.recommendation).icon} />
              </div>
              <div className="recommendation-text">
                <div className="recommendation-label">Recommendation</div>
                <div className="recommendation-value">{review.recommendation}</div>
              </div>
              <div className={`priority-badge priority-${review.priority.toLowerCase()}`}>
                {review.priority} Priority
              </div>
            </div>
          </div>

          {/* Quick Summary */}
          <div className="quick-summary">
            <h4>Quick Summary</h4>
            <div className="summary-content">
              <pre>{review.summary}</pre>
            </div>
          </div>

          {/* Strengths & Concerns */}
          <div className="strengths-concerns">
            <div className="strengths-box">
              <h4>
                <FontAwesomeIcon icon={faCheckCircle} />
                Strengths
              </h4>
              <ul>
                {review.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div className="concerns-box">
              <h4>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                Areas of Concern
              </h4>
              <ul>
                {review.concerns.map((concern, idx) => (
                  <li key={idx}>{concern}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skills Analysis */}
          <div className="skills-analysis">
            <h4>Skills Match Analysis</h4>
            <div className="skills-match-bar">
              <div 
                className="match-fill"
                style={{ 
                  width: `${review.match_percentage}%`,
                  background: getScoreColor(review.match_percentage)
                }}
              />
            </div>
            <div className="skills-breakdown">
              <div className="matched-skills">
                <strong>Matched Skills ({review.skill_matches.length}):</strong>
                <div className="skill-tags">
                  {review.skill_matches.map((skill, idx) => (
                    <span key={idx} className="skill-tag matched">{skill}</span>
                  ))}
                </div>
              </div>
              {review.missing_skills.length > 0 && (
                <div className="missing-skills">
                  <strong>Missing Skills ({review.missing_skills.length}):</strong>
                  <div className="skill-tags">
                    {review.missing_skills.map((skill, idx) => (
                      <span key={idx} className="skill-tag missing">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Questions */}
          <div className="interview-questions">
            <h4>
              <FontAwesomeIcon icon={faQuestionCircle} />
              Suggested Interview Questions
            </h4>
            <ul>
              {review.suggested_interview_questions.map((question, idx) => (
                <li key={idx}>{question}</li>
              ))}
            </ul>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h4>Recommended Next Steps</h4>
            <div className="steps-list">
              {review.next_steps.map((step, idx) => (
                <div key={idx} className="step-item">
                  <span className="step-number">{idx + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Saved Badge */}
          <div className="time-saved-badge">
            ⏱️ Time Saved: {review.estimated_review_time_saved}
          </div>

          <div className="ai-confidence">
            <FontAwesomeIcon icon={faRobot} />
            <span>AI Review • Confidence: {(review.ai_confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIApplicationReview;

