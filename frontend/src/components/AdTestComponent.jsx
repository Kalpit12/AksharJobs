import React from 'react';
import AdvertisementSystem from './AdvertisementSystem';

const AdTestComponent = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Advertisement System Test</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>Banner Ad</h2>
        <AdvertisementSystem placement="banner" />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div>
          <h2>Main Content</h2>
          <p>This is where the main content would go. The sidebar should show on the right.</p>
        </div>
        
        <div>
          <h2>Sidebar Ads</h2>
          <AdvertisementSystem placement="sidebar" />
          <AdvertisementSystem placement="sidebar" />
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h2>Inline Ad</h2>
        <AdvertisementSystem placement="inline" />
      </div>
    </div>
  );
};

export default AdTestComponent;
