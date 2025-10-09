import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faUsers, 
  faGift, 
  faArrowTrendUp,
  faCalendarAlt,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import promoCodeApi from '../api/promoCodeApi';
import '../styles/PromoCodeAnalytics.css';

const PromoCodeAnalytics = ({ userType }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await promoCodeApi.getMyPromoCode();
      
      if (response.success) {
        setAnalytics(response.promo_code);
      } else {
        setError(response.error || 'Failed to load analytics');
      }
    } catch (err) {
      console.error('Error fetching promo code analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getUsagePercentage = () => {
    if (!analytics) return 0;
    return (analytics.usage_count / analytics.max_uses) * 100;
  };

  const getUsageColor = () => {
    const percentage = getUsagePercentage();
    if (percentage >= 100) return '#ef4444';
    if (percentage >= 80) return '#f59e0b';
    if (percentage >= 50) return '#3b82f6';
    return '#10b981';
  };

  const getDaysRemaining = () => {
    if (!analytics) return 0;
    const now = new Date();
    const expires = new Date(analytics.expires_at);
    const diffTime = expires - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="promo-analytics loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="promo-analytics error">
        <FontAwesomeIcon icon={faChartLine} className="error-icon" />
        <p>{error}</p>
        <button onClick={fetchAnalytics} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="promo-analytics">
        <FontAwesomeIcon icon={faGift} className="gift-icon" />
        <h3>No Promo Code Yet</h3>
        <p>Create your promo code to start tracking analytics!</p>
      </div>
    );
  }

  return (
    <div className="promo-analytics">
      <div className="analytics-header">
        <FontAwesomeIcon icon={faChartLine} className="analytics-icon" />
        <h3>Promo Code Analytics</h3>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="card-content">
            <h4>Total Uses</h4>
            <p className="metric">{analytics.usage_count}</p>
            <span className="subtitle">out of {analytics.max_uses}</span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faArrowTrendUp} />
          </div>
          <div className="card-content">
            <h4>Usage Rate</h4>
            <p className="metric">{getUsagePercentage().toFixed(1)}%</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${getUsagePercentage()}%`,
                  backgroundColor: getUsageColor()
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="card-content">
            <h4>Days Remaining</h4>
            <p className="metric">{getDaysRemaining()}</p>
            <span className="subtitle">until expiry</span>
          </div>
        </div>

        <div className="analytics-card">
          <div className="card-icon">
            <FontAwesomeIcon icon={faEye} />
          </div>
          <div className="card-content">
            <h4>Status</h4>
            <p className="metric" style={{ color: getUsageColor() }}>
              {analytics.is_active ? 'Active' : 'Inactive'}
            </p>
            <span className="subtitle">
              {analytics.is_active ? 'Code is live' : 'Code disabled'}
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-details">
        <h4>Code Details</h4>
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Code:</span>
            <span className="value code-value">{analytics.code}</span>
          </div>
          <div className="detail-item">
            <span className="label">Created:</span>
            <span className="value">
              {new Date(analytics.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Expires:</span>
            <span className="value">
              {new Date(analytics.expires_at).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="label">Remaining Uses:</span>
            <span className="value">
              {analytics.max_uses - analytics.usage_count}
            </span>
          </div>
        </div>
      </div>

      <div className="analytics-actions">
        <button onClick={fetchAnalytics} className="analytics-refresh-button">
          <FontAwesomeIcon icon={faChartLine} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
};

export default PromoCodeAnalytics;
