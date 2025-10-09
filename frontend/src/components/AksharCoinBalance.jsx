import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCoins, 
  faArrowUp, 
  faArrowDown, 
  faHistory,
  faSpinner,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import coinApi from '../api/coinApi';
import '../styles/AksharCoinBalance.css';

const AksharCoinBalance = ({ onBalanceUpdate }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coinApi.getBalance();
      
      if (response.success) {
        setBalance(response.balance);
        setTotalEarned(response.total_earned);
        setTotalSpent(response.total_spent);
        setRecentTransactions(response.recent_transactions || []);
        
        if (onBalanceUpdate) {
          onBalanceUpdate(response.balance);
        }
      } else {
        setError(response.error || 'Failed to load balance');
      }
    } catch (err) {
      console.error('Error fetching coin balance:', err);
      setError('Failed to load coin balance');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getTransactionIcon = (type) => {
    return type === 'earn' ? faArrowUp : faArrowDown;
  };

  const getTransactionColor = (type) => {
    return type === 'earn' ? '#10b981' : '#ef4444';
  };

  if (loading) {
    return (
      <div className="akshar-coin-balance loading">
        <FontAwesomeIcon icon={faSpinner} spin className="loading-spinner" />
        <p>Loading coin balance...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="akshar-coin-balance error">
        <p className="error-message">{error}</p>
        <button onClick={fetchBalance} className="retry-btn">
          <FontAwesomeIcon icon={faRefresh} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="akshar-coin-balance">
      <div className="balance-header">
        <div className="balance-icon">
          <FontAwesomeIcon icon={faCoins} />
        </div>
        <div className="balance-info">
          <h3>Your Akshar Coins</h3>
          <div className="balance-amount">
            <span className="coin-symbol">₳</span>
            <span className="coin-value">{balance.toLocaleString()}</span>
          </div>
        </div>
        <button onClick={fetchBalance} className="refresh-btn" title="Refresh balance">
          <FontAwesomeIcon icon={faRefresh} />
        </button>
      </div>

      <div className="balance-stats">
        <div className="stat-item earn">
          <FontAwesomeIcon icon={faArrowUp} />
          <div className="stat-content">
            <span className="stat-label">Total Earned</span>
            <span className="stat-value">₳ {totalEarned.toLocaleString()}</span>
          </div>
        </div>
        <div className="stat-item spend">
          <FontAwesomeIcon icon={faArrowDown} />
          <div className="stat-content">
            <span className="stat-label">Total Spent</span>
            <span className="stat-value">₳ {totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {recentTransactions.length > 0 && (
        <div className="recent-transactions-section">
          <button 
            className="view-transactions-btn"
            onClick={() => setShowTransactions(!showTransactions)}
          >
            <FontAwesomeIcon icon={faHistory} />
            {showTransactions ? 'Hide' : 'View'} Recent Transactions
          </button>

          {showTransactions && (
            <div className="transactions-list">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className={`transaction-item ${transaction.type}`}>
                  <div className="transaction-icon" style={{ color: getTransactionColor(transaction.type) }}>
                    <FontAwesomeIcon icon={getTransactionIcon(transaction.type)} />
                  </div>
                  <div className="transaction-details">
                    <p className="transaction-reason">{transaction.reason}</p>
                    <p className="transaction-date">{formatDate(transaction.timestamp)}</p>
                  </div>
                  <div className="transaction-amount" style={{ color: getTransactionColor(transaction.type) }}>
                    {transaction.type === 'earn' ? '+' : ''}₳ {Math.abs(transaction.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="balance-footer">
        <p className="balance-note">
          <FontAwesomeIcon icon={faCoins} /> Earn more coins by sharing your promo code and using the platform!
        </p>
      </div>
    </div>
  );
};

export default AksharCoinBalance;

