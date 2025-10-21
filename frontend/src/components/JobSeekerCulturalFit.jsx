import React, { useState, useEffect } from 'react';
// import '../styles/JobSeekerCulturalFit.css'; // Replaced by unified CSS

const JobSeekerCulturalFit = ({ isVisible, onClose, jobId, companyName }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [culturalProfile, setCulturalProfile] = useState({});
  const [companyCulture, setCompanyCulture] = useState({});
  const [culturalFitScore, setCulturalFitScore] = useState(0);
  const [onboardingGuide, setOnboardingGuide] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const culturalQuestions = [
    {
      id: 1,
      category: "Work Style",
      question: "How do you prefer to work?",
      options: [
        { value: "collaborative", label: "In teams with regular collaboration" },
        { value: "independent", label: "Independently with minimal supervision" },
        { value: "hybrid", label: "Mix of both depending on the task" }
      ]
    },
    {
      id: 2,
      category: "Communication",
      question: "What's your preferred communication style?",
      options: [
        { value: "direct", label: "Direct and straightforward" },
        { value: "diplomatic", label: "Diplomatic and considerate" },
        { value: "adaptive", label: "I adapt based on the situation" }
      ]
    },
    {
      id: 3,
      category: "Decision Making",
      question: "How do you approach decision making?",
      options: [
        { value: "analytical", label: "Analyze all options thoroughly" },
        { value: "intuitive", label: "Trust my gut feeling" },
        { value: "collaborative", label: "Seek input from others" }
      ]
    },
    {
      id: 4,
      category: "Work Environment",
      question: "What work environment energizes you most?",
      options: [
        { value: "fast-paced", label: "Fast-paced and dynamic" },
        { value: "structured", label: "Structured and organized" },
        { value: "creative", label: "Creative and flexible" }
      ]
    },
    {
      id: 5,
      category: "Leadership",
      question: "What's your leadership style preference?",
      options: [
        { value: "leading", label: "I prefer to lead and guide others" },
        { value: "supporting", label: "I prefer to support and collaborate" },
        { value: "both", label: "I can do both depending on the situation" }
      ]
    },
    {
      id: 6,
      category: "Learning",
      question: "How do you prefer to learn new things?",
      options: [
        { value: "hands-on", label: "Learning by doing and experimenting" },
        { value: "theoretical", label: "Understanding concepts first" },
        { value: "mentorship", label: "Learning from experienced people" }
      ]
    },
    {
      id: 7,
      category: "Work-Life Balance",
      question: "What's your ideal work-life balance?",
      options: [
        { value: "flexible", label: "Flexible hours and remote options" },
        { value: "structured", label: "Fixed hours with clear boundaries" },
        { value: "intense", label: "Intense periods with breaks" }
      ]
    },
    {
      id: 8,
      category: "Values",
      question: "What's most important to you in a workplace?",
      options: [
        { value: "innovation", label: "Innovation and creativity" },
        { value: "stability", label: "Stability and security" },
        { value: "growth", label: "Growth and development opportunities" }
      ]
    }
  ];

  const [answers, setAnswers] = useState({});

  useEffect(() => {
    if (isVisible) {
      // Load existing cultural profile if available
      const userId = localStorage.getItem('userId');
      if (userId) {
        const existingProfile = localStorage.getItem(`culturalProfile_${userId}`);
        if (existingProfile) {
          try {
            setCulturalProfile(JSON.parse(existingProfile));
          } catch (error) {
            console.log('Error loading existing profile');
          }
        }
      }
    }
  }, [isVisible]);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateCulturalFit = () => {
    // Simulate AI-powered cultural fit calculation
    const totalQuestions = culturalQuestions.length;
    let matchCount = 0;
    
    // Simple matching logic (in real implementation, this would be AI-powered)
    Object.keys(answers).forEach(questionId => {
      const question = culturalQuestions.find(q => q.id === parseInt(questionId));
      if (question && answers[questionId]) {
        // Simulate company culture preferences
        const companyPreferences = ['collaborative', 'diplomatic', 'analytical', 'structured', 'supporting', 'hands-on', 'flexible', 'growth'];
        if (companyPreferences.includes(answers[questionId])) {
          matchCount++;
        }
      }
    });
    
    const score = Math.round((matchCount / totalQuestions) * 100);
    setCulturalFitScore(score);
    
    // Generate onboarding guide based on score
    generateOnboardingGuide(score);
  };

  const generateOnboardingGuide = (score) => {
    const guides = [];
    
    if (score >= 80) {
      guides.push(
        "🎯 Excellent cultural fit! You'll likely integrate smoothly into this company's culture.",
        "💡 Focus on building relationships with team members who share similar values.",
        "🚀 You can be a cultural ambassador for new team members."
      );
    } else if (score >= 60) {
      guides.push(
        "✅ Good cultural alignment with some areas for adaptation.",
        "🔄 Be open to learning the company's specific communication styles.",
        "🤝 Seek mentorship from experienced team members."
      );
    } else {
      guides.push(
        "⚠️ Cultural fit may require more adaptation and learning.",
        "📚 Study the company's values and communication guidelines carefully.",
        "🆘 Don't hesitate to ask questions about company culture and expectations.",
        "⏰ Give yourself time to adjust to the new work environment."
      );
    }
    
    // Add general onboarding tips
    guides.push(
      "📅 Attend all orientation sessions and company events.",
      "👥 Build relationships with colleagues across different departments.",
      "📝 Keep a journal of cultural observations and learnings.",
      "🔄 Regularly check in with your manager about cultural integration."
    );
    
    setOnboardingGuide(guides);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      calculateCulturalFit();
      setIsLoading(false);
      setCurrentStep(3);
      
      // Save cultural profile
      const userId = localStorage.getItem('userId');
      if (userId) {
        localStorage.setItem(`culturalProfile_${userId}`, JSON.stringify(answers));
      }
    }, 2000);
  };

  const resetAssessment = () => {
    setAnswers({});
    setCulturalFitScore(0);
    setOnboardingGuide([]);
    setCurrentStep(1);
  };

  if (!isVisible) return null;

  return (
    <div className="cultural-fit-overlay">
      <div className="cultural-fit-modal">
        <div className="modal-header">
          <h2>🌍 AI-Powered Cultural Fit Assessment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {currentStep === 1 && (
          <div className="assessment-intro">
            <div className="intro-content">
              <h3>Discover Your Cultural Fit</h3>
              <p>Complete this assessment to understand how well you'll fit into {companyName}'s workplace culture.</p>
              <div className="benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🎯</span>
                  <span>Get personalized cultural insights</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📚</span>
                  <span>Receive tailored onboarding guidance</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🚀</span>
                  <span>Improve your workplace success</span>
                </div>
              </div>
              <button className="start-btn" onClick={() => setCurrentStep(2)}>
                Start Assessment
              </button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="assessment-questions">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${(Object.keys(answers).length / culturalQuestions.length) * 100}%` }}></div>
            </div>
            <div className="progress-text">
              Question {Object.keys(answers).length + 1} of {culturalQuestions.length}
            </div>
            
            {culturalQuestions.map((question, index) => (
              <div key={question.id} className={`question-container ${answers[question.id] ? 'answered' : ''}`}>
                <div className="question-header">
                  <span className="question-category">{question.category}</span>
                  <h4>{question.question}</h4>
                </div>
                <div className="question-options">
                  {question.options.map((option) => (
                    <label key={option.value} className={`option-label ${answers[question.id] === option.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        checked={answers[question.id] === option.value}
                        onChange={() => handleAnswer(question.id, option.value)}
                      />
                      <span className="option-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="assessment-actions">
              <button className="submit-btn" onClick={handleSubmit} disabled={Object.keys(answers).length < culturalQuestions.length}>
                {isLoading ? 'Analyzing...' : 'Get Cultural Fit Score'}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="results-section">
            <div className="fit-score-display">
              <h3>Your Cultural Fit Score</h3>
              <div className="score-circle">
                <span className="score-number">{culturalFitScore}%</span>
                <span className="score-label">Cultural Fit</span>
              </div>
              <div className="score-description">
                {culturalFitScore >= 80 ? 'Excellent Fit' : 
                 culturalFitScore >= 60 ? 'Good Fit' : 'Needs Adaptation'}
              </div>
            </div>

            <div className="onboarding-guide">
              <h4>🎯 Personalized Onboarding Guide</h4>
              <div className="guide-items">
                {onboardingGuide.map((guide, index) => (
                  <div key={index} className="guide-item">
                    <span className="guide-text">{guide}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-actions">
              <button className="retake-btn" onClick={resetAssessment}>
                Retake Assessment
              </button>
              <button className="close-results-btn" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerCulturalFit;
