import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, 
  faPaperPlane, 
  faTimes, 
  faMinus, 
  faMicrophone, 
  faMicrophoneSlash,
  faSmile,
  faPaperclip,
  faSpinner,
  faThumbsUp,
  faThumbsDown,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/api';
import '../styles/GeminiChatbot.css';

const GeminiChatbot = ({ userType = 'jobSeeker' }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'bot',
        text: userType === 'recruiter' 
          ? "👋 Hello! I'm your AI recruiting assistant powered by Gemini. I can help you with candidate screening, interview questions, job descriptions, and recruitment strategies. How can I assist you today?"
          : "👋 Hi there! I'm your AI career assistant powered by Gemini. I can help you with resume optimization, interview preparation, job search strategies, and career advice. What would you like to know?",
        timestamp: new Date(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [userType]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch(buildApiUrl('/api/chat/gemini'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          message: currentInput,
          userType: userType,
          userId: user?.userId,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: data.response || "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
        isAI: true
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickQuestion = (question) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  const handleVoiceToggle = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsRecording(!isRecording);
      // Voice recognition implementation would go here
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsOpen(false);
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const getQuickQuestions = () => {
    if (userType === 'recruiter') {
      return [
        "How to write effective job descriptions?",
        "Best interview questions for developers",
        "How to assess cultural fit?",
        "Recruitment metrics to track"
      ];
    } else {
      return [
        "How to optimize my resume?",
        "Common interview questions",
        "How to negotiate salary?",
        "Career change advice"
      ];
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`gemini_chatbot ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {!isOpen ? (
        <button 
          className="gemini_chatbot_toggle"
          onClick={() => setIsOpen(true)}
        >
          <div className="gemini_chatbot_icon">
            <FontAwesomeIcon icon={faRobot} />
            <div className="gemini_chatbot_pulse"></div>
          </div>
          <span>AI Assistant</span>
        </button>
      ) : (
        <div className="gemini_chatbot_container">
          <div className="gemini_chatbot_header">
            <div className="gemini_chatbot_title">
              <div className="gemini_chatbot_avatar">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div className="gemini_chatbot_info">
                <h3>Gemini AI Assistant</h3>
                <p className="gemini_chatbot_status">
                  <span className={`status_indicator ${isConnected ? 'online' : 'offline'}`}></span>
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <div className="gemini_chatbot_controls">
              <button 
                className="gemini_chatbot_control_btn"
                onClick={clearChat}
                title="Clear chat"
              >
                <FontAwesomeIcon icon={faRefresh} />
              </button>
              <button 
                className="gemini_chatbot_control_btn"
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button 
                className="gemini_chatbot_control_btn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="gemini_chatbot_messages">
                {messages.map((message) => (
                  <div key={message.id} className={`gemini_chatbot_message ${message.type}`}>
                    <div className="gemini_chatbot_message_content">
                      {message.type === 'bot' && (
                        <div className="gemini_chatbot_avatar">
                          <FontAwesomeIcon icon={faRobot} />
                        </div>
                      )}
                      <div className="gemini_chatbot_message_bubble">
                        <div className="gemini_chatbot_message_text">
                          {message.text}
                        </div>
                        <div className="gemini_chatbot_message_actions">
                          <span className="gemini_chatbot_message_time">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.type === 'bot' && !message.isWelcome && (
                            <div className="gemini_chatbot_feedback">
                              <button className="feedback_btn" title="Good response">
                                <FontAwesomeIcon icon={faThumbsUp} />
                              </button>
                              <button className="feedback_btn" title="Poor response">
                                <FontAwesomeIcon icon={faThumbsDown} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="gemini_chatbot_message bot">
                    <div className="gemini_chatbot_message_content">
                      <div className="gemini_chatbot_avatar">
                        <FontAwesomeIcon icon={faRobot} />
                      </div>
                      <div className="gemini_chatbot_message_bubble">
                        <div className="gemini_chatbot_typing">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="gemini_chatbot_quick_questions">
                {getQuickQuestions().map((question, index) => (
                  <button
                    key={index}
                    className="gemini_chatbot_quick_btn"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>

              <form className="gemini_chatbot_input_form" onSubmit={handleSendMessage}>
                <div className="gemini_chatbot_input_container">
                  <button 
                    type="button" 
                    className="gemini_chatbot_attach_btn"
                    title="Attach file"
                  >
                    <FontAwesomeIcon icon={faPaperclip} />
                  </button>
                  <input
                    ref={inputRef}
                    type="text"
                    className="gemini_chatbot_input"
                    placeholder={`Ask me anything about ${userType === 'recruiter' ? 'recruitment' : 'your career'}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isTyping}
                  />
                  <button 
                    type="button" 
                    className={`gemini_chatbot_voice_btn ${isRecording ? 'recording' : ''}`}
                    onClick={handleVoiceToggle}
                    title="Voice input"
                  >
                    <FontAwesomeIcon icon={isRecording ? faMicrophoneSlash : faMicrophone} />
                  </button>
                  <button 
                    type="submit" 
                    className="gemini_chatbot_send_btn"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    {isTyping ? (
                      <FontAwesomeIcon icon={faSpinner} className="spinning" />
                    ) : (
                      <FontAwesomeIcon icon={faPaperPlane} />
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiChatbot;
