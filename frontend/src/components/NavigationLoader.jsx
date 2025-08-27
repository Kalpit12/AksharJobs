import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Global.css';

const NavigationLoader = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationText, setNavigationText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Intercept navigation clicks and show loading
  useEffect(() => {
    const handleNavigationClick = (event) => {
      const target = event.target.closest('a[href], button[onclick]');
      if (target) {
        const href = target.getAttribute('href');
        const text = target.textContent?.trim();
        
        if (href && href.startsWith('/') && !href.startsWith('#')) {
          setIsNavigating(true);
          setNavigationText(getNavigationText(text, href));
          
          // Hide loader after navigation completes
          setTimeout(() => {
            setIsNavigating(false);
          }, 1000);
        }
      }
    };

    // Add click listeners to all navigation elements
    const navigationElements = document.querySelectorAll('a[href], button[onclick]');
    navigationElements.forEach(element => {
      element.addEventListener('click', handleNavigationClick);
    });

    return () => {
      navigationElements.forEach(element => {
        element.removeEventListener('click', handleNavigationClick);
      });
    };
  }, [location]);

  const getNavigationText = (text, href) => {
    const routeTexts = {
      '/jobs': 'Finding amazing opportunities...',
      '/joblisting': 'Loading job listings...',
      '/jobseeker-dashboard': 'Loading your dashboard...',
      '/recruiter-dashboard': 'Loading recruiter tools...',
      '/admin': 'Loading admin panel...',
      '/profile': 'Loading your profile...',
      '/settings': 'Loading settings...',
      '/upload-resume': 'Preparing resume upload...',
      '/appliedjobs': 'Loading your applications...',
      '/analytics-dashboard': 'Loading analytics...',
      '/match-score': 'Calculating match scores...',
      '/candidates': 'Loading candidate data...',
      '/about': 'Loading about us...',
      '/blog': 'Loading blog posts...',
      '/contact': 'Loading contact information...',
      '/pricing': 'Loading pricing plans...'
    };

    return routeTexts[href] || `Loading ${text || 'page'}...`;
  };

  if (!isNavigating) return null;

  return (
    <div className="navigation-loader">
      <div className="navigation-loader-content">
        <LoadingSpinner
          type="rocket"
          size="large"
          text={navigationText}
          showText={true}
          color="primary"
        />
      </div>
    </div>
  );
};

export default NavigationLoader;
