import React, { useState, useEffect } from 'react';
import '../styles/DarkModeToggle.css';

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', isDark);
  }, [isDark]);

  return (
    <button 
      className={`dark-mode-toggle ${isDark ? 'dark' : 'light'}`}
      onClick={() => setIsDark(!isDark)}
      aria-label="Toggle Dark Mode"
    >
      <div className="toggle-track">
        <div className="toggle-thumb">
          <span className="toggle-icon">
            {isDark ? '🌙' : '☀️'}
          </span>
        </div>
        <div className="toggle-stars">
          <span className="star star-1">⭐</span>
          <span className="star star-2">✨</span>
          <span className="star star-3">💫</span>
        </div>
        <div className="toggle-clouds">
          <span className="cloud cloud-1">☁️</span>
          <span className="cloud cloud-2">☁️</span>
        </div>
      </div>
    </button>
  );
};

export default DarkModeToggle;

