import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPencilAlt,
  faEllipsisV,
  faVideo,
  faPhone,
  faPaperPlane,
  faSmile,
  faPaperclip,
  faCheck,
  faCheckDouble,
  faBell,
  faLink,
  faImage,
  faFileAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { buildApiUrl } from '../config/api';
import { useAuth } from '../context/AuthContext';
import './ProfessionalMessaging.css';

const ProfessionalMessaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeConversation) {
      fetchConversationMessages(activeConversation.userId);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close options menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/messages/'), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const groupedConversations = groupMessagesByUser(response.data.messages || []);
        setConversations(groupedConversations);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const groupMessagesByUser = (messages) => {
    const grouped = {};
    
    messages.forEach(msg => {
      const otherUserId = msg.other_user_id;
      
      if (!grouped[otherUserId]) {
        grouped[otherUserId] = {
          userId: otherUserId,
          userName: msg.other_user_name || 'User',
          userAvatar: msg.other_user_avatar || null,
          lastMessage: msg.content,
          lastMessageTime: msg.created_at,
          unreadCount: 0,
          isPinned: false,
          isTyping: false,
          messages: []
        };
      }
      
      // Update if this is a newer message
      const currentTime = new Date(grouped[otherUserId].lastMessageTime);
      const msgTime = new Date(msg.created_at);
      
      if (msgTime > currentTime) {
        grouped[otherUserId].lastMessage = msg.content;
        grouped[otherUserId].lastMessageTime = msg.created_at;
      }
      
      // Count unread messages
      if (!msg.is_read && !msg.is_sent) {
        grouped[otherUserId].unreadCount++;
      }
    });

    return Object.values(grouped).sort((a, b) => 
      new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
  };

  const fetchConversationMessages = async (otherUserId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        buildApiUrl(`/api/messages/conversation/${otherUserId}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessages(response.data.conversation || []);
        
        // Mark conversation as read
        await axios.put(
          buildApiUrl(`/api/messages/mark-conversation-read/${otherUserId}`),
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (error) {
      console.error('Error fetching conversation:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !activeConversation) return;

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        buildApiUrl('/api/messages/send'),
        {
          recipient_id: activeConversation.userId,
          content: messageInput.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMessages([...messages, response.data.message]);
        setMessageInput('');
        fetchConversations(); // Refresh conversation list
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter(c => c.isPinned);
  const regularConversations = filteredConversations.filter(c => !c.isPinned);

  if (loading) {
    return (
      <div className="messaging-loading">
        <div className="spinner"></div>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <>
      {/* New Message Modal */}
      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          onMessageSent={(newConv) => {
            setShowNewMessageModal(false);
            setActiveConversation(newConv);
            fetchConversations();
          }}
        />
      )}

      <div className="professional-messaging">
        {/* Conversations List Panel */}
        <div className="conversations-panel">
        <div className="conversations-header">
          <h2>Messages</h2>
          <div className="header-actions">
            <button 
              className="icon-btn compose-btn" 
              title="New Message"
              onClick={() => setShowNewMessageModal(true)}
            >
              <FontAwesomeIcon icon={faPencilAlt} />
            </button>
            <div className="options-menu-wrapper" ref={optionsMenuRef}>
              <button 
                className="icon-btn options-btn" 
                title="More Options"
                onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
              
              {showOptionsMenu && (
                <div className="header-options-dropdown">
                  <div className="option-item" onClick={() => {
                    setShowOptionsMenu(false);
                    alert('Mark all as read');
                  }}>
                    <FontAwesomeIcon icon={faCheckDouble} />
                    <span>Mark all as read</span>
                  </div>
                  <div className="option-item" onClick={() => {
                    setShowOptionsMenu(false);
                    setSearchTerm('');
                  }}>
                    <FontAwesomeIcon icon={faSearch} />
                    <span>Clear search</span>
                  </div>
                  <div className="option-item" onClick={() => {
                    setShowOptionsMenu(false);
                    fetchConversations();
                  }}>
                    <FontAwesomeIcon icon={faCheck} />
                    <span>Refresh conversations</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="conversations-list">
          {pinnedConversations.length > 0 && (
            <>
              <div className="section-label">Pinned</div>
              {pinnedConversations.map((conv) => (
                <ConversationItem
                  key={conv.userId}
                  conversation={conv}
                  isActive={activeConversation?.userId === conv.userId}
                  onClick={() => setActiveConversation(conv)}
                />
              ))}
            </>
          )}

          {regularConversations.length > 0 && (
            <>
              <div className="section-label">All Messages</div>
              {regularConversations.map((conv) => (
                <ConversationItem
                  key={conv.userId}
                  conversation={conv}
                  isActive={activeConversation?.userId === conv.userId}
                  onClick={() => setActiveConversation(conv)}
                />
              ))}
            </>
          )}

          {filteredConversations.length === 0 && (
            <div className="empty-conversations">
              <FontAwesomeIcon icon={faUser} />
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Window Panel */}
      <div className="chat-panel">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-avatar">
                  {activeConversation.userAvatar ? (
                    <img src={activeConversation.userAvatar} alt={activeConversation.userName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {getInitials(activeConversation.userName)}
                    </div>
                  )}
                </div>
                <div>
                  <h3>{activeConversation.userName}</h3>
                  {activeConversation.isTyping && (
                    <p className="typing-indicator">typing...</p>
                  )}
                </div>
              </div>
              <div className="chat-header-actions">
                <button className="icon-btn" title="Video Call">
                  <FontAwesomeIcon icon={faVideo} />
                </button>
                <button className="icon-btn" title="Voice Call">
                  <FontAwesomeIcon icon={faPhone} />
                </button>
                <button className="icon-btn" title="More Options">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
            </div>

            <div className="messages-container">
              {messages.map((msg, index) => {
                const showDate = index === 0 || 
                  new Date(messages[index - 1].created_at).toDateString() !== new Date(msg.created_at).toDateString();
                
                return (
                  <React.Fragment key={msg._id || index}>
                    {showDate && (
                      <div className="date-separator">
                        {new Date(msg.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                    <MessageBubble
                      message={msg}
                      isSent={msg.is_sent || msg.sender_id === user?.userId}
                      senderName={msg.is_sent ? 'You' : activeConversation.userName}
                    />
                  </React.Fragment>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-container" onSubmit={sendMessage}>
              <button type="button" className="icon-btn" title="Attach File">
                <FontAwesomeIcon icon={faPaperclip} />
              </button>
              <button type="button" className="icon-btn" title="Emoji">
                <FontAwesomeIcon icon={faSmile} />
              </button>
              <input
                type="text"
                placeholder="Type your message here..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="message-input"
              />
              <button 
                type="submit" 
                className="send-btn" 
                disabled={!messageInput.trim() || sending}
                title="Send Message"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <FontAwesomeIcon icon={faUser} className="empty-icon" />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        )}
      </div>

      {/* Info Panel */}
      {activeConversation && (
        <div className="info-panel">
          <h3 className="info-panel-title">Conversation Info</h3>
          
          <div className="info-section">
            <div className="info-section-header">
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Description</span>
            </div>
            <p className="info-text">
              Direct conversation with {activeConversation.userName}
            </p>
          </div>

          <div className="info-section">
            <div className="info-section-header">
              <FontAwesomeIcon icon={faBell} />
              <span>Notifications</span>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="info-section">
            <div className="info-section-header">
              <FontAwesomeIcon icon={faImage} />
              <span>Media</span>
            </div>
            <div className="media-grid">
              <div className="media-placeholder">No media shared yet</div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

// Conversation Item Component
const ConversationItem = ({ conversation, isActive, onClick }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div 
      className={`conversation-item ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="conversation-avatar">
        {conversation.userAvatar ? (
          <img src={conversation.userAvatar} alt={conversation.userName} />
        ) : (
          <div className="avatar-placeholder">
            {getInitials(conversation.userName)}
          </div>
        )}
      </div>

      <div className="conversation-content">
        <div className="conversation-top">
          <h4 className="conversation-name">{conversation.userName}</h4>
          <span className="conversation-time">{formatTime(conversation.lastMessageTime)}</span>
        </div>
        <div className="conversation-bottom">
          {conversation.isTyping ? (
            <p className="typing-text">typing...</p>
          ) : (
            <p className="last-message">{conversation.lastMessage}</p>
          )}
          {conversation.unreadCount > 0 && (
            <span className="unread-badge">{conversation.unreadCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble = ({ message, isSent, senderName }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className={`message-wrapper ${isSent ? 'sent' : 'received'}`}>
      <div className="message-bubble">
        {!isSent && <div className="sender-name">{senderName}</div>}
        <div className="message-content">{message.content}</div>
        <div className="message-meta">
          <span className="message-time">{formatTime(message.created_at)}</span>
          {isSent && (
            <FontAwesomeIcon 
              icon={message.is_read ? faCheckDouble : faCheck} 
              className={`read-status ${message.is_read ? 'read' : ''}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// New Message Modal Component
const NewMessageModal = ({ onClose, onMessageSent }) => {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [searching, setSearching] = useState(false);
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState('');

  const searchUser = async () => {
    if (!recipientEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setSearching(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        buildApiUrl(`/api/auth/get_user?email=${recipientEmail}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        setRecipientUser(response.data);
        setError('');
      }
    } catch (error) {
      setError('User not found. Please check the email address.');
      setRecipientUser(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSend = async () => {
    if (!recipientUser) {
      setError('Please search for a user first');
      return;
    }

    if (!messageText.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        buildApiUrl('/api/messages/send'),
        {
          recipient_id: recipientUser._id || recipientUser.userId,
          content: messageText.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onMessageSent({
          userId: recipientUser._id || recipientUser.userId,
          userName: `${recipientUser.firstName} ${recipientUser.lastName}`,
          userAvatar: recipientUser.profileImage || recipientUser.companyLogo
        });
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="new-message-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>New Message</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="form-group">
            <label>To (Email):</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                placeholder="Enter recipient email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchUser()}
                className="modal-input"
              />
              <button 
                onClick={searchUser} 
                className="search-user-btn"
                disabled={searching}
              >
                {searching ? 'Searching...' : 'Find User'}
              </button>
            </div>
          </div>

          {recipientUser && (
            <div className="recipient-preview">
              <FontAwesomeIcon icon={faCheck} style={{ color: '#10b981' }} />
              <span>Found: {recipientUser.firstName} {recipientUser.lastName}</span>
            </div>
          )}

          <div className="form-group">
            <label>Message:</label>
            <textarea
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="modal-textarea"
              rows={4}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleSend} className="btn-send" disabled={!recipientUser || !messageText.trim()}>
            <FontAwesomeIcon icon={faPaperPlane} /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalMessaging;

