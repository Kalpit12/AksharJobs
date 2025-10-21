import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope, faPaperPlane, faUsers, faFilter, faEdit, faSave,
  faEye, faTrash, faPlus, faCode, faClone, faDownload
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/AdminMessaging.css';

const AdminMessaging = () => {
  const [activeTab, setActiveTab] = useState('compose');
  const [messageType, setMessageType] = useState('email');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [message, setMessage] = useState({
    subject: '',
    body: '',
    recipients: 'all',
    userType: 'all'
  });
  const [customTemplate, setCustomTemplate] = useState({
    name: '',
    subject: '',
    body: '',
    type: 'email'
  });
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);

  useEffect(() => {
    loadTemplates();
    loadSentMessages();
  }, []);

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/message-templates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(response.data || getDefaultTemplates());
    } catch (error) {
      console.error('Error loading templates:', error);
      setTemplates(getDefaultTemplates());
    }
  };

  const getDefaultTemplates = () => [
    {
      id: 1,
      name: 'Welcome Email',
      type: 'email',
      subject: 'Welcome to AksharJobs!',
      body: `Hello {{firstName}},

Welcome to AksharJobs! We're excited to have you on board.

{{#if role == 'recruiter'}}
Start by posting your first job and discovering talented candidates.
{{/if}}

{{#if role == 'jobSeeker'}}
Complete your profile and start applying to your dream jobs!
{{/if}}

Best regards,
The AksharJobs Team`
    },
    {
      id: 2,
      name: 'Application Received',
      type: 'email',
      subject: 'Application Received - {{jobTitle}}',
      body: `Hello {{firstName}},

Thank you for applying to {{jobTitle}} at {{companyName}}.

We have received your application and our team will review it shortly.

Best regards,
{{companyName}} Recruitment Team`
    },
    {
      id: 3,
      name: 'Interview Invitation',
      type: 'email',
      subject: 'Interview Invitation - {{jobTitle}}',
      body: `Hello {{firstName}},

We're impressed with your application for {{jobTitle}}!

We'd like to invite you for an interview:
Date: {{interviewDate}}
Time: {{interviewTime}}
Location: {{interviewLocation}}

Please confirm your availability.

Best regards,
{{companyName}} Recruitment Team`
    },
    {
      id: 4,
      name: 'System Update',
      type: 'message',
      subject: 'Important System Update',
      body: `Hello {{firstName}},

We wanted to inform you about an important system update:

{{updateDetails}}

If you have any questions, please contact our support team.

Best regards,
AksharJobs Team`
    }
  ];

  const loadSentMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/sent-messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSentMessages(response.data || []);
    } catch (error) {
      console.error('Error loading sent messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.subject || !message.body) {
      alert('Please fill in subject and message body');
      return;
    }

    // eslint-disable-next-line no-restricted-globals
    if (!confirm(`Send ${messageType} to ${message.recipients} ${message.userType} users?`)) {
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/admin/send-message', {
        ...message,
        type: messageType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert(`✅ ${messageType === 'email' ? 'Email' : 'Message'} sent successfully to ${response.data.sentCount} users!`);
      setMessage({ subject: '', body: '', recipients: 'all', userType: 'all' });
      loadSentMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('❌ Error sending message: ' + (error.response?.data?.error || error.message));
    } finally {
      setSending(false);
    }
  };

  const saveTemplate = async () => {
    if (!customTemplate.name || !customTemplate.body) {
      alert('Please fill in template name and body');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/message-templates', customTemplate, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Template saved successfully!');
      setCustomTemplate({ name: '', subject: '', body: '', type: 'email' });
      loadTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      alert('❌ Error saving template');
    }
  };

  const applyTemplate = (template) => {
    setMessage({
      ...message,
      subject: template.subject,
      body: template.body
    });
    setActiveTab('compose');
  };

  return (
    <div className="admin-messaging">
      <div className="messaging-header">
        <h2><FontAwesomeIcon icon={faEnvelope} /> Messaging & Email Center</h2>
        <div className="message-type-selector">
          <button 
            className={`type-btn ${messageType === 'email' ? 'active' : ''}`}
            onClick={() => setMessageType('email')}
          >
            <i className="fas fa-envelope"></i> Email
          </button>
          <button 
            className={`type-btn ${messageType === 'message' ? 'active' : ''}`}
            onClick={() => setMessageType('message')}
          >
            <i className="fas fa-comment"></i> In-App Message
          </button>
        </div>
      </div>

      <div className="messaging-tabs">
        <button 
          className={`tab ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          <FontAwesomeIcon icon={faPaperPlane} /> Compose
        </button>
        <button 
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <FontAwesomeIcon icon={faCode} /> Templates
        </button>
        <button 
          className={`tab ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          <FontAwesomeIcon icon={faEnvelope} /> Sent Messages
        </button>
      </div>

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="compose-area">
          <div className="compose-header">
            <h3>Compose {messageType === 'email' ? 'Email' : 'Message'}</h3>
          </div>

          <div className="compose-form">
            <div className="form-row">
              <div className="form-group">
                <label>Recipients</label>
                <select 
                  value={message.recipients}
                  onChange={(e) => setMessage({ ...message, recipients: e.target.value })}
                >
                  <option value="all">All Users</option>
                  <option value="selected">Selected Users</option>
                </select>
              </div>
              <div className="form-group">
                <label>User Type</label>
                <select 
                  value={message.userType}
                  onChange={(e) => setMessage({ ...message, userType: e.target.value })}
                >
                  <option value="all">All Types</option>
                  <option value="recruiter">Recruiters Only</option>
                  <option value="jobSeeker">Job Seekers Only</option>
                  <option value="intern">Interns Only</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text"
                value={message.subject}
                onChange={(e) => setMessage({ ...message, subject: e.target.value })}
                placeholder="Enter subject..."
                className="subject-input"
              />
            </div>

            <div className="form-group">
              <label>Message Body</label>
              <div className="editor-toolbar">
                <button className="toolbar-btn" title="Bold"><i className="fas fa-bold"></i></button>
                <button className="toolbar-btn" title="Italic"><i className="fas fa-italic"></i></button>
                <button className="toolbar-btn" title="Link"><i className="fas fa-link"></i></button>
                <div className="toolbar-divider"></div>
                <button className="toolbar-btn" title="Variable: Name">{'{{firstName}}'}</button>
                <button className="toolbar-btn" title="Variable: Email">{'{{email}}'}</button>
              </div>
              <textarea 
                value={message.body}
                onChange={(e) => setMessage({ ...message, body: e.target.value })}
                placeholder="Enter your message..."
                className="message-body-input"
                rows="12"
              />
              <div className="editor-helper">
                <p><strong>Available Variables:</strong></p>
                <code>{'{{firstName}}'}, {'{{lastName}}'}, {'{{email}}'}, {'{{role}}'}, {'{{companyName}}'}</code>
              </div>
            </div>

            <div className="compose-actions">
              <button className="btn btn-primary" onClick={sendMessage} disabled={sending}>
                <FontAwesomeIcon icon={faPaperPlane} /> {sending ? 'Sending...' : 'Send Now'}
              </button>
              <button className="btn btn-secondary">
                <FontAwesomeIcon icon={faEye} /> Preview
              </button>
              <button className="btn btn-secondary" onClick={() => setMessage({ subject: '', body: '', recipients: 'all', userType: 'all' })}>
                <i className="fas fa-times"></i> Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="templates-area">
          <div className="templates-header">
            <h3>Message Templates</h3>
            <button className="btn btn-primary" onClick={() => {
              // Show create template form
              document.getElementById('create-template-form').style.display = 'block';
            }}>
              <FontAwesomeIcon icon={faPlus} /> Create Template
            </button>
          </div>

          {/* Create Template Form */}
          <div id="create-template-form" style={{ display: 'none' }} className="card">
            <h4>Create New Template</h4>
            <div className="form-group">
              <label>Template Name</label>
              <input 
                type="text"
                value={customTemplate.name}
                onChange={(e) => setCustomTemplate({ ...customTemplate, name: e.target.value })}
                placeholder="e.g., Welcome Email"
              />
            </div>
            <div className="form-group">
              <label>Template Type</label>
              <select 
                value={customTemplate.type}
                onChange={(e) => setCustomTemplate({ ...customTemplate, type: e.target.value })}
              >
                <option value="email">Email</option>
                <option value="message">In-App Message</option>
              </select>
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text"
                value={customTemplate.subject}
                onChange={(e) => setCustomTemplate({ ...customTemplate, subject: e.target.value })}
                placeholder="Email subject..."
              />
            </div>
            <div className="form-group">
              <label>Template Body</label>
              <textarea 
                value={customTemplate.body}
                onChange={(e) => setCustomTemplate({ ...customTemplate, body: e.target.value })}
                rows="10"
                placeholder="Use {{variableName}} for dynamic content..."
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={saveTemplate}>
                <FontAwesomeIcon icon={faSave} /> Save Template
              </button>
              <button className="btn btn-secondary" onClick={() => {
                document.getElementById('create-template-form').style.display = 'none';
                setCustomTemplate({ name: '', subject: '', body: '', type: 'email' });
              }}>
                Cancel
              </button>
            </div>
          </div>

          {/* Templates List */}
          <div className="templates-grid">
            {templates.map(template => (
              <div key={template.id} className="template-card">
                <div className="template-header">
                  <div>
                    <h4>{template.name}</h4>
                    <span className="template-type">{template.type}</span>
                  </div>
                  <div className="template-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => applyTemplate(template)}
                      title="Use Template"
                    >
                      <FontAwesomeIcon icon={faClone} />
                    </button>
                    <button 
                      className="btn-icon"
                      title="Edit Template"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="btn-icon btn-danger"
                      title="Delete Template"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
                <div className="template-preview">
                  <strong>Subject:</strong> {template.subject}
                  <div className="template-body">{template.body.substring(0, 150)}...</div>
                </div>
                <button 
                  className="btn btn-sm btn-primary"
                  onClick={() => applyTemplate(template)}
                >
                  Use This Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sent Messages Tab */}
      {activeTab === 'sent' && (
        <div className="sent-messages-area">
          <div className="sent-header">
            <h3>Sent Messages History</h3>
            <div className="filter-controls">
              <select className="filter-select">
                <option>All Types</option>
                <option>Emails</option>
                <option>Messages</option>
              </select>
              <select className="filter-select">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <div className="sent-messages-list">
            {sentMessages.length > 0 ? (
              sentMessages.map((msg, index) => (
                <div key={index} className="sent-message-card">
                  <div className="message-info">
                    <h4>{msg.subject}</h4>
                    <p>Sent to: {msg.recipientCount} users ({msg.userType})</p>
                    <p className="message-date">{new Date(msg.sentAt).toLocaleString()}</p>
                  </div>
                  <div className="message-stats">
                    <span className="stat-badge success">✓ {msg.delivered || msg.recipientCount} Delivered</span>
                    <span className="stat-badge info">👁 {msg.opened || 0} Opened</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No messages sent yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessaging;
