import React, { useState, useEffect } from 'react';
import '../styles/BillingModal.css';

const BillingModal = ({ isOpen, onClose, onSave, currentBilling = {} }) => {
  const [billing, setBilling] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    ...currentBilling
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && currentBilling) {
      setBilling(prev => ({ ...prev, ...currentBilling }));
    }
  }, [isOpen, currentBilling]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(billing);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Error saving billing info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBilling(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBilling(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const countries = [
    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia', 'South Africa', 'Nigeria',
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Japan', 'India', 'Brazil', 'Mexico'
  ];

  if (!isOpen) return null;

  return (
    <div className="billing-modal-overlay" onClick={onClose}>
      <div className="billing-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Billing Information</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {!isEditing ? (
            <div className="billing-display">
              <div className="billing-section">
                <h3>Payment Method</h3>
                <div className="billing-info">
                  <div className="info-row">
                    <span className="info-label">Card Number:</span>
                    <span className="info-value">
                      {billing.cardNumber ? `•••• •••• •••• ${billing.cardNumber.slice(-4)}` : 'Not provided'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Card Holder:</span>
                    <span className="info-value">{billing.cardHolder || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Expiry Date:</span>
                    <span className="info-value">{billing.expiryDate || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="billing-section">
                <h3>Billing Address</h3>
                <div className="billing-info">
                  <div className="info-row">
                    <span className="info-label">Street:</span>
                    <span className="info-value">{billing.billingAddress.street || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">City:</span>
                    <span className="info-value">{billing.billingAddress.city || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">State:</span>
                    <span className="info-value">{billing.billingAddress.state || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">ZIP Code:</span>
                    <span className="info-value">{billing.billingAddress.zipCode || 'Not provided'}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Country:</span>
                    <span className="info-value">{billing.billingAddress.country || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              <div className="billing-actions">
                <button 
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Billing Information
                </button>
              </div>
            </div>
          ) : (
            <div className="billing-form">
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      value={billing.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input
                      type="text"
                      value={billing.cardHolder}
                      onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      value={billing.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      value={billing.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Billing Address</h3>
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={billing.billingAddress.street}
                      onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                      placeholder="123 Main St"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={billing.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={billing.billingAddress.state}
                      onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ZIP Code</label>
                    <input
                      type="text"
                      value={billing.billingAddress.zipCode}
                      onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={billing.billingAddress.country}
                      onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          {isEditing && (
            <button 
              className="btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Cancel Edit
            </button>
          )}
          {isEditing ? (
            <button 
              className="btn-primary" 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => setIsEditing(true)}
            >
              Edit Information
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingModal;
