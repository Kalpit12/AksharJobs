import React, { useState } from 'react';
import '../styles/CulturalProfileBuilder.css';

const CulturalProfileBuilder = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const culturalQuestions = [
    {
      id: 'communication_style',
      question: 'How do you prefer to communicate in the workplace?',
      options: [
        { value: 'formal', label: 'Formal and structured communication', description: 'Prefer clear protocols and formal channels' },
        { value: 'informal', label: 'Casual and friendly communication', description: 'Comfortable with relaxed, direct conversations' },
        { value: 'mixed', label: 'Adapt based on context', description: 'Flexible approach depending on situation' }
      ]
    },
    {
      id: 'leadership_approach',
      question: 'What leadership style do you prefer working under?',
      options: [
        { value: 'hierarchical', label: 'Clear hierarchy and structure', description: 'Prefer defined roles and reporting lines' },
        { value: 'collaborative', label: 'Team-based decision making', description: 'Enjoy collaborative problem-solving' },
        { value: 'mentoring', label: 'Guidance and mentorship', description: 'Value learning and development support' }
      ]
    },
    {
      id: 'work_environment',
      question: 'What work environment energizes you most?',
      options: [
        { value: 'fast_paced', label: 'Fast-paced and dynamic', description: 'Thrive under pressure and quick changes' },
        { value: 'stable', label: 'Stable and predictable', description: 'Prefer consistent routines and clear expectations' },
        { value: 'creative', label: 'Creative and innovative', description: 'Enjoy brainstorming and new approaches' }
      ]
    },
    {
      id: 'team_dynamics',
      question: 'How do you prefer to work in teams?',
      options: [
        { value: 'specialized', label: 'Specialized roles and expertise', description: 'Each person has distinct responsibilities' },
        { value: 'cross_functional', label: 'Cross-functional collaboration', description: 'Work across different areas and skills' },
        { value: 'supportive', label: 'Supportive and nurturing', description: 'Focus on helping team members grow' }
      ]
    },
    {
      id: 'cultural_values',
      question: 'Which cultural values resonate most with you?',
      options: [
        { value: 'tradition', label: 'Respect for tradition and heritage', description: 'Value cultural customs and history' },
        { value: 'innovation', label: 'Innovation and progress', description: 'Embrace change and new ideas' },
        { value: 'community', label: 'Community and relationships', description: 'Prioritize people and connections' }
      ]
    },
    {
      id: 'language_preference',
      question: 'What is your preferred language for workplace communication?',
      options: [
        { value: 'english', label: 'English', description: 'Comfortable with English as primary language' },
        { value: 'swahili', label: 'Swahili', description: 'Prefer Swahili for daily communication' },
        { value: 'bilingual', label: 'Both English and Swahili', description: 'Fluently communicate in both languages' }
      ]
    },
    {
      id: 'work_life_balance',
      question: 'How do you view work-life balance?',
      options: [
        { value: 'flexible', label: 'Flexible and adaptable', description: 'Balance work with personal commitments' },
        { value: 'dedicated', label: 'Dedicated to work goals', description: 'Willing to invest extra time when needed' },
        { value: 'boundaries', label: 'Clear boundaries', description: 'Maintain strict separation between work and personal' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < culturalQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: API call to save cultural profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      try {
        const currentCandidateId = localStorage.getItem('currentCandidateId');
        if (currentCandidateId) {
          localStorage.setItem(`culturalProfile:${currentCandidateId}`, JSON.stringify(answers));
        }
      } catch {}
      onComplete(answers);
    } catch (error) {
      console.error('Failed to save cultural profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / culturalQuestions.length) * 100;
  const currentQuestion = culturalQuestions[currentStep];

  return (
    <div className="cultural-profile-overlay">
      <div className="cultural-profile-modal">
        <div className="modal-header">
          <h2>🌍 Cultural Profile Builder</h2>
          <p>Help us understand your workplace preferences and cultural values</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{currentStep + 1} of {culturalQuestions.length}</span>
        </div>

        <div className="question-container">
          <h3 className="question-text">{currentQuestion.question}</h3>
          
          <div className="options-container">
            {currentQuestion.options.map((option) => (
              <div
                key={option.value}
                className={`option-card ${answers[currentQuestion.id] === option.value ? 'selected' : ''}`}
                onClick={() => handleAnswer(currentQuestion.id, option.value)}
              >
                <div className="option-header">
                  <div className="radio-circle">
                    {answers[currentQuestion.id] === option.value && <div className="radio-dot"></div>}
                  </div>
                  <h4 className="option-label">{option.label}</h4>
                </div>
                <p className="option-description">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>
          
          {currentStep === culturalQuestions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < culturalQuestions.length}
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={nextStep}
              disabled={!answers[currentQuestion.id]}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CulturalProfileBuilder;
