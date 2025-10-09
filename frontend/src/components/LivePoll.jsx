import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPoll, 
  faPlus, 
  faChartBar,
  faClock,
  faUsers,
  faCheckCircle,
  faTimes,
  faEye,
  faArrowTrendUp,
  faFire,
  faArrowUp,
  faShare
} from '@fortawesome/free-solid-svg-icons';
import '../styles/LivePoll.css';

const LivePoll = () => {
  const [polls, setPolls] = useState([]);
  const [activePoll, setActivePoll] = useState(null);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    options: ['', ''],
    duration: 24, // hours
    category: 'General',
    isPublic: true
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockPolls = [
      {
        id: 1,
        title: "What's your preferred work arrangement?",
        description: "Help us understand the current trends in work preferences",
        options: [
          { id: 1, text: "Fully Remote", votes: 234, percentage: 45 },
          { id: 2, text: "Hybrid (2-3 days in office)", votes: 189, percentage: 36 },
          { id: 3, text: "Fully On-site", votes: 67, percentage: 13 },
          { id: 4, text: "Flexible (varies by project)", votes: 31, percentage: 6 }
        ],
        totalVotes: 521,
        author: "HR Team",
        category: "Work Life",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
        isActive: true,
        isPublic: true,
        tags: ["work", "remote", "flexibility"]
      },
      {
        id: 2,
        title: "Which programming language should we focus on in 2024?",
        description: "For our upcoming training programs",
        options: [
          { id: 5, text: "Python", votes: 156, percentage: 42 },
          { id: 6, text: "JavaScript", votes: 98, percentage: 26 },
          { id: 7, text: "Java", votes: 67, percentage: 18 },
          { id: 8, text: "Go", votes: 52, percentage: 14 }
        ],
        totalVotes: 373,
        author: "Training Team",
        category: "Technical",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        expiresAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
        isActive: true,
        isPublic: true,
        tags: ["programming", "training", "technology"]
      },
      {
        id: 3,
        title: "How satisfied are you with your current job?",
        description: "Anonymous survey for industry insights",
        options: [
          { id: 9, text: "Very Satisfied", votes: 89, percentage: 28 },
          { id: 10, text: "Satisfied", votes: 134, percentage: 42 },
          { id: 11, text: "Neutral", votes: 67, percentage: 21 },
          { id: 12, text: "Dissatisfied", votes: 28, percentage: 9 }
        ],
        totalVotes: 318,
        author: "Research Team",
        category: "Career",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        isActive: true,
        isPublic: true,
        tags: ["job-satisfaction", "career", "survey"]
      }
    ];
    setPolls(mockPolls);
  }, []);

  const handleVote = async (pollId, optionId) => {
    if (userVotes[pollId]) {
      alert('You have already voted on this poll');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPolls(prev => prev.map(poll => {
        if (poll.id === pollId) {
          const updatedOptions = poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          );
          
          const newTotalVotes = poll.totalVotes + 1;
          const updatedOptionsWithPercentage = updatedOptions.map(option => ({
            ...option,
            percentage: Math.round((option.votes / newTotalVotes) * 100)
          }));

          return {
            ...poll,
            options: updatedOptionsWithPercentage,
            totalVotes: newTotalVotes
          };
        }
        return poll;
      }));

      setUserVotes(prev => ({ ...prev, [pollId]: optionId }));
      setIsLoading(false);
    }, 1000);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    if (!newPoll.title.trim() || newPoll.options.filter(opt => opt.trim()).length < 2) {
      alert('Please provide a title and at least 2 options');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const poll = {
        id: Date.now(),
        title: newPoll.title,
        description: newPoll.description,
        options: newPoll.options
          .filter(opt => opt.trim())
          .map((opt, index) => ({
            id: index + 1,
            text: opt,
            votes: 0,
            percentage: 0
          })),
        totalVotes: 0,
        author: "Current User",
        category: newPoll.category,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + newPoll.duration * 60 * 60 * 1000),
        isActive: true,
        isPublic: newPoll.isPublic,
        tags: newPoll.title.toLowerCase().split(' ')
      };

      setPolls(prev => [poll, ...prev]);
      setNewPoll({
        title: '',
        description: '',
        options: ['', ''],
        duration: 24,
        category: 'General',
        isPublic: true
      });
      setShowCreateForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const addOption = () => {
    if (newPoll.options.length < 6) {
      setNewPoll(prev => ({
        ...prev,
        options: [...prev.options, '']
      }));
    }
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      setNewPoll(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index, value) => {
    setNewPoll(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const formatTimeRemaining = (expiresAt) => {
    const now = new Date();
    const diff = expiresAt - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getPollStatus = (poll) => {
    const now = new Date();
    if (poll.expiresAt <= now) return 'expired';
    if (poll.totalVotes > 100) return 'trending';
    if (poll.totalVotes > 50) return 'popular';
    return 'active';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'trending': return faArrowTrendUp;
      case 'popular': return faFire;
      case 'expired': return faTimes;
      default: return faPoll;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'trending': return '#ff6b35';
      case 'popular': return '#f7931e';
      case 'expired': return '#6c757d';
      default: return '#007bff';
    }
  };

  return (
    <div className="live-poll">
      <div className="poll-header">
        <div className="header-info">
          <h2>Live Polls</h2>
          <p>Participate in real-time polls and see results as they happen</p>
        </div>
        <button 
          className="create-poll-btn"
          onClick={() => setShowCreateForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Poll
        </button>
      </div>

      {showCreateForm && (
        <div className="create-poll-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Poll</h3>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={handleCreatePoll}>
              <div className="form-group">
                <label>Poll Title *</label>
                <input
                  type="text"
                  value={newPoll.title}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="What would you like to ask?"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPoll.description}
                  onChange={(e) => setNewPoll(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for your poll"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Poll Options *</label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="option-input">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {newPoll.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(index)}
                        className="remove-option-btn"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    )}
                  </div>
                ))}
                {newPoll.options.length < 6 && (
                  <button
                    type="button"
                    onClick={addOption}
                    className="add-option-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Add Option
                  </button>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Duration (hours)</label>
                  <select
                    value={newPoll.duration}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  >
                    <option value={1}>1 hour</option>
                    <option value={6}>6 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={24}>1 day</option>
                    <option value={72}>3 days</option>
                    <option value={168}>1 week</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newPoll.category}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="General">General</option>
                    <option value="Career">Career</option>
                    <option value="Technical">Technical</option>
                    <option value="Work Life">Work Life</option>
                    <option value="Industry">Industry</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newPoll.isPublic}
                    onChange={(e) => setNewPoll(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  Make this poll public
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Poll'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="polls-grid">
        {polls.map(poll => {
          const status = getPollStatus(poll);
          const hasVoted = userVotes[poll.id];
          const selectedOptionId = userVotes[poll.id];

          return (
            <div key={poll.id} className={`poll-card ${status}`}>
              <div className="poll-header-card">
                <div className="poll-title-section">
                  <h3>{poll.title}</h3>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(status) }}
                  >
                    <FontAwesomeIcon icon={getStatusIcon(status)} />
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="poll-meta">
                  <span className="poll-author">
                    <FontAwesomeIcon icon={faUsers} />
                    {poll.author}
                  </span>
                  <span className="poll-category">{poll.category}</span>
                  <span className="poll-time">
                    <FontAwesomeIcon icon={faClock} />
                    {formatTimeRemaining(poll.expiresAt)}
                  </span>
                </div>
              </div>

              {poll.description && (
                <p className="poll-description">{poll.description}</p>
              )}

              <div className="poll-options">
                {poll.options.map(option => (
                  <div 
                    key={option.id} 
                    className={`poll-option ${hasVoted && selectedOptionId === option.id ? 'selected' : ''}`}
                    onClick={() => !hasVoted && poll.isActive && handleVote(poll.id, option.id)}
                  >
                    <div className="option-content">
                      <div className="option-text">
                        {option.text}
                      </div>
                      {hasVoted && (
                        <div className="option-stats">
                          <span className="vote-count">{option.votes} votes</span>
                          <span className="percentage">{option.percentage}%</span>
                        </div>
                      )}
                    </div>
                    {hasVoted && (
                      <div className="option-bar">
                        <div 
                          className="option-fill"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                    )}
                    {hasVoted && selectedOptionId === option.id && (
                      <div className="selected-indicator">
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="poll-footer">
                <div className="poll-stats">
                  <span className="total-votes">
                    <FontAwesomeIcon icon={faChartBar} />
                    {poll.totalVotes} total votes
                  </span>
                  {hasVoted && (
                    <span className="voted-indicator">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      You voted
                    </span>
                  )}
                </div>
                <div className="poll-actions">
                  <button className="share-btn">
                    <FontAwesomeIcon icon={faShare} />
                    Share
                  </button>
                  <button className="results-btn">
                    <FontAwesomeIcon icon={faChartBar} />
                    Results
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LivePoll;
