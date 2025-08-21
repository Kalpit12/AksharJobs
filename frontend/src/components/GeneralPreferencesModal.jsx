import React, { useState, useEffect } from 'react';
import '../styles/GeneralPreferencesModal.css';

const GeneralPreferencesModal = ({ isOpen, onClose, onSave, currentSettings = {} }) => {
  const [settings, setSettings] = useState({
    timeZone: 'UTC+3',
    dateFormat: 'DD/MM/YYYY',
    currency: 'KSH',
    ...currentSettings
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentSettings) {
      setSettings(prev => ({ ...prev, ...currentSettings }));
    }
  }, [isOpen, currentSettings]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(settings);
      onClose();
    } catch (error) {
      console.error('Error saving general preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const timeZones = [
    { value: 'UTC-12', label: 'UTC-12 (Baker Island)', offset: -12 },
    { value: 'UTC-11', label: 'UTC-11 (Samoa)', offset: -11 },
    { value: 'UTC-10', label: 'UTC-10 (Hawaii)', offset: -10 },
    { value: 'UTC-9', label: 'UTC-9 (Alaska)', offset: -9 },
    { value: 'UTC-8', label: 'UTC-8 (Pacific Time)', offset: -8 },
    { value: 'UTC-7', label: 'UTC-7 (Mountain Time)', offset: -7 },
    { value: 'UTC-6', label: 'UTC-6 (Central Time)', offset: -6 },
    { value: 'UTC-5', label: 'UTC-5 (Eastern Time)', offset: -5 },
    { value: 'UTC-4', label: 'UTC-4 (Atlantic Time)', offset: -4 },
    { value: 'UTC-3', label: 'UTC-3 (Brazil)', offset: -3 },
    { value: 'UTC-2', label: 'UTC-2 (South Georgia)', offset: -2 },
    { value: 'UTC-1', label: 'UTC-1 (Azores)', offset: -1 },
    { value: 'UTC+0', label: 'UTC+0 (London)', offset: 0 },
    { value: 'UTC+1', label: 'UTC+1 (Paris)', offset: 1 },
    { value: 'UTC+2', label: 'UTC+2 (Cairo)', offset: 2 },
    { value: 'UTC+3', label: 'UTC+3 (Moscow)', offset: 3 },
    { value: 'UTC+4', label: 'UTC+4 (Dubai)', offset: 4 },
    { value: 'UTC+5', label: 'UTC+5 (Tashkent)', offset: 5 },
    { value: 'UTC+5:30', label: 'UTC+5:30 (Mumbai)', offset: 5.5 },
    { value: 'UTC+6', label: 'UTC+6 (Dhaka)', offset: 6 },
    { value: 'UTC+7', label: 'UTC+7 (Bangkok)', offset: 7 },
    { value: 'UTC+8', label: 'UTC+8 (Beijing)', offset: 8 },
    { value: 'UTC+9', label: 'UTC+9 (Tokyo)', offset: 9 },
    { value: 'UTC+9:30', label: 'UTC+9:30 (Adelaide)', offset: 9.5 },
    { value: 'UTC+10', label: 'UTC+10 (Sydney)', offset: 10 },
    { value: 'UTC+11', label: 'UTC+11 (Solomon Islands)', offset: 11 },
    { value: 'UTC+12', label: 'UTC+12 (New Zealand)', offset: 12 }
  ];

  const dateFormats = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY', example: '12/25/2024', description: 'US Standard' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY', example: '25/12/2024', description: 'European Standard' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD', example: '2024-12-25', description: 'ISO Standard' },
    { value: 'MM-DD-YY', label: 'MM-DD-YY', example: '12-25-24', description: 'US Short' },
    { value: 'DD-MM-YY', label: 'DD-MM-YY', example: '25-12-24', description: 'European Short' },
    { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY', example: 'Dec 25, 2024', description: 'Written Format' }
  ];

  const currencies = [
    { code: 'KSH', name: 'Kenyan Shilling', symbol: 'KSH', description: 'Kenya' },
    { code: 'USD', name: 'US Dollar', symbol: '$', description: 'United States' },
    { code: 'EUR', name: 'Euro', symbol: '€', description: 'European Union' },
    { code: 'GBP', name: 'British Pound', symbol: '£', description: 'United Kingdom' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', description: 'Japan' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', description: 'Canada' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', description: 'Australia' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', description: 'Switzerland' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', description: 'China' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', description: 'India' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', description: 'Brazil' },
    { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', description: 'Mexico' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', description: 'South Korea' }
  ];

  const getCurrentTime = (timeZone) => {
    const now = new Date();
    const offset = timeZones.find(tz => tz.value === timeZone)?.offset || 0;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (offset * 3600000));
    return localTime.toLocaleTimeString('en-US', { 
      hour12: false, 
      timeZone: 'UTC',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="general-preferences-modal-overlay" onClick={onClose}>
      <div className="general-preferences-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>General Preferences</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Time Zone Selection */}
          <div className="setting-group">
            <h3>Time Zone</h3>
            <p className="setting-description">
              Set your local time zone for accurate time display
            </p>
            <div className="timezone-selector">
              <select
                value={settings.timeZone}
                onChange={(e) => setSettings(prev => ({ ...prev, timeZone: e.target.value }))}
                className="timezone-select"
              >
                {timeZones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
              <div className="current-time">
                <span className="time-label">Current time:</span>
                <span className="time-value">{getCurrentTime(settings.timeZone)}</span>
              </div>
            </div>
          </div>

          {/* Date Format Selection */}
          <div className="setting-group">
            <h3>Date Format</h3>
            <p className="setting-description">
              Choose your preferred date format
            </p>
            <div className="date-format-options">
              {dateFormats.map((format) => (
                <label 
                  key={format.value} 
                  className={`date-format-option ${settings.dateFormat === format.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="dateFormat"
                    value={format.value}
                    checked={settings.dateFormat === format.value}
                    onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                  />
                  <div className="format-content">
                    <div className="format-header">
                      <span className="format-label">{format.label}</span>
                      <span className="format-description">{format.description}</span>
                    </div>
                    <div className="format-example">{format.example}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="setting-group">
            <h3>Currency</h3>
            <p className="setting-description">
              Set your preferred currency for pricing and transactions
            </p>
            <div className="currency-options">
              {currencies.map((curr) => (
                <label 
                  key={curr.code} 
                  className={`currency-option ${settings.currency === curr.code ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="currency"
                    value={curr.code}
                    checked={settings.currency === curr.code}
                    onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  />
                  <div className="currency-content">
                    <div className="currency-symbol">{curr.symbol}</div>
                    <div className="currency-info">
                      <span className="currency-code">{curr.code}</span>
                      <span className="currency-name">{curr.name}</span>
                      <span className="currency-country">{curr.description}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preview Section */}
          <div className="setting-group">
            <h3>Preview</h3>
            <p className="setting-description">
              See how your settings will appear
            </p>
            <div className="preview-container">
              <div className="preview-item">
                <span className="preview-label">Time:</span>
                <span className="preview-value">{getCurrentTime(settings.timeZone)} {settings.timeZone}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Date:</span>
                <span className="preview-value">
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: settings.dateFormat.includes('MMM') ? 'short' : '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, settings.dateFormat.includes('-') ? '-' : '/')}
                </span>
              </div>
                                     <div className="preview-item">
                         <span className="preview-label">Price:</span>
                         <span className="preview-value">
                           {settings.currency === 'KSH' ? 'KSH 2,500' : `${currencies.find(c => c.code === settings.currency)?.symbol}99.99`}
                         </span>
                       </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralPreferencesModal;
