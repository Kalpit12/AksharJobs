import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './utils/urlInterceptor'; // Import URL interceptor to fix hardcoded URLs

// Suppress proxy errors from browser extensions
window.addEventListener('error', (event) => {
  if (event.message && (
    event.message.includes('Attempting to use a disconnected port object') ||
    event.message.includes('WebSocket connection error') ||
    event.message.includes('Socket.IO not configured')
  )) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Suppress unhandled promise rejections from proxy errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && (
    event.reason.message.includes('Attempting to use a disconnected port object') ||
    event.reason.message.includes('WebSocket connection error') ||
    event.reason.message.includes('Socket.IO not configured')
  )) {
    event.preventDefault();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
