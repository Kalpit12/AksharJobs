import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faWandMagicSparkles, 
  faSpinner, 
  faCopy,
  faCheckCircle,
  faEdit,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';
import { buildApiUrl, makeAuthenticatedRequest } from '../config/api';
import '../styles/AIJobDescriptionGenerator.css';

const AIJobDescriptionGenerator = ({ onGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [generatedJD, setGeneratedJD] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [inputData, setInputData] = useState({
    jobTitle: '',
    experienceLevel: 'Mid-Level',
    skills: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    workMode: 'Hybrid'
  });

  const handleInputChange = (e) => {
    setInputData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateDescription = async () => {
    if (!inputData.jobTitle) {
      setError('Please enter a job title');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const skillsArray = inputData.skills ? inputData.skills.split(',').map(s => s.trim()) : [];
      
      const response = await makeAuthenticatedRequest(
        buildApiUrl('/api/ai/job-description-generator'),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: inputData.jobTitle,
            companyName: inputData.companyName,
            experienceLevel: inputData.experienceLevel,
            skills: skillsArray,
            location: inputData.location,
            jobType: inputData.jobType,
            workMode: inputData.workMode
          })
        }
      );

      if (response && response.ok) {
        const data = await response.json();
        setGeneratedJD(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to generate job description');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedJD.generated_description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useDescription = () => {
    if (onGenerated) {
      onGenerated({
        description: generatedJD.generated_description,
        responsibilities: generatedJD.responsibilities,
        requirements: generatedJD.requirements,
        skills: generatedJD.seo_keywords
      });
    }
  };

  return (
    <div className="ai-jd-generator">
      <div className="generator-header">
        <h2><FontAwesomeIcon icon={faWandMagicSparkles} /> AI Job Description Generator</h2>
        <p>Generate compelling job descriptions in seconds</p>
      </div>

      <div className="generator-container">
        {/* Input Section */}
        <div className="input-section">
          <h3>Tell Us About the Role</h3>
          
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              name="jobTitle"
              value={inputData.jobTitle}
              onChange={handleInputChange}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience Level</label>
              <select name="experienceLevel" value={inputData.experienceLevel} onChange={handleInputChange}>
                <option value="Entry">Entry</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Director">Director</option>
              </select>
            </div>

            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" value={inputData.jobType} onChange={handleInputChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Key Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={inputData.skills}
              onChange={handleInputChange}
              placeholder="e.g., Python, React, Leadership"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={inputData.location}
                onChange={handleInputChange}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="form-group">
              <label>Work Mode</label>
              <select name="workMode" value={inputData.workMode} onChange={handleInputChange}>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <button 
            className="generate-jd-btn"
            onClick={generateDescription}
            disabled={loading || !inputData.jobTitle}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Generating with AI...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                Generate Job Description
              </>
            )}
          </button>

          {error && <div className="error-message">{error}</div>}
        </div>

        {/* Generated Output */}
        {generatedJD && (
          <div className="output-section">
            <div className="output-header">
              <h3>Generated Job Description</h3>
              <div className="output-actions">
                <button className="copy-btn" onClick={copyToClipboard}>
                  <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                {onGenerated && (
                  <button className="use-btn" onClick={useDescription}>
                    <FontAwesomeIcon icon={faEdit} />
                    Use This Description
                  </button>
                )}
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="quality-metrics">
              <div className="metric">
                <FontAwesomeIcon icon={faChartBar} />
                <span>Predicted Applications: <strong>{generatedJD.predicted_applications}</strong></span>
              </div>
              <div className="metric">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Diversity Score: <strong>{(generatedJD.diversity_score * 100).toFixed(0)}%</strong></span>
              </div>
              <div className="metric">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Readability: <strong>{(generatedJD.readability_score * 100).toFixed(0)}%</strong></span>
              </div>
            </div>

            {/* Full Description */}
            <div className="description-output">
              <pre>{generatedJD.generated_description}</pre>
            </div>

            {/* Quick Lists */}
            <div className="quick-lists">
              <div className="list-section">
                <h4>Responsibilities</h4>
                <ul>
                  {generatedJD.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="list-section">
                <h4>Requirements</h4>
                <ul>
                  {generatedJD.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Optimization Tips */}
            <div className="optimization-tips">
              <h4>💡 Optimization Tips</h4>
              <ul>
                {generatedJD.optimization_tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="ai-confidence">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              <span>AI Generated • Confidence: {(generatedJD.ai_confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIJobDescriptionGenerator;

