import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, 
  faSpinner, 
  faCheckCircle,
  faLightbulb,
  faBook,
  faUsers,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AICareerPathAdvisor.css';

const AICareerPathAdvisor = () => {
  const [loading, setLoading] = useState(false);
  const [careerPath, setCareerPath] = useState(null);
  const [error, setError] = useState('');

  const generateCareerPath = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/career-path-advisor'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setCareerPath(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate career path');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-career-path-advisor">
      <div className="advisor-header">
        <h2><FontAwesomeIcon icon={faRocket} /> AI Career Path Advisor</h2>
        <p>Get your personalized 3-5 year career roadmap powered by AI</p>
      </div>

      {!careerPath && (
        <div className="advisor-intro">
          <div className="intro-content">
            <div className="intro-icon">🎯</div>
            <h3>Discover Your Career Journey</h3>
            <p>Our AI will analyze your profile and create a personalized roadmap showing:</p>
            <ul>
              <li>✓ Career progression milestones (1, 3, 5 years)</li>
              <li>✓ Skills to develop at each stage</li>
              <li>✓ Expected salary growth</li>
              <li>✓ Actionable next steps</li>
              <li>✓ Learning resources and recommendations</li>
            </ul>
            
            <button 
              className="generate-btn"
              onClick={generateCareerPath}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Generating Your Path...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faRocket} />
                  Generate My Career Path
                </>
              )}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {careerPath && (
        <div className="career-roadmap">
          <div className="roadmap-header">
            <h3>Your Personalized Career Roadmap</h3>
            <button className="regenerate-btn" onClick={generateCareerPath}>
              <FontAwesomeIcon icon={faRocket} /> Regenerate
            </button>
          </div>

          {/* Timeline */}
          <div className="career-timeline">
            {/* Current Position */}
            <div className="timeline-item current">
              <div className="timeline-marker">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="timeline-content">
                <div className="timeline-badge current-badge">Current Position</div>
                <h4>{careerPath.roadmap.current_position.title}</h4>
                <p className="timeline-date">{careerPath.roadmap.current_position.timeline}</p>
                <p className="focus">{careerPath.roadmap.current_position.focus}</p>
                <div className="action-items">
                  <strong>Key Actions:</strong>
                  <ul>
                    {careerPath.roadmap.current_position.key_actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Year 1-2 */}
            <div className="timeline-item short-term">
              <div className="timeline-marker">
                <span className="marker-number">1-2Y</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-badge short-term-badge">Short-term Goal</div>
                <h4>{careerPath.roadmap.year_1_2.title}</h4>
                <p className="timeline-date">{careerPath.roadmap.year_1_2.timeline}</p>
                <div className="salary-growth">
                  💰 Salary Increase: {careerPath.roadmap.year_1_2.salary_increase}
                </div>
                <p className="focus">{careerPath.roadmap.year_1_2.focus}</p>
                <div className="skills-needed">
                  <strong>Skills to Develop:</strong>
                  <div className="skill-tags">
                    {careerPath.roadmap.year_1_2.skills_to_develop.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="action-items">
                  <strong>Key Actions:</strong>
                  <ul>
                    {careerPath.roadmap.year_1_2.key_actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Year 3-4 */}
            <div className="timeline-item mid-term">
              <div className="timeline-marker">
                <span className="marker-number">3-4Y</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-badge mid-term-badge">Mid-term Goal</div>
                <h4>{careerPath.roadmap.year_3_4.title}</h4>
                <p className="timeline-date">{careerPath.roadmap.year_3_4.timeline}</p>
                <div className="salary-growth">
                  💰 Salary Increase: {careerPath.roadmap.year_3_4.salary_increase}
                </div>
                <p className="focus">{careerPath.roadmap.year_3_4.focus}</p>
                <div className="skills-needed">
                  <strong>Skills to Develop:</strong>
                  <div className="skill-tags">
                    {careerPath.roadmap.year_3_4.skills_to_develop.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="action-items">
                  <strong>Key Actions:</strong>
                  <ul>
                    {careerPath.roadmap.year_3_4.key_actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Year 5+ */}
            <div className="timeline-item long-term">
              <div className="timeline-marker">
                <span className="marker-number">5Y+</span>
              </div>
              <div className="timeline-content">
                <div className="timeline-badge long-term-badge">Long-term Goal</div>
                <h4>{careerPath.roadmap.year_5.title}</h4>
                <p className="timeline-date">{careerPath.roadmap.year_5.timeline}</p>
                <div className="salary-growth">
                  💰 Salary Increase: {careerPath.roadmap.year_5.salary_increase}
                </div>
                <p className="focus">{careerPath.roadmap.year_5.focus}</p>
                <div className="skills-needed">
                  <strong>Skills to Develop:</strong>
                  <div className="skill-tags">
                    {careerPath.roadmap.year_5.skills_to_develop.map((skill, idx) => (
                      <span key={idx} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="action-items">
                  <strong>Key Actions:</strong>
                  <ul>
                    {careerPath.roadmap.year_5.key_actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Sections */}
          <div className="recommendations-grid">
            {/* Immediate Actions */}
            <div className="recommendation-card">
              <div className="card-icon">
                <FontAwesomeIcon icon={faTrophy} />
              </div>
              <h4>Immediate Actions</h4>
              <ul>
                {careerPath.recommendations.immediate_actions.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>

            {/* Learning Resources */}
            <div className="recommendation-card">
              <div className="card-icon">
                <FontAwesomeIcon icon={faBook} />
              </div>
              <h4>Learning Resources</h4>
              {careerPath.recommendations.learning_resources.map((resource, idx) => (
                <div key={idx} className="resource-item">
                  <div className="resource-type">{resource.type}</div>
                  <div className="resource-title">{resource.title}</div>
                  {resource.platform && <div className="resource-platform">{resource.platform}</div>}
                  {resource.author && <div className="resource-author">by {resource.author}</div>}
                </div>
              ))}
            </div>

            {/* Networking Tips */}
            <div className="recommendation-card">
              <div className="card-icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h4>Networking Tips</h4>
              <ul>
                {careerPath.recommendations.networking_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="ai-footer">
            <FontAwesomeIcon icon={faLightbulb} />
            <span>Generated by AI • Confidence: {(careerPath.ai_confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICareerPathAdvisor;

