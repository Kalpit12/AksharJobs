import React, { useState } from 'react';
import '../styles/CompanyCultureAssessment.css';

const CompanyCultureAssessment = ({ onComplete, onClose, companyData = {} }) => {
  const [cultureData, setCultureData] = useState({
    company_name: companyData.companyName || '',
    industry: companyData.industry || '',
    company_size: '',
    work_environment: '',
    communication_style: '',
    leadership_approach: '',
    team_dynamics: '',
    cultural_values: [],
    language_policy: '',
    work_life_balance: '',
    diversity_commitment: '',
    growth_opportunities: '',
    additional_notes: ''
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    {
      id: 'basic_info',
      title: 'Company Information',
      fields: ['company_name', 'industry', 'company_size']
    },
    {
      id: 'workplace_culture',
      title: 'Workplace Culture',
      fields: ['work_environment', 'communication_style', 'leadership_approach']
    },
    {
      id: 'team_values',
      title: 'Team & Values',
      fields: ['team_dynamics', 'cultural_values', 'language_policy']
    },
    {
      id: 'policies',
      title: 'Policies & Growth',
      fields: ['work_life_balance', 'diversity_commitment', 'growth_opportunities']
    },
    {
      id: 'additional',
      title: 'Additional Details',
      fields: ['additional_notes']
    }
  ];

  const fieldOptions = {
    company_size: [
      { value: 'startup', label: 'Startup (1-10 employees)' },
      { value: 'small', label: 'Small (11-50 employees)' },
      { value: 'medium', label: 'Medium (51-200 employees)' },
      { value: 'large', label: 'Large (200+ employees)' }
    ],
    work_environment: [
      { value: 'fast_paced', label: 'Fast-paced and dynamic' },
      { value: 'stable', label: 'Stable and predictable' },
      { value: 'creative', label: 'Creative and innovative' },
      { value: 'traditional', label: 'Traditional and structured' }
    ],
    communication_style: [
      { value: 'formal', label: 'Formal and structured' },
      { value: 'informal', label: 'Casual and friendly' },
      { value: 'mixed', label: 'Adapt based on context' },
      { value: 'open', label: 'Open and transparent' }
    ],
    leadership_approach: [
      { value: 'hierarchical', label: 'Clear hierarchy and structure' },
      { value: 'collaborative', label: 'Team-based decision making' },
      { value: 'mentoring', label: 'Guidance and mentorship' },
      { value: 'flat', label: 'Flat organizational structure' }
    ],
    team_dynamics: [
      { value: 'specialized', label: 'Specialized roles and expertise' },
      { value: 'cross_functional', label: 'Cross-functional collaboration' },
      { value: 'supportive', label: 'Supportive and nurturing' },
      { value: 'competitive', label: 'Competitive and results-driven' }
    ],
    language_policy: [
      { value: 'english', label: 'English as primary language' },
      { value: 'swahili', label: 'Swahili as primary language' },
      { value: 'bilingual', label: 'Both English and Swahili' },
      { value: 'flexible', label: 'Flexible language policy' }
    ],
    work_life_balance: [
      { value: 'flexible', label: 'Flexible working hours' },
      { value: 'structured', label: 'Structured 9-5 schedule' },
      { value: 'remote', label: 'Remote work options' },
      { value: 'hybrid', label: 'Hybrid work model' }
    ],
    diversity_commitment: [
      { value: 'high', label: 'High priority on diversity' },
      { value: 'moderate', label: 'Moderate commitment' },
      { value: 'growing', label: 'Growing focus on diversity' },
      { value: 'traditional', label: 'Traditional approach' }
    ],
    growth_opportunities: [
      { value: 'extensive', label: 'Extensive training and development' },
      { value: 'moderate', label: 'Moderate growth opportunities' },
      { value: 'on_job', label: 'On-the-job learning' },
      { value: 'limited', label: 'Limited formal development' }
    ]
  };

  const culturalValuesOptions = [
    'Innovation', 'Tradition', 'Excellence', 'Community', 'Integrity', 
    'Growth', 'Collaboration', 'Diversity', 'Sustainability', 'Customer Focus'
  ];

  const handleInputChange = (field, value) => {
    setCultureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCulturalValuesChange = (value) => {
    setCultureData(prev => ({
      ...prev,
      cultural_values: prev.cultural_values.includes(value)
        ? prev.cultural_values.filter(v => v !== value)
        : [...prev.cultural_values, value]
    }));
  };

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: API call to save company culture assessment
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          localStorage.setItem(`companyCulture:${userId}`, JSON.stringify(cultureData));
        }
      } catch {}
      onComplete(cultureData);
    } catch (error) {
      console.error('Failed to save company culture assessment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  const renderField = (field) => {
    if (field === 'cultural_values') {
      return (
        <div className="field-group">
          <label>Select Cultural Values (Choose up to 5):</label>
          <div className="values-grid">
            {culturalValuesOptions.map(value => (
              <label key={value} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={cultureData.cultural_values.includes(value)}
                  onChange={() => handleCulturalValuesChange(value)}
                  disabled={cultureData.cultural_values.length >= 5 && !cultureData.cultural_values.includes(value)}
                />
                <span className="checkbox-label">{value}</span>
              </label>
            ))}
          </div>
        </div>
      );
    }

    if (field === 'additional_notes') {
      return (
        <div className="field-group">
          <label>Additional Notes:</label>
          <textarea
            value={cultureData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder="Describe any other aspects of your company culture..."
            rows={4}
          />
        </div>
      );
    }

    if (fieldOptions[field]) {
      return (
        <div className="field-group">
          <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
          <select
            value={cultureData[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
          >
            <option value="">Select an option</option>
            {fieldOptions[field].map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="field-group">
        <label>{field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
        <input
          type="text"
          value={cultureData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`Enter ${field.replace(/_/g, ' ')}`}
        />
      </div>
    );
  };

  return (
    <div className="company-culture-overlay">
      <div className="company-culture-modal">
        <div className="modal-header">
          <h2>🏢 Company Culture Assessment</h2>
          <p>Define your workplace culture to find the best cultural fit candidates</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{currentSection + 1} of {sections.length}</span>
        </div>

        <div className="section-container">
          <h3 className="section-title">{currentSectionData.title}</h3>
          
          <div className="fields-container">
            {currentSectionData.fields.map(field => (
              <div key={field} className="field-wrapper">
                {renderField(field)}
              </div>
            ))}
          </div>
        </div>

        <div className="modal-actions">
          <button 
            className="btn btn-secondary" 
            onClick={prevSection}
            disabled={currentSection === 0}
          >
            ← Previous
          </button>
          
          {currentSection === sections.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Complete Assessment'}
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={nextSection}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCultureAssessment;
