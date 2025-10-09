import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import '../styles/StaticPages.css';

const Status = () => {
  const [currentStatus, setCurrentStatus] = useState('operational');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const services = [
    {
      name: 'Website',
      status: 'operational',
      description: 'Main website and user interface'
    },
    {
      name: 'Job Search API',
      status: 'operational',
      description: 'Job search and filtering functionality'
    },
    {
      name: 'User Authentication',
      status: 'operational',
      description: 'Login, signup, and account management'
    },
    {
      name: 'Resume Upload',
      status: 'operational',
      description: 'Resume upload and parsing services'
    },
    {
      name: 'Email Notifications',
      status: 'operational',
      description: 'Job alerts and system notifications'
    },
    {
      name: 'Database',
      status: 'operational',
      description: 'Data storage and retrieval'
    }
  ];

  const incidents = [
    {
      date: 'Dec 15, 2024',
      title: 'Scheduled Maintenance Complete',
      status: 'resolved',
      description: 'Routine database maintenance completed successfully. All services are now fully operational.'
    },
    {
      date: 'Dec 10, 2024',
      title: 'Brief Search Service Disruption',
      status: 'resolved',
      description: 'Job search functionality experienced a 15-minute outage. Issue was quickly identified and resolved.'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'operational':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon operational" />;
      case 'degraded':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon degraded" />;
      case 'outage':
        return <FontAwesomeIcon icon={faTimesCircle} className="status-icon outage" />;
      case 'maintenance':
        return <FontAwesomeIcon icon={faClock} className="status-icon maintenance" />;
      default:
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon operational" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'degraded':
        return 'Degraded Performance';
      case 'outage':
        return 'Service Outage';
      case 'maintenance':
        return 'Under Maintenance';
      default:
        return 'Operational';
    }
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="static-page-container">
      <div className="static-page-content">
        <h1 className="page-title">System Status</h1>
        
        <div className="status-overview">
          <div className="overall-status">
            {getStatusIcon(currentStatus)}
            <div className="status-info">
              <h2>All Systems Operational</h2>
              <p>Last updated: {lastUpdated.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="page-section">
          <h2>Service Status</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-header">
                  {getStatusIcon(service.status)}
                  <div className="service-info">
                    <h3>{service.name}</h3>
                    <span className={`status-badge ${service.status}`}>
                      {getStatusText(service.status)}
                    </span>
                  </div>
                </div>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-section">
          <h2>Recent Incidents</h2>
          <div className="incidents-list">
            {incidents.map((incident, index) => (
              <div key={index} className="incident-card">
                <div className="incident-header">
                  <div className="incident-date">{incident.date}</div>
                  <span className={`status-badge ${incident.status}`}>
                    {incident.status === 'resolved' ? 'Resolved' : 'Ongoing'}
                  </span>
                </div>
                <h3 className="incident-title">{incident.title}</h3>
                <p className="incident-description">{incident.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="page-section">
          <h2>Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>99.9%</h3>
              <p>Uptime (30 days)</p>
            </div>
            <div className="metric-card">
              <h3>&lt; 200ms</h3>
              <p>Average Response Time</p>
            </div>
            <div className="metric-card">
              <h3>0</h3>
              <p>Active Incidents</p>
            </div>
            <div className="metric-card">
              <h3>2</h3>
              <p>Incidents Resolved (30 days)</p>
            </div>
          </div>
        </div>

        <div className="page-section">
          <h2>Subscribe to Updates</h2>
          <p>
            Stay informed about system status changes and planned maintenance by subscribing 
            to our status updates.
          </p>
          <div className="subscribe-form">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="email-input"
            />
            <button className="subscribe-btn">Subscribe</button>
          </div>
        </div>

        <div className="page-section">
          <h2>Need Help?</h2>
          <p>
            If you're experiencing issues not reflected on this status page, please contact our support team:
          </p>
          <div className="contact-info">
            <p><strong>Support Email:</strong> support@aksharjobs.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Live Chat:</strong> Available 24/7 on our website</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
