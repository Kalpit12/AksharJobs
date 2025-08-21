import React, { useState, useEffect } from 'react';
import '../styles/InterviewScorecard.css';

const InterviewScorecard = ({ candidateId, jobId, onSave, onClose }) => {
  const [scorecard, setScorecard] = useState({
    technicalSkills: { score: 0, notes: '' },
    communication: { score: 0, notes: '' },
    problemSolving: { score: 0, notes: '' },
    culturalFit: { score: 0, notes: '' },
    experience: { score: 0, notes: '' },
    overall: { score: 0, notes: '' }
  });
  
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    position: '',
    interviewer: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load existing scorecard if available
    loadExistingScorecard();
  }, [candidateId, jobId]);

  const loadExistingScorecard = async () => {
    try {
      // TODO: API call to load existing scorecard
      // const response = await axios.get(`/api/scorecards/${candidateId}/${jobId}`);
      // if (response.data) setScorecard(response.data);
    } catch (error) {
      console.log('No existing scorecard found');
    }
  };

  const handleScoreChange = (category, score) => {
    setScorecard(prev => ({
      ...prev,
      [category]: { ...prev[category], score: parseInt(score) }
    }));
  };

  const handleNotesChange = (category, notes) => {
    setScorecard(prev => ({
      ...prev,
      [category]: { ...prev[category], notes }
    }));
  };

  const calculateOverallScore = () => {
    const categories = ['technicalSkills', 'communication', 'problemSolving', 'culturalFit', 'experience'];
    const totalScore = categories.reduce((sum, cat) => sum + scorecard[cat].score, 0);
    return Math.round(totalScore / categories.length);
  };

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Exceptional';
    if (score >= 7) return 'Good';
    if (score >= 5) return 'Average';
    if (score >= 3) return 'Below Average';
    return 'Poor';
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const overallScore = calculateOverallScore();
      const finalScorecard = {
        ...scorecard,
        overall: { score: overallScore, notes: scorecard.overall.notes },
        candidateId,
        jobId,
        ...candidateInfo,
        submittedAt: new Date().toISOString()
      };
      
      // TODO: API call to save scorecard
      // await axios.post('/api/scorecards', finalScorecard);
      
      onSave(finalScorecard);
    } catch (error) {
      console.error('Error saving scorecard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="interview-scorecard-overlay">
      <div className="interview-scorecard-modal">
        <div className="scorecard-header">
          <h2>Interview Scorecard</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="candidate-info-section">
          <div className="info-row">
            <div className="info-field">
              <label>Candidate Name:</label>
              <input
                type="text"
                value={candidateInfo.name}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter candidate name"
              />
            </div>
            <div className="info-field">
              <label>Position:</label>
              <input
                type="text"
                value={candidateInfo.position}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Enter position"
              />
            </div>
          </div>
          <div className="info-row">
            <div className="info-field">
              <label>Interviewer:</label>
              <input
                type="text"
                value={candidateInfo.interviewer}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, interviewer: e.target.value }))}
                placeholder="Enter interviewer name"
              />
            </div>
            <div className="info-field">
              <label>Interview Date:</label>
              <input
                type="date"
                value={candidateInfo.date}
                onChange={(e) => setCandidateInfo(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="scorecard-criteria">
          {Object.entries(scorecard).map(([category, data]) => {
            if (category === 'overall') return null;
            
            return (
              <div key={category} className="criteria-item">
                <div className="criteria-header">
                  <h3>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h3>
                  <div className="score-input">
                    <label>Score:</label>
                    <select
                      value={data.score}
                      onChange={(e) => handleScoreChange(category, e.target.value)}
                    >
                      <option value={0}>Select Score</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
                        <option key={score} value={score}>{score}</option>
                      ))}
                    </select>
                    {data.score > 0 && (
                      <span className="score-label">{getScoreLabel(data.score)}</span>
                    )}
                  </div>
                </div>
                <div className="criteria-notes">
                  <label>Notes:</label>
                  <textarea
                    value={data.notes}
                    onChange={(e) => handleNotesChange(category, e.target.value)}
                    placeholder={`Add notes about ${category.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
                    rows={3}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="overall-assessment">
          <h3>Overall Assessment</h3>
          <div className="overall-score">
            <span className="score-display">
              Overall Score: <strong>{calculateOverallScore()}</strong>
            </span>
            {calculateOverallScore() > 0 && (
              <span className="score-label">{getScoreLabel(calculateOverallScore())}</span>
            )}
          </div>
          <div className="overall-notes">
            <label>Overall Notes & Recommendations:</label>
            <textarea
              value={scorecard.overall.notes}
              onChange={(e) => handleNotesChange('overall', e.target.value)}
              placeholder="Add overall assessment, recommendations, and next steps..."
              rows={4}
            />
          </div>
        </div>

        <div className="scorecard-actions">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSubmit}
            disabled={isSubmitting || !candidateInfo.name || !candidateInfo.position}
          >
            {isSubmitting ? 'Saving...' : 'Save Scorecard'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewScorecard;
