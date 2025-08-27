import React from 'react';
import Header from '../components/Header';

const TestHeader = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Header Test Page</h1>
        <p>This page is used to test the header functionality.</p>
        <p>Try clicking on the profile section and notifications button.</p>
        
        {/* Test CSS Variables */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h3>CSS Variables Test</h3>
          <p>If you can see this styled box, CSS variables are working.</p>
          <p>Background: var(--bg-primary)</p>
          <p>Border: var(--border-light)</p>
          <p>Border Radius: var(--radius-md)</p>
        </div>
        
        {/* Test Header Styles */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: 'var(--primary-600)',
          color: 'var(--text-white)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h3>Header Color Test</h3>
          <p>This should look like the header colors.</p>
          <p>Background: var(--primary-600)</p>
          <p>Text: var(--text-white)</p>
        </div>
      </div>
    </div>
  );
};

export default TestHeader;
