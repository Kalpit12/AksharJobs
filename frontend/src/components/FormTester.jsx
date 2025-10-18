import React, { useState } from 'react';
import { generateTestData, validateFormData } from '../utils/formTestData';

const FormTester = ({ onFillForm }) => {
  const [testData, setTestData] = useState(generateTestData());
  const [validation, setValidation] = useState(null);

  const handleFillForm = () => {
    const validation = validateFormData(testData);
    setValidation(validation);
    onFillForm(testData);
  };

  const generateNewData = () => {
    const newData = generateTestData();
    setTestData(newData);
    setValidation(null);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'white',
      padding: '15px',
      border: '2px solid #ff8c42',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#ff8c42' }}>🧪 Form Tester</h4>
      
      <button 
        onClick={handleFillForm}
        style={{
          background: '#ff8c42',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginRight: '8px',
          marginBottom: '8px'
        }}
      >
        Fill Form
      </button>
      
      <button 
        onClick={generateNewData}
        style={{
          background: '#20b2aa',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '8px'
        }}
      >
        New Data
      </button>
      
      {validation && (
        <div style={{ marginTop: '10px', fontSize: '12px' }}>
          <div style={{ color: validation.isValid ? 'green' : 'red' }}>
            {validation.isValid ? '✅ Valid' : '❌ Invalid'}
          </div>
          <div>Fields: {validation.filledFields}/{validation.totalFields}</div>
          {validation.missingFields.length > 0 && (
            <div style={{ color: 'red' }}>
              Missing: {validation.missingFields.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormTester;
