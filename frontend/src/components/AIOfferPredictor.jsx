import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faLightbulb,
  faClock,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AIOfferPredictor.css';

const AIOfferPredictor = ({ candidateId, candidateName }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [offerData, setOfferData] = useState({
    offeredSalary: '',
    candidateCurrentSalary: '',
    jobTitle: '',
    workMode: 'Hybrid',
    benefits: ''
  });

  const handleInputChange = (e) => {
    setOfferData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const predictAcceptance = async () => {
    if (!offerData.offeredSalary) {
      setError('Please enter the offered salary');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const benefitsArray = offerData.benefits ? offerData.benefits.split(',').map(b => b.trim()) : [];
      
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/offer-acceptance-predictor'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidateId: candidateId,
            offeredSalary: parseFloat(offerData.offeredSalary),
            candidateCurrentSalary: parseFloat(offerData.candidateCurrentSalary) || 0,
            jobTitle: offerData.jobTitle,
            workMode: offerData.workMode,
            benefits: benefitsArray
          })
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setPrediction(data);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to predict acceptance');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (prob) => {
    if (prob >= 75) return '#10b981';
    if (prob >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getRiskColor = (risk) => {
    if (risk === 'Low') return '#10b981';
    if (risk === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="ai-offer-predictor">
      {!showForm && !prediction && (
        <button 
          className="predict-btn"
          onClick={() => setShowForm(true)}
        >
          <FontAwesomeIcon icon={faChartLine} />
          Predict Offer Acceptance
        </button>
      )}

      {showForm && !prediction && (
        <div className="predictor-form">
          <div className="form-header">
            <h3>
              <FontAwesomeIcon icon={faChartLine} />
              Offer Details for {candidateName}
            </h3>
            <button onClick={() => setShowForm(false)} className="close-form">
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </button>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Offered Salary (Annual) *</label>
              <input
                type="number"
                name="offeredSalary"
                value={offerData.offeredSalary}
                onChange={handleInputChange}
                placeholder="e.g., 120000"
                required
              />
            </div>

            <div className="form-group">
              <label>Candidate's Current Salary (if known)</label>
              <input
                type="number"
                name="candidateCurrentSalary"
                value={offerData.candidateCurrentSalary}
                onChange={handleInputChange}
                placeholder="e.g., 100000"
              />
            </div>

            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={offerData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="form-group">
              <label>Work Mode</label>
              <select name="workMode" value={offerData.workMode} onChange={handleInputChange}>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label>Benefits (comma-separated)</label>
              <input
                type="text"
                name="benefits"
                value={offerData.benefits}
                onChange={handleInputChange}
                placeholder="e.g., Health Insurance, 401k, PTO"
              />
            </div>

            <button 
              className="predict-submit-btn"
              onClick={predictAcceptance}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Analyzing...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChartLine} />
                  Predict Acceptance
                </>
              )}
            </button>

            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {prediction && (
        <div className="prediction-results">
          <div className="results-header">
            <h3>
              <FontAwesomeIcon icon={faChartLine} />
              Offer Acceptance Prediction
            </h3>
            <button className="new-prediction-btn" onClick={() => {
              setPrediction(null);
              setShowForm(true);
            }}>
              New Prediction
            </button>
          </div>

          {/* Main Probability Gauge */}
          <div className="probability-gauge">
            <div className="gauge-container">
              <svg viewBox="0 0 200 120" className="gauge-svg">
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 100 A 80 80 0 0 1 180 100"
                  fill="none"
                  stroke={getProbabilityColor(prediction.acceptance_probability)}
                  strokeWidth="20"
                  strokeLinecap="round"
                  strokeDasharray={`${prediction.acceptance_probability * 2.5} 1000`}
                />
                <text
                  x="100"
                  y="90"
                  textAnchor="middle"
                  fontSize="36"
                  fontWeight="bold"
                  fill={getProbabilityColor(prediction.acceptance_probability)}
                >
                  {prediction.acceptance_probability}%
                </text>
                <text
                  x="100"
                  y="110"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  Acceptance Probability
                </text>
              </svg>
            </div>

            <div className="confidence-info">
              <div className="info-item">
                <span className="label">Confidence:</span>
                <span className="value">{prediction.confidence_level}</span>
              </div>
              <div className="info-item">
                <span className="label">Risk Level:</span>
                <span 
                  className="value risk-badge"
                  style={{ background: getRiskColor(prediction.risk_level) }}
                >
                  {prediction.risk_level}
                </span>
              </div>
              {prediction.salary_increase_percent && (
                <div className="info-item">
                  <span className="label">Salary Increase:</span>
                  <span className="value increase-badge">
                    +{prediction.salary_increase_percent.toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Factors Analysis */}
          <div className="factors-analysis">
            <div className="positive-factors">
              <h4>
                <FontAwesomeIcon icon={faCheckCircle} />
                Positive Factors
              </h4>
              <ul>
                {prediction.positive_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>

            <div className="negative-factors">
              <h4>
                <FontAwesomeIcon icon={faExclamationTriangle} />
                Concerns
              </h4>
              <ul>
                {prediction.negative_factors.map((factor, idx) => (
                  <li key={idx}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-section">
            <h4>
              <FontAwesomeIcon icon={faLightbulb} />
              AI Recommendations to Improve Acceptance
            </h4>
            <div className="recommendations-list">
              {prediction.recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-item">
                  <span className="rec-number">{idx + 1}</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Negotiation Insights */}
          <div className="negotiation-insights">
            <h4>
              <FontAwesomeIcon icon={faHandshake} />
              Negotiation Insights
            </h4>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-label">Negotiation Likelihood</div>
                <div className="insight-value">{prediction.negotiation_likelihood}%</div>
                <div className="insight-bar">
                  <div 
                    className="bar-fill"
                    style={{ width: `${prediction.negotiation_likelihood}%` }}
                  />
                </div>
              </div>
              
              <div className="insight-card">
                <div className="insight-label">Counter-Offer Risk</div>
                <div 
                  className="insight-value risk"
                  style={{ color: getRiskColor(prediction.counter_offer_risk) }}
                >
                  {prediction.counter_offer_risk}
                </div>
              </div>

              <div className="insight-card">
                <div className="insight-label">Decision Timeline</div>
                <div className="insight-value">{prediction.estimated_decision_timeline}</div>
              </div>
            </div>

            {prediction.likely_negotiation_points.length > 0 && (
              <div className="negotiation-points">
                <strong>Likely Negotiation Points:</strong>
                <div className="points-tags">
                  {prediction.likely_negotiation_points.map((point, idx) => (
                    <span key={idx} className="point-tag">{point}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Optimal Timing */}
          <div className="optimal-timing">
            <h4>
              <FontAwesomeIcon icon={faClock} />
              Optimal Timing for Offer
            </h4>
            <div className="timing-grid">
              <div className="timing-item">
                <span className="timing-label">Best Day:</span>
                <span className="timing-value">{prediction.optimal_timing.best_day}</span>
              </div>
              <div className="timing-item">
                <span className="timing-label">Best Time:</span>
                <span className="timing-value">{prediction.optimal_timing.best_time}</span>
              </div>
              <div className="timing-item full-width">
                <span className="timing-label">Reasoning:</span>
                <span className="timing-value">{prediction.optimal_timing.reasoning}</span>
              </div>
            </div>
          </div>

          {/* Talking Points */}
          <div className="talking-points">
            <h4>Suggested Talking Points</h4>
            <ul>
              {prediction.suggested_talking_points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="ai-confidence">
            <FontAwesomeIcon icon={faChartLine} />
            <span>AI Prediction • Confidence: {(prediction.ai_confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIOfferPredictor;

