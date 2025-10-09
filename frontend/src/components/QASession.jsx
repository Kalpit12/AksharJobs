import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faQuestionCircle, 
  faReply, 
  faThumbsUp, 
  faThumbsDown,
  faClock,
  faUser,
  faSort,
  faFilter,
  faSearch,
  faPlus,
  faCheckCircle,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import '../styles/QASession.css';

const QASession = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockQuestions = [
      {
        id: 1,
        title: "What are the best practices for remote work productivity?",
        content: "I've been working remotely for 6 months and I'm looking for ways to improve my productivity. What strategies have worked best for you?",
        author: "Sarah Johnson",
        authorRole: "Senior Developer",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        category: "Career",
        upvotes: 15,
        downvotes: 2,
        answers: [
          {
            id: 1,
            content: "I've found that having a dedicated workspace and following the Pomodoro Technique really helps. Also, taking regular breaks and staying hydrated.",
            author: "Mike Chen",
            authorRole: "Product Manager",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
            upvotes: 8,
            isAccepted: true
          },
          {
            id: 2,
            content: "Setting clear boundaries between work and personal time is crucial. I also use time-blocking to organize my day effectively.",
            author: "Emily Davis",
            authorRole: "UX Designer",
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            upvotes: 5,
            isAccepted: false
          }
        ],
        tags: ["remote-work", "productivity", "career"]
      },
      {
        id: 2,
        title: "How to transition from frontend to full-stack development?",
        content: "I'm a frontend developer with 3 years of experience in React. I want to transition to full-stack development. What should I learn first?",
        author: "Alex Rodriguez",
        authorRole: "Frontend Developer",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        category: "Career",
        upvotes: 23,
        downvotes: 1,
        answers: [
          {
            id: 3,
            content: "Start with Node.js and Express since you already know JavaScript. Then learn about databases (MongoDB or PostgreSQL) and authentication.",
            author: "David Kim",
            authorRole: "Full-Stack Developer",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
            upvotes: 12,
            isAccepted: true
          }
        ],
        tags: ["career-transition", "full-stack", "learning"]
      },
      {
        id: 3,
        title: "What's the best way to negotiate salary in a tech job?",
        content: "I have an offer for a software engineer position. The salary is good but I think I can negotiate for more. Any tips?",
        author: "Lisa Wang",
        authorRole: "Software Engineer",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        category: "Career",
        upvotes: 18,
        downvotes: 0,
        answers: [],
        tags: ["salary", "negotiation", "career"]
      }
    ];
    setQuestions(mockQuestions);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedQuestion?.answers]);

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const question = {
        id: Date.now(),
        title: newQuestion,
        content: newQuestion,
        author: "Current User",
        authorRole: "Job Seeker",
        timestamp: new Date(),
        category: "General",
        upvotes: 0,
        downvotes: 0,
        answers: [],
        tags: ["new-question"]
      };
      setQuestions(prev => [question, ...prev]);
      setNewQuestion('');
      setShowAskForm(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim() || !selectedQuestion) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const answer = {
        id: Date.now(),
        content: newAnswer,
        author: "Current User",
        authorRole: "Job Seeker",
        timestamp: new Date(),
        upvotes: 0,
        isAccepted: false
      };

      setQuestions(prev => prev.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, answers: [...q.answers, answer] }
          : q
      ));
      setSelectedQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, answer]
      }));
      setNewAnswer('');
      setIsLoading(false);
    }, 1000);
  };

  const handleVote = (questionId, type, answerId = null) => {
    setQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        if (answerId) {
          // Vote on answer
          return {
            ...q,
            answers: q.answers.map(a => 
              a.id === answerId 
                ? { ...a, upvotes: a.upvotes + (type === 'up' ? 1 : 0) }
                : a
            )
          };
        } else {
          // Vote on question
          return {
            ...q,
            upvotes: q.upvotes + (type === 'up' ? 1 : 0),
            downvotes: q.downvotes + (type === 'down' ? 1 : 0)
          };
        }
      }
      return q;
    }));

    // Update selected question if it's the one being voted on
    if (selectedQuestion?.id === questionId) {
      if (answerId) {
        setSelectedQuestion(prev => ({
          ...prev,
          answers: prev.answers.map(a => 
            a.id === answerId 
              ? { ...a, upvotes: a.upvotes + (type === 'up' ? 1 : 0) }
              : a
          )
        }));
      } else {
        setSelectedQuestion(prev => ({
          ...prev,
          upvotes: prev.upvotes + (type === 'up' ? 1 : 0),
          downvotes: prev.downvotes + (type === 'down' ? 1 : 0)
        }));
      }
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' || q.category.toLowerCase() === filterBy.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.timestamp) - new Date(a.timestamp);
      case 'popular':
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
      case 'answered':
        return b.answers.length - a.answers.length;
      default:
        return 0;
    }
  });

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="qa-session">
      <div className="qa-header">
        <div className="qa-controls">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="sort-filter">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Most Recent</option>
              <option value="popular">Most Popular</option>
              <option value="answered">Most Answered</option>
            </select>
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="career">Career</option>
              <option value="technical">Technical</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
        <button 
          className="ask-question-btn"
          onClick={() => setShowAskForm(true)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Ask Question
        </button>
      </div>

      {showAskForm && (
        <div className="ask-question-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Ask a Question</h3>
              <button 
                className="close-btn"
                onClick={() => setShowAskForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAskQuestion}>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="What would you like to ask the community?"
                rows={4}
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAskForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Posting...' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="qa-content">
        <div className="questions-list">
          {sortedQuestions.map(question => (
            <div 
              key={question.id} 
              className={`question-card ${selectedQuestion?.id === question.id ? 'selected' : ''}`}
              onClick={() => {
                console.log('Question clicked:', question.title);
                setSelectedQuestion(question);
              }}
            >
              <div className="question-header">
                <h3>{question.title}</h3>
                <span className="category-badge">{question.category}</span>
              </div>
              <p className="question-preview">{question.content}</p>
              <div className="question-meta">
                <div className="question-author">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{question.author}</span>
                  <span className="author-role">{question.authorRole}</span>
                </div>
                <div className="question-stats">
                  <span className="time">
                    <FontAwesomeIcon icon={faClock} />
                    {formatTimeAgo(question.timestamp)}
                  </span>
                  <span className="answers-count">
                    {question.answers.length} answer{question.answers.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              <div className="question-actions">
                <button 
                  className="vote-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(question.id, 'up');
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsUp} />
                  {question.upvotes}
                </button>
                <button 
                  className="vote-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(question.id, 'down');
                  }}
                >
                  <FontAwesomeIcon icon={faThumbsDown} />
                  {question.downvotes}
                </button>
                <div className="question-tags">
                  {question.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedQuestion ? (
          <div className="question-detail">
            {console.log('Rendering selected question:', selectedQuestion.title)}
            <div className="question-full">
              <div className="question-header">
                <h2>{selectedQuestion.title}</h2>
                <span className="category-badge">{selectedQuestion.category}</span>
              </div>
              <div className="question-content">
                <p>{selectedQuestion.content}</p>
              </div>
              <div className="question-meta">
                <div className="question-author">
                  <FontAwesomeIcon icon={faUser} />
                  <div>
                    <span>{selectedQuestion.author}</span>
                    <span className="author-role">{selectedQuestion.authorRole}</span>
                  </div>
                </div>
                <div className="question-stats">
                  <span className="time">
                    <FontAwesomeIcon icon={faClock} />
                    {formatTimeAgo(selectedQuestion.timestamp)}
                  </span>
                  <div className="question-votes">
                    <button 
                      className="vote-btn"
                      onClick={() => handleVote(selectedQuestion.id, 'up')}
                    >
                      <FontAwesomeIcon icon={faThumbsUp} />
                      {selectedQuestion.upvotes}
                    </button>
                    <button 
                      className="vote-btn"
                      onClick={() => handleVote(selectedQuestion.id, 'down')}
                    >
                      <FontAwesomeIcon icon={faThumbsDown} />
                      {selectedQuestion.downvotes}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="answers-section">
              <h3>
                {selectedQuestion.answers.length} Answer{selectedQuestion.answers.length !== 1 ? 's' : ''}
              </h3>
              <div className="answers-list">
                {selectedQuestion.answers.map(answer => (
                  <div key={answer.id} className="answer-card">
                    <div className="answer-header">
                      <div className="answer-author">
                        <FontAwesomeIcon icon={faUser} />
                        <div>
                          <span>{answer.author}</span>
                          <span className="author-role">{answer.authorRole}</span>
                        </div>
                      </div>
                      {answer.isAccepted && (
                        <span className="accepted-badge">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Accepted Answer
                        </span>
                      )}
                    </div>
                    <div className="answer-content">
                      <p>{answer.content}</p>
                    </div>
                    <div className="answer-meta">
                      <span className="answer-time">
                        <FontAwesomeIcon icon={faClock} />
                        {formatTimeAgo(answer.timestamp)}
                      </span>
                      <button 
                        className="vote-btn"
                        onClick={() => handleVote(selectedQuestion.id, 'up', answer.id)}
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                        {answer.upvotes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmitAnswer} className="answer-form">
                <h4>Your Answer</h4>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Share your knowledge and help the community..."
                  rows={4}
                  required
                />
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Posting...' : 'Post Answer'}
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="question-detail">
            <div className="no-question-selected">
              <FontAwesomeIcon icon={faQuestionCircle} className="placeholder-icon" />
              <h3>Select a Question</h3>
              <p>Click on any question from the list to view its details and answers.</p>
            </div>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default QASession;
