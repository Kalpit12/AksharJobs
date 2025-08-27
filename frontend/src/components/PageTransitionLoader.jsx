import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import '../styles/Global.css';

const PageTransitionLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const location = useLocation();

  useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);
    
    // Set different loading text based on the route
    const routeLoadingTexts = {
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

    const text = routeLoadingTexts[location.pathname] || 'Loading page...';
    setLoadingText(text);

    // Hide loader after a short delay to show the loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="page-transition-loader">
      <div className="page-transition-content">
        <LoadingSpinner
          type="rocket"
          size="large"
          text={loadingText}
          showText={true}
          color="primary"
        />
      </div>
    </div>
  );
};

export default PageTransitionLoader;
