import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import '../styles/AdminDashboard.css'; // Replaced by unified CSS in parent component

const SwahiliAnalysisManagement = () => {
  const [settings, setSettings] = useState({
    features: {
      swahiliAnalysis: { enabled: true, premiumOnly: false },
      localMarketIntelligence: { enabled: true, premiumOnly: false },
      realTimeCulturalScoring: { enabled: true, premiumOnly: false },
      predictiveCulturalSuccess: { enabled: true, premiumOnly: false }
    },
    limits: {
      freeAnalysisPerMonth: 10,
      premiumAnalysisPerMonth: 100,
      enterpriseAnalysisPerMonth: 1000
    },
    config: {
      supportedLanguages: ["swahili", "english", "kikuyu", "kamba", "luhya", "kisii", "meru", "kalenjin"],
      aiModel: "gemini-1.5-flash",
      analysisTimeout: 30
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5000/api/admin/swahili-analysis-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching Swahili analysis settings:', error);
      setMessage('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureName, enabled) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://127.0.0.1:5000/api/admin/swahili-analysis-settings/feature-toggle', {
        feature: featureName,
        enabled: enabled
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          features: {
            ...prev.features,
            [featureName]: {
              ...prev.features[featureName],
              enabled: enabled
            }
          }
        }));
        setMessage(`Feature ${featureName} ${enabled ? 'enabled' : 'disabled'} successfully`);
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling feature:', error);
      setMessage('Error updating feature');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateLimits = async (newLimits) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://127.0.0.1:5000/api/admin/swahili-analysis-settings', {
        ...settings,
        limits: newLimits
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          limits: newLimits
        }));
        setMessage('Limits updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating limits:', error);
      setMessage('Error updating limits');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = async (newConfig) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put('http://127.0.0.1:5000/api/admin/swahili-analysis-settings', {
        ...settings,
        config: newConfig
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setSettings(prev => ({
          ...prev,
          config: newConfig
        }));
        setMessage('Configuration updated successfully');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      setMessage('Error updating configuration');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-section">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>🌍 Swahili Analysis Feature Management</h2>
        <p>Control access to Swahili & Local Language Resume Analysis features</p>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Feature Toggles */}
      <div className="feature-controls">
        <h3>Feature Controls</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-header">
              <h4>🚀 Swahili Analysis</h4>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="swahiliAnalysis"
                  checked={settings.features.swahiliAnalysis.enabled}
                  onChange={(e) => toggleFeature('swahiliAnalysis', e.target.checked)}
                  disabled={saving}
                />
                <label htmlFor="swahiliAnalysis"></label>
              </div>
            </div>
            <p>Main Swahili & Local Language Resume Analysis feature</p>
            <div className="feature-status">
              Status: <span className={settings.features.swahiliAnalysis.enabled ? 'enabled' : 'disabled'}>
                {settings.features.swahiliAnalysis.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <h4>🎯 Local Market Intelligence</h4>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="localMarketIntelligence"
                  checked={settings.features.localMarketIntelligence.enabled}
                  onChange={(e) => toggleFeature('localMarketIntelligence', e.target.checked)}
                  disabled={saving}
                />
                <label htmlFor="localMarketIntelligence"></label>
              </div>
            </div>
            <p>Advanced market analysis for local business context</p>
            <div className="feature-status">
              Status: <span className={settings.features.localMarketIntelligence.enabled ? 'enabled' : 'disabled'}>
                {settings.features.localMarketIntelligence.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <h4>⚡ Real-Time Cultural Scoring</h4>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="realTimeCulturalScoring"
                  checked={settings.features.realTimeCulturalScoring.enabled}
                  onChange={(e) => toggleFeature('realTimeCulturalScoring', e.target.checked)}
                  disabled={saving}
                />
                <label htmlFor="realTimeCulturalScoring"></label>
              </div>
            </div>
            <p>Dynamic cultural fit scoring system</p>
            <div className="feature-status">
              Status: <span className={settings.features.realTimeCulturalScoring.enabled ? 'enabled' : 'disabled'}>
                {settings.features.realTimeCulturalScoring.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-header">
              <h4>📊 Predictive Cultural Success</h4>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id="predictiveCulturalSuccess"
                  checked={settings.features.predictiveCulturalSuccess.enabled}
                  onChange={(e) => toggleFeature('predictiveCulturalSuccess', e.target.checked)}
                  disabled={saving}
                />
                <label htmlFor="predictiveCulturalSuccess"></label>
              </div>
            </div>
            <p>ML-based long-term success prediction</p>
            <div className="feature-status">
              Status: <span className={settings.features.predictiveCulturalSuccess.enabled ? 'enabled' : 'disabled'}>
                {settings.features.predictiveCulturalSuccess.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Limits */}
      <div className="limits-controls">
        <h3>Usage Limits</h3>
        <div className="limits-grid">
          <div className="limit-card">
            <label>Free Users (per month)</label>
            <input
              type="number"
              value={settings.limits.freeAnalysisPerMonth}
              onChange={(e) => updateLimits({
                ...settings.limits,
                freeAnalysisPerMonth: parseInt(e.target.value) || 0
              })}
              min="0"
              disabled={saving}
            />
          </div>
          <div className="limit-card">
            <label>Premium Users (per month)</label>
            <input
              type="number"
              value={settings.limits.premiumAnalysisPerMonth}
              onChange={(e) => updateLimits({
                ...settings.limits,
                premiumAnalysisPerMonth: parseInt(e.target.value) || 0
              })}
              min="0"
              disabled={saving}
            />
          </div>
          <div className="limit-card">
            <label>Enterprise Users (per month)</label>
            <input
              type="number"
              value={settings.limits.enterpriseAnalysisPerMonth}
              onChange={(e) => updateLimits({
                ...settings.limits,
                enterpriseAnalysisPerMonth: parseInt(e.target.value) || 0
              })}
              min="0"
              disabled={saving}
            />
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="config-controls">
        <h3>Configuration</h3>
        <div className="config-grid">
          <div className="config-card">
            <label>AI Model</label>
            <select
              value={settings.config.aiModel}
              onChange={(e) => updateConfig({
                ...settings.config,
                aiModel: e.target.value
              })}
              disabled={saving}
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>
          <div className="config-card">
            <label>Analysis Timeout (seconds)</label>
            <input
              type="number"
              value={settings.config.analysisTimeout}
              onChange={(e) => updateConfig({
                ...settings.config,
                analysisTimeout: parseInt(e.target.value) || 30
              })}
              min="10"
              max="120"
              disabled={saving}
            />
          </div>
        </div>
        
        <div className="languages-config">
          <h4>Supported Languages</h4>
          <div className="languages-list">
            {settings.config.supportedLanguages.map((lang, index) => (
              <span key={index} className="language-tag">{lang}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="section-footer">
        <p className="note">
          💡 <strong>Note:</strong> Changes to these settings will take effect immediately for all users.
          Disabled features will not be accessible to any users, regardless of their subscription plan.
        </p>
      </div>
    </div>
  );
};

export default SwahiliAnalysisManagement;
