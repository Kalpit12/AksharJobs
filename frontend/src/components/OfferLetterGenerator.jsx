import React, { useState, useEffect } from 'react';
import '../styles/OfferLetterGenerator.css';

const OfferLetterGenerator = ({ candidateId, jobId, candidateData, onClose, onSend }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [offerData, setOfferData] = useState({
    candidateName: '',
    position: '',
    department: '',
    startDate: '',
    salary: '',
    benefits: '',
    reportingTo: '',
    workLocation: '',
    employmentType: 'full-time',
    probationPeriod: '3 months',
    noticePeriod: '2 weeks'
  });
  
  const [customFields, setCustomFields] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const templates = [
    {
      id: 'standard',
      name: 'Standard Offer Letter',
      description: 'Professional template with standard terms'
    },
    {
      id: 'executive',
      name: 'Executive Offer Letter',
      description: 'Premium template for senior positions'
    },
    {
      id: 'contract',
      name: 'Contract Offer Letter',
      description: 'Template for contract/freelance positions'
    },
    {
      id: 'internship',
      name: 'Internship Offer Letter',
      description: 'Template for intern positions'
    }
  ];

  const benefitsOptions = [
    'Health Insurance',
    'Dental Insurance',
    'Vision Insurance',
    '401(k) Retirement Plan',
    'Paid Time Off',
    'Professional Development',
    'Remote Work Options',
    'Stock Options',
    'Performance Bonus',
    'Transportation Allowance'
  ];

  useEffect(() => {
    if (candidateData) {
      setOfferData(prev => ({
        ...prev,
        candidateName: candidateData.name || '',
        position: candidateData.position || '',
        department: candidateData.department || ''
      }));
    }
  }, [candidateData]);

  const handleInputChange = (field, value) => {
    setOfferData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBenefitsChange = (benefit, checked) => {
    if (checked) {
      setOfferData(prev => ({
        ...prev,
        benefits: prev.benefits ? `${prev.benefits}, ${benefit}` : benefit
      }));
    } else {
      setOfferData(prev => ({
        ...prev,
        benefits: prev.benefits
          .split(', ')
          .filter(b => b !== benefit)
          .join(', ')
      }));
    }
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      label: '',
      value: '',
      type: 'text'
    };
    setCustomFields(prev => [...prev, newField]);
  };

  const updateCustomField = (id, field, value) => {
    setCustomFields(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const removeCustomField = (id) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const generateOfferLetter = () => {
    setIsGenerating(true);
    // Simulate generation time
    setTimeout(() => {
      setIsGenerating(false);
      setPreviewMode(true);
    }, 2000);
  };

  const sendOfferLetter = async () => {
    try {
      const offerLetterData = {
        ...offerData,
        customFields,
        template: selectedTemplate,
        candidateId,
        jobId,
        generatedAt: new Date().toISOString()
      };
      
      // TODO: API call to send offer letter
      // await axios.post('/api/offer-letters', offerLetterData);
      
      onSend(offerLetterData);
    } catch (error) {
      console.error('Error sending offer letter:', error);
    }
  };

  const renderOfferLetterPreview = () => {
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div className="offer-letter-preview">
        <div className="letter-header">
          <h2>OFFER OF EMPLOYMENT</h2>
          <p className="letter-date">{today}</p>
        </div>

        <div className="letter-content">
          <p>Dear {offerData.candidateName},</p>
          
          <p>We are pleased to offer you the position of <strong>{offerData.position}</strong> 
          in our <strong>{offerData.department}</strong> department. This offer is contingent upon 
          the successful completion of all pre-employment requirements.</p>

          <div className="offer-details">
            <h3>Position Details:</h3>
            <ul>
              <li><strong>Position:</strong> {offerData.position}</li>
              <li><strong>Department:</strong> {offerData.department}</li>
              <li><strong>Employment Type:</strong> {offerData.employmentType}</li>
              <li><strong>Start Date:</strong> {offerData.startDate}</li>
              <li><strong>Reporting To:</strong> {offerData.reportingTo}</li>
              <li><strong>Work Location:</strong> {offerData.workLocation}</li>
            </ul>
          </div>

          <div className="compensation-details">
            <h3>Compensation & Benefits:</h3>
            <ul>
              <li><strong>Annual Salary:</strong> ${offerData.salary}</li>
              <li><strong>Benefits:</strong> {offerData.benefits}</li>
            </ul>
          </div>

          <div className="terms-details">
            <h3>Terms & Conditions:</h3>
            <ul>
              <li><strong>Probation Period:</strong> {offerData.probationPeriod}</li>
              <li><strong>Notice Period:</strong> {offerData.noticePeriod}</li>
            </ul>
          </div>

          {customFields.length > 0 && (
            <div className="custom-details">
              <h3>Additional Terms:</h3>
              <ul>
                {customFields.map(field => (
                  <li key={field.id}>
                    <strong>{field.label}:</strong> {field.value}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p>Please review this offer carefully. If you have any questions or need clarification 
          on any terms, please don't hesitate to contact us.</p>

          <p>We look forward to welcoming you to our team!</p>

          <div className="letter-signature">
            <p>Sincerely,</p>
            <p><strong>HR Department</strong><br />
            Company Name</p>
          </div>
        </div>
      </div>
    );
  };

  if (previewMode) {
    return (
      <div className="offer-letter-overlay">
        <div className="offer-letter-modal preview-mode">
          <div className="modal-header">
            <h2>Offer Letter Preview</h2>
            <div className="header-actions">
              <button className="btn-secondary" onClick={() => setPreviewMode(false)}>
                Edit
              </button>
              <button className="btn-primary" onClick={sendOfferLetter}>
                Send Offer Letter
              </button>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>
          </div>
          <div className="preview-content">
            {renderOfferLetterPreview()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="offer-letter-overlay">
      <div className="offer-letter-modal">
        <div className="modal-header">
          <h2>Generate Offer Letter</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="template-selection">
            <h3>Select Template</h3>
            <div className="template-grid">
              {templates.map(template => (
                <div 
                  key={template.id}
                  className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <h4>{template.name}</h4>
                  <p>{template.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="offer-details-form">
            <h3>Offer Details</h3>
            
            <div className="form-section">
              <h4>Basic Information</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Candidate Name *</label>
                  <input
                    type="text"
                    value={offerData.candidateName}
                    onChange={(e) => handleInputChange('candidateName', e.target.value)}
                    placeholder="Enter candidate name"
                  />
                </div>
                <div className="form-field">
                  <label>Position *</label>
                  <input
                    type="text"
                    value={offerData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Enter position title"
                  />
                </div>
                <div className="form-field">
                  <label>Department</label>
                  <input
                    type="text"
                    value={offerData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    placeholder="Enter department"
                  />
                </div>
                <div className="form-field">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={offerData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Compensation & Benefits</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Annual Salary *</label>
                  <input
                    type="text"
                    value={offerData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="Enter annual salary"
                  />
                </div>
                <div className="form-field">
                  <label>Employment Type</label>
                  <select
                    value={offerData.employmentType}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="benefits-section">
                <label>Benefits</label>
                <div className="benefits-grid">
                  {benefitsOptions.map(benefit => (
                    <label key={benefit} className="benefit-checkbox">
                      <input
                        type="checkbox"
                        checked={offerData.benefits.includes(benefit)}
                        onChange={(e) => handleBenefitsChange(benefit, e.target.checked)}
                      />
                      <span>{benefit}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Additional Details</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Reporting To</label>
                  <input
                    type="text"
                    value={offerData.reportingTo}
                    onChange={(e) => handleInputChange('reportingTo', e.target.value)}
                    placeholder="Enter manager name"
                  />
                </div>
                <div className="form-field">
                  <label>Work Location</label>
                  <input
                    type="text"
                    value={offerData.workLocation}
                    onChange={(e) => handleInputChange('workLocation', e.target.value)}
                    placeholder="Enter work location"
                  />
                </div>
                <div className="form-field">
                  <label>Probation Period</label>
                  <input
                    type="text"
                    value={offerData.probationPeriod}
                    onChange={(e) => handleInputChange('probationPeriod', e.target.value)}
                    placeholder="e.g., 3 months"
                  />
                </div>
                <div className="form-field">
                  <label>Notice Period</label>
                  <input
                    type="text"
                    value={offerData.noticePeriod}
                    onChange={(e) => handleInputChange('noticePeriod', e.target.value)}
                    placeholder="e.g., 2 weeks"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-header">
                <h4>Custom Fields</h4>
                <button className="btn-secondary btn-sm" onClick={addCustomField}>
                  + Add Field
                </button>
              </div>
              
              {customFields.map(field => (
                <div key={field.id} className="custom-field-row">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateCustomField(field.id, 'label', e.target.value)}
                    placeholder="Field label"
                    className="custom-field-label"
                  />
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => updateCustomField(field.id, 'value', e.target.value)}
                    placeholder="Field value"
                    className="custom-field-value"
                  />
                  <button 
                    className="btn-remove"
                    onClick={() => removeCustomField(field.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={generateOfferLetter}
              disabled={isGenerating || !offerData.candidateName || !offerData.position || !offerData.salary}
            >
              {isGenerating ? 'Generating...' : 'Generate Offer Letter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterGenerator;
