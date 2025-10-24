import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faPaperPlane,
  faUser,
  faCircle,
  faTimes,
  faEdit,
  faEllipsisV,
  faTrash,
  faArchive,
  faReply,
  faFilter,
  faCheckDouble,
  faCheck,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import messageApi from '../api/messageApi';
import { buildApiUrl } from '../config/api';
import axios from 'axios';
import './MessagingSystem.css';

const MessagingSystem = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, archived
  const [users, setUsers] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchConversations();
    fetchUsers();
    
    // Poll for new messages every 10 seconds
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/profile/me'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageApi.getMessages();
      
      if (response.success && response.messages) {
        // Group messages by conversation
        const conversationMap = new Map();
        
        for (const msg of response.messages) {
          const otherUserId = msg.other_user_id;
          
          if (!conversationMap.has(otherUserId)) {
            conversationMap.set(otherUserId, {
              userId: otherUserId,
              lastMessage: msg.content,
              timestamp: msg.created_at,
              unread: !msg.is_sent && !msg.is_read ? 1 : 0,
              messages: [msg]
            });
          } else {
            const conv = conversationMap.get(otherUserId);
            conv.messages.push(msg);
            if (!msg.is_sent && !msg.is_read) {
              conv.unread++;
            }
            // Update last message if this is more recent
            if (new Date(msg.created_at) > new Date(conv.timestamp)) {
              conv.lastMessage = msg.content;
              conv.timestamp = msg.created_at;
            }
          }
        }
        
        const convArray = Array.from(conversationMap.values());
        
        // Fetch user details for each conversation
        const token = localStorage.getItem('token');
        const conversationsWithDetails = await Promise.all(
          convArray.map(async (conv) => {
            try {
              const userResponse = await axios.get(
                buildApiUrl(`/api/users/${conv.userId}`),
                { headers: { Authorization: `Bearer ${token}` } }
              );
              return {
                ...conv,
                userName: `${userResponse.data.firstName || 'Unknown'} ${userResponse.data.lastName || 'User'}`,
                userAvatar: userResponse.data.profilePicture,
                userRole: userResponse.data.role
              };
            } catch (error) {
              return {
                ...conv,
                userName: 'Unknown User',
                userAvatar: null,
                userRole: 'user'
              };
            }
          })
        );
        
        // Sort by most recent
        conversationsWithDetails.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setConversations(conversationsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(buildApiUrl('/api/users'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setMessages(conversation.messages.sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    ));
    
    // Mark messages as read
    try {
      await messageApi.markConversationRead(conversation.userId);
      // Update unread count
      setConversations(prev => 
        prev.map(c => 
          c.userId === conversation.userId 
            ? { ...c, unread: 0 } 
            : c
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await messageApi.sendMessage({
        recipient_id: selectedConversation.userId,
        content: newMessage.trim()
      });

      if (response.success) {
        // Add message to current conversation
        const sentMessage = {
          ...response.message,
          is_sent: true,
          sender_id: currentUser?._id || 'current_user'
        };
        
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
        
        // Update conversation list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const sendNewMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRecipient) return;

    try {
      setSending(true);
      const response = await messageApi.sendMessage({
        recipient_id: selectedRecipient._id || selectedRecipient.id,
        content: newMessage.trim()
      });

      if (response.success) {
        setShowComposeModal(false);
        setNewMessage('');
        setSelectedRecipient(null);
        fetchConversations();
        
        // Open the new conversation
        setTimeout(() => {
          const newConv = conversations.find(c => c.userId === (selectedRecipient._id || selectedRecipient.id));
          if (newConv) {
            openConversation(newConv);
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error sending new message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations
    .filter(conv => {
      // Apply filter
      if (filter === 'unread' && conv.unread === 0) return false;
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          conv.userName?.toLowerCase().includes(query) ||
          conv.lastMessage?.toLowerCase().includes(query)
        );
      }
      return true;
    });

  if (loading && conversations.length === 0) {
    return (
      <div className="messaging-system-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-system-container">
      <div className="messaging-layout">
        {/* Left Sidebar - Conversations List */}
        <div className="conversations-sidebar">
          <div className="sidebar-header">
            <h2>
              <FontAwesomeIcon icon={faPaperPlane} /> Messages
            </h2>
            <button 
              className="compose-btn"
              onClick={() => setShowComposeModal(true)}
              title="New Message"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </div>

          <div className="search-filter-bar">
            <div className="search-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="unread">Unread</option>
            </select>
          </div>

          <div className="conversations-list">
            {filteredConversations.length === 0 ? (
              <div className="empty-conversations">
                <FontAwesomeIcon icon={faPaperPlane} className="empty-icon" />
                <p>No conversations yet</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowComposeModal(true)}
                >
                  Start a Conversation
                </button>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.userId}
                  className={`conversation-item ${
                    selectedConversation?.userId === conv.userId ? 'active' : ''
                  }`}
                  onClick={() => openConversation(conv)}
                >
                  <div className="conversation-avatar">
                    {conv.userAvatar ? (
                      <img src={conv.userAvatar} alt={conv.userName} />
                    ) : (
                      <div className="avatar-placeholder">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}
                    {conv.unread > 0 && <span className="unread-indicator"></span>}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-top">
                      <h4 className="conversation-name">{conv.userName}</h4>
                      <span className="conversation-time">
                        {formatTime(conv.timestamp)}
                      </span>
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-preview">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="unread-badge">{conv.unread}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Message Thread */}
        <div className="message-thread">
          {selectedConversation ? (
            <>
              <div className="thread-header">
                <div className="thread-user-info">
                  <div className="thread-avatar">
                    {selectedConversation.userAvatar ? (
                      <img src={selectedConversation.userAvatar} alt={selectedConversation.userName} />
                    ) : (
                      <div className="avatar-placeholder">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{selectedConversation.userName}</h3>
                    <span className="user-role">
                      {selectedConversation.userRole === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                    </span>
                  </div>
                </div>
                <div className="thread-actions">
                  <button className="icon-btn" title="More options">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
                </div>
              </div>

              <div className="messages-container">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`message-bubble ${msg.is_sent ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      {msg.content}
                    </div>
                    <div className="message-footer">
                      <span className="message-time">
                        {formatTime(msg.created_at)}
                      </span>
                      {msg.is_sent && (
                        <span className="message-status">
                          <FontAwesomeIcon 
                            icon={msg.is_read ? faCheckDouble : faCheck} 
                            className={msg.is_read ? 'read' : 'sent'}
                          />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="message-input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-input"
                  disabled={sending}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <FontAwesomeIcon icon={faPaperPlane} />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <FontAwesomeIcon icon={faPaperPlane} className="placeholder-icon" />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="modal-overlay" onClick={() => setShowComposeModal(false)}>
          <div className="compose-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Message</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowComposeModal(false);
                  setSelectedRecipient(null);
                  setNewMessage('');
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>To:</label>
                <select
                  value={selectedRecipient?._id || selectedRecipient?.id || ''}
                  onChange={(e) => {
                    const user = users.find(u => (u._id || u.id) === e.target.value);
                    setSelectedRecipient(user);
                  }}
                  className="recipient-select"
                >
                  <option value="">Select a recipient...</option>
                  {users.map((user) => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.firstName} {user.lastName} - {user.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Message:</label>
                <textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="message-textarea"
                  rows="6"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowComposeModal(false);
                  setSelectedRecipient(null);
                  setNewMessage('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={sendNewMessage}
                disabled={!selectedRecipient || !newMessage.trim() || sending}
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagingSystem;

