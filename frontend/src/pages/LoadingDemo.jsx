import React, { useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import PageLoadingOverlay from '../components/PageLoadingOverlay';
import Button from '../components/Button';
import '../styles/Global.css';

const LoadingDemo = () => {
  const [showPageOverlay, setShowPageOverlay] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleButtonClick = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 3000);
  };

  const handlePageOverlay = () => {
    setShowPageOverlay(true);
    setTimeout(() => setShowPageOverlay(false), 3000);
  };

  return (
    <div className="loading-demo-page">
      <div className="demo-header">
        <h1>🎨 Loading Animation Showcase</h1>
        <p>Explore all the smooth, clean loading animations available in RocketJobs</p>
      </div>

      {/* Spinner Types */}
      <section className="demo-section">
        <h2>🔄 Spinner Animations</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Classic Spinner</h3>
            <LoadingSpinner type="spinner" size="medium" text="Loading..." />
          </div>
          
          <div className="demo-item">
            <h3>Pulse Animation</h3>
            <LoadingSpinner type="pulse" size="medium" text="Processing..." />
          </div>
          
          <div className="demo-item">
            <h3>Dots Animation</h3>
            <LoadingSpinner type="dots" size="medium" text="Please wait..." />
          </div>
          
          <div className="demo-item">
            <h3>Rocket Animation</h3>
            <LoadingSpinner type="rocket" size="medium" text="Launching..." />
          </div>
        </div>
      </section>

      {/* Skeleton Loaders */}
      <section className="demo-section">
        <h2>💀 Skeleton Loaders</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Text Skeleton</h3>
            <SkeletonLoader type="text" lines={4} />
          </div>
          
          <div className="demo-item">
            <h3>Card Skeleton</h3>
            <SkeletonLoader type="card" height="120px" />
          </div>
          
          <div className="demo-item">
            <h3>Avatar Skeleton</h3>
            <SkeletonLoader type="avatar" height="64px" width="64px" />
          </div>
          
          <div className="demo-item">
            <h3>List Skeleton</h3>
            <SkeletonLoader type="list" lines={3} />
          </div>
        </div>
      </section>

      {/* Button Loading States */}
      <section className="demo-section">
        <h2>🔘 Button Loading States</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Primary Button</h3>
            <Button 
              variant="primary" 
              loading={buttonLoading}
              onClick={handleButtonClick}
            >
              {buttonLoading ? 'Processing...' : 'Click to Load'}
            </Button>
          </div>
          
          <div className="demo-item">
            <h3>Secondary Button</h3>
            <Button 
              variant="secondary" 
              loading={buttonLoading}
              onClick={handleButtonClick}
            >
              {buttonLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
          
          <div className="demo-item">
            <h3>Success Button</h3>
            <Button 
              variant="success" 
              loading={buttonLoading}
              onClick={handleButtonClick}
            >
              {buttonLoading ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </div>
      </section>

      {/* Page Loading Overlay */}
      <section className="demo-section">
        <h2>🌐 Page Loading Overlay</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Full Page Overlay</h3>
            <Button 
              variant="primary" 
              onClick={handlePageOverlay}
              icon="rocket"
            >
              Show Page Loading
            </Button>
            <p className="demo-description">
              Click to see a full-page loading overlay with backdrop blur
            </p>
          </div>
        </div>
      </section>

      {/* Size Variations */}
      <section className="demo-section">
        <h2>📏 Size Variations</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Small</h3>
            <LoadingSpinner type="spinner" size="small" text="Small" />
          </div>
          
          <div className="demo-item">
            <h3>Medium</h3>
            <LoadingSpinner type="spinner" size="medium" text="Medium" />
          </div>
          
          <div className="demo-item">
            <h3>Large</h3>
            <LoadingSpinner type="spinner" size="large" text="Large" />
          </div>
          
          <div className="demo-item">
            <h3>Extra Large</h3>
            <LoadingSpinner type="spinner" size="xl" text="Extra Large" />
          </div>
        </div>
      </section>

      {/* Color Variations */}
      <section className="demo-section">
        <h2>🎨 Color Variations</h2>
        <div className="demo-grid">
          <div className="demo-item">
            <h3>Primary (Blue)</h3>
            <LoadingSpinner type="pulse" size="medium" color="primary" />
          </div>
          
          <div className="demo-item">
            <h3>Success (Green)</h3>
            <LoadingSpinner type="pulse" size="medium" color="success" />
          </div>
          
          <div className="demo-item">
            <h3>Warning (Yellow)</h3>
            <LoadingSpinner type="pulse" size="medium" color="warning" />
          </div>
          
          <div className="demo-item">
            <h3>Danger (Red)</h3>
            <LoadingSpinner type="pulse" size="medium" color="danger" />
          </div>
        </div>
      </section>

      {/* Page Loading Overlay */}
      <PageLoadingOverlay 
        isVisible={showPageOverlay}
        text="Loading your dashboard..."
        type="rocket"
        size="large"
      />

      <style jsx>{`
        .loading-demo-page {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: #f8fafc;
          min-height: 100vh;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .demo-header h1 {
          color: #1e293b;
          margin-bottom: 0.5rem;
          font-size: 2.5rem;
        }

        .demo-header p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .demo-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .demo-section h2 {
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .demo-item {
          text-align: center;
          padding: 1.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          transition: all 0.3s ease;
        }

        .demo-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .demo-item h3 {
          color: #374151;
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .demo-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin-top: 1rem;
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .loading-demo-page {
            padding: 1rem;
          }
          
          .demo-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingDemo;
