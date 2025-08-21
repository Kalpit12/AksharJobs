import React, { useState, useEffect } from 'react';
import '../styles/DisplaySettingsModal.css';

const DisplaySettingsModal = ({ isOpen, onClose, onSave, currentSettings = {} }) => {
  const [settings, setSettings] = useState({
    language: 'English',
    theme: 'light',
    fontSize: 'medium',
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
      console.error('Error saving display settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language) => {
    setSettings(prev => ({ ...prev, language }));
  };

  const handleThemeChange = (theme) => {
    setSettings(prev => ({ ...prev, theme }));
    // Apply theme immediately for preview
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  };

  const handleFontSizeChange = (fontSize) => {
    setSettings(prev => ({ ...prev, fontSize }));
    // Apply font size immediately for preview
    document.documentElement.style.setProperty('--font-size', fontSize);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const themes = [
    { value: 'light', name: 'Light', icon: '☀️', description: 'Clean and bright interface' },
    { value: 'dark', name: 'Dark', icon: '🌙', description: 'Easy on the eyes in low light' },
    { value: 'auto', name: 'Auto', icon: '🔄', description: 'Follows system preference' }
  ];

  const fontSizes = [
    { value: 'small', name: 'Small', preview: 'Aa', description: 'Compact text display' },
    { value: 'medium', name: 'Medium', preview: 'Aa', description: 'Standard text size' },
    { value: 'large', name: 'Large', preview: 'Aa', description: 'Enhanced readability' },
    { value: 'extra-large', name: 'Extra Large', preview: 'Aa', description: 'Maximum accessibility' }
  ];

  if (!isOpen) return null;

  return (
    <div className="display-settings-modal-overlay" onClick={onClose}>
      <div className="display-settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Display Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Language Selection */}
          <div className="setting-group">
            <h3>Language</h3>
            <p className="setting-description">
              Choose your preferred language for the interface
            </p>
            <div className="language-grid">
              {languages.map((lang) => (
                <label 
                  key={lang.code} 
                  className={`language-option ${settings.language === lang.name ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={lang.name}
                    checked={settings.language === lang.name}
                    onChange={() => handleLanguageChange(lang.name)}
                  />
                  <div className="language-content">
                    <span className="language-flag">{lang.flag}</span>
                    <span className="language-name">{lang.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="setting-group">
            <h3>Theme</h3>
            <p className="setting-description">
              Choose your preferred visual theme
            </p>
            <div className="theme-options">
              {themes.map((theme) => (
                <label 
                  key={theme.value} 
                  className={`theme-option ${settings.theme === theme.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={settings.theme === theme.value}
                    onChange={() => handleThemeChange(theme.value)}
                  />
                  <div className="theme-content">
                    <span className="theme-icon">{theme.icon}</span>
                    <div className="theme-info">
                      <span className="theme-name">{theme.name}</span>
                      <span className="theme-description">{theme.description}</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Font Size Selection */}
          <div className="setting-group">
            <h3>Font Size</h3>
            <p className="setting-description">
              Adjust text size for better readability
            </p>
            <div className="font-size-options">
              {fontSizes.map((font) => (
                <label 
                  key={font.value} 
                  className={`font-size-option ${settings.fontSize === font.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="fontSize"
                    value={font.value}
                    checked={settings.fontSize === font.value}
                    onChange={() => handleFontSizeChange(font.value)}
                  />
                  <div className="font-size-content">
                    <span className={`font-preview ${font.value}`}>{font.preview}</span>
                    <div className="font-size-info">
                      <span className="font-size-name">{font.name}</span>
                      <span className="font-size-description">{font.description}</span>
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
              See how your settings will look
            </p>
            <div className={`preview-container ${settings.theme}`}>
              <div className="preview-header">
                <h4>Sample Content</h4>
                <p>This is how your text will appear with the selected settings.</p>
              </div>
              <div className="preview-content">
                <h5>Sample Heading</h5>
                <p>This is a sample paragraph that demonstrates how your chosen font size and theme will look. The text should be comfortable to read and match your preferences.</p>
                <button className="preview-button">Sample Button</button>
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

export default DisplaySettingsModal;
