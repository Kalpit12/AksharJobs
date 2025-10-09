import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import '../styles/ProgressBar.css';

const ProgressBar = ({ currentStep = 0, totalSteps = 4, showBadges = true }) => {
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const steps = [
    { id: 1, title: 'Create Account', description: 'Sign up and verify your email' },
    { id: 2, title: 'Complete Profile', description: 'Add your skills and experience' },
    { id: 3, title: 'Upload Resume', description: 'Upload your professional resume' },
    { id: 4, title: 'Start Matching', description: 'Find your perfect job match' }
  ];

  useEffect(() => {
    const newProgress = (currentStep / totalSteps) * 100;
    setProgress(newProgress);
    
    if (currentStep > 0 && currentStep === totalSteps) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  }, [currentStep, totalSteps]);

  const getStepIcon = (stepId) => {
    if (stepId < currentStep) {
      return <FontAwesomeIcon icon={faCheckCircle} className="step_icon completed" />;
    } else if (stepId === currentStep) {
      return <FontAwesomeIcon icon={faStar} className="step_icon current" />;
    } else {
      return <div className="step_icon pending">{stepId}</div>;
    }
  };

  const getBadge = (stepId) => {
    if (stepId <= currentStep) {
      return (
        <div className="step_badge">
          <FontAwesomeIcon icon={faTrophy} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="progress_bar_container">
      <div className="progress_bar_header">
        <h3 className="progress_bar_title">Profile Completion</h3>
        <div className="progress_percentage">{Math.round(progress)}%</div>
      </div>
      
      <div className="progress_bar_wrapper">
        <div className="progress_bar_track">
          <div 
            className="progress_bar_fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="progress_steps">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`progress_step ${step.id <= currentStep ? 'completed' : step.id === currentStep ? 'current' : 'pending'}`}
          >
            <div className="step_content">
              {getStepIcon(step.id)}
              <div className="step_info">
                <div className="step_title">{step.title}</div>
                <div className="step_description">{step.description}</div>
              </div>
              {showBadges && getBadge(step.id)}
            </div>
          </div>
        ))}
      </div>

      {showCelebration && (
        <div className="celebration_animation">
          <div className="celebration_text">
            <FontAwesomeIcon icon={faTrophy} />
            <span>Congratulations! Profile Complete!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
