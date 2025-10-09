import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faLightbulb, 
  faSpinner, 
  faTrophy,
  faClock,
  faChartLine,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AIProjectRecommender.css';

const AIProjectRecommender = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');

  const getRecommendations = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/project-recommender'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getImpactColor = (impact) => {
    switch(impact) {
      case 'Very High': return '#8b5cf6';
      case 'High': return '#667eea';
      case 'Medium': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  return (
    <div className="ai-project-recommender">
      <div className="recommender-header">
        <h2><FontAwesomeIcon icon={faLightbulb} /> AI Project Recommender</h2>
        <p>Get personalized project suggestions to build your resume and skills</p>
      </div>

      {!projects && (
        <div className="recommender-intro">
          <div className="intro-content">
            <div className="intro-icon">💡</div>
            <h3>Discover Impactful Projects</h3>
            <p>Our AI will recommend projects based on your skills and goals that will:</p>
            <ul>
              <li>✓ Boost your resume value</li>
              <li>✓ Match your skill level and interests</li>
              <li>✓ Provide hands-on learning experience</li>
              <li>✓ Prepare you for full-time roles</li>
              <li>✓ Showcase your abilities to employers</li>
            </ul>
            
            <button 
              className="recommend-btn"
              onClick={getRecommendations}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Finding Perfect Projects...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faLightbulb} />
                  Get Project Recommendations
                </>
              )}
            </button>
            
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}

      {projects && (
        <div className="projects-container">
          <div className="projects-header">
            <div className="header-info">
              <h3>Recommended Projects for You</h3>
              <p className="personalization-note">{projects.personalization_note}</p>
            </div>
            <button className="refresh-btn" onClick={getRecommendations}>
              <FontAwesomeIcon icon={faLightbulb} /> Refresh
            </button>
          </div>

          <div className="projects-grid">
            {projects.recommended_projects.map((project, idx) => (
              <div key={idx} className="project-card">
                <div className="project-header">
                  <h4>{project.title}</h4>
                  <div className="project-badges">
                    <span 
                      className="difficulty-badge"
                      style={{ background: getDifficultyColor(project.difficulty) }}
                    >
                      {project.difficulty}
                    </span>
                    <span 
                      className="impact-badge"
                      style={{ background: getImpactColor(project.impact) }}
                    >
                      {project.impact} Impact
                    </span>
                  </div>
                </div>

                <p className="project-description">{project.description}</p>

                <div className="project-details">
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faClock} />
                    <span>Duration: {project.duration}</span>
                  </div>
                  <div className="detail-item">
                    <FontAwesomeIcon icon={faTrophy} />
                    <span>Resume Value: {project.resume_value}/10</span>
                  </div>
                </div>

                <div className="skills-section">
                  <strong>Skills You'll Learn:</strong>
                  <div className="skill-tags">
                    {project.skills_learned.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="deliverables-section">
                  <strong>Deliverables:</strong>
                  <ul>
                    {project.deliverables.map((deliverable, i) => (
                      <li key={i}>{deliverable}</li>
                    ))}
                  </ul>
                </div>

                <button className="start-project-btn">
                  <FontAwesomeIcon icon={faStar} /> Start This Project
                </button>
              </div>
            ))}
          </div>

          <div className="tips-section">
            <h4><FontAwesomeIcon icon={faLightbulb} /> Pro Tips</h4>
            <div className="tips-grid">
              {projects.tips.map((tip, idx) => (
                <div key={idx} className="tip-card">
                  <span className="tip-number">{idx + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ai-footer">
            <FontAwesomeIcon icon={faLightbulb} />
            <span>AI Recommendations • Confidence: {(projects.ai_confidence * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIProjectRecommender;

