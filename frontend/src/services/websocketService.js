import io from 'socket.io-client';
import { buildApiUrl } from '../config/api.js';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      console.log('WebSocket already connected');
      return;
    }

    // Skip WebSocket connection in development if not configured
    if (process.env.NODE_ENV === 'development') {
      console.log('🔌 WebSocket connection skipped in development mode');
      return;
    }

    // Check if we're on localhost - skip WebSocket if so
    const backendUrl = buildApiUrl('');
    if (backendUrl.includes('localhost') || backendUrl.includes('127.0.0.1')) {
      console.log('🔌 WebSocket connection skipped for localhost development');
      return;
    }

    // Temporarily disable WebSocket until server is updated with Socket.IO
    console.log('🔌 WebSocket connection temporarily disabled - server needs Socket.IO update');
    return;

    try {
      // Connect to the backend WebSocket server using dynamic API config
      const backendUrl = buildApiUrl('');
      console.log('🔌 Connecting to WebSocket at:', backendUrl);
      
      this.socket = io(backendUrl, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay
      });

      // Connection event handlers
      this.socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Authenticate with the server
        this.authenticate(token);
        
        // Emit connection event to listeners
        this.emit('connected', { message: 'Connected to real-time updates' });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        this.isConnected = false;
        this.emit('disconnected', { reason });
      });

      this.socket.on('connect_error', (error) => {
        this.isConnected = false;
        console.warn('🔌 WebSocket connection error:', error.message);
        
        // Don't show errors for expected connection issues
        if (error.message.includes('404') || 
            error.message.includes('WebSocket connection failed') ||
            error.message.includes('Transport unknown')) {
          console.log('🔌 WebSocket not available on server - continuing without real-time features');
          return;
        }
        
        this.emit('connection_error', { error: error.message });
      });

      // Authentication handlers
      this.socket.on('authenticated', (data) => {
        console.log('✅ WebSocket authenticated:', data);
        this.emit('authenticated', data);
      });

      this.socket.on('auth_error', (data) => {
        console.error('❌ WebSocket authentication error:', data);
        this.emit('auth_error', data);
      });

      // Notification handlers
      this.socket.on('new_notification', (notification) => {
        console.log('🔔 New notification received:', notification);
        this.emit('new_notification', notification);
      });

      this.socket.on('notification_count_update', (data) => {
        console.log('🔔 Notification count updated:', data.count);
        this.emit('notification_count_update', data);
      });

      // Message handlers
      this.socket.on('new_message', (message) => {
        console.log('💬 New message received:', message);
        this.emit('new_message', message);
      });

      this.socket.on('message_count_update', (data) => {
        console.log('💬 Message count updated:', data.count);
        this.emit('message_count_update', data);
      });

      // General error handler
      this.socket.on('error', (error) => {
        console.error('🔌 WebSocket error:', error);
        this.emit('error', error);
      });

    } catch (error) {
      console.error('Failed to initialize WebSocket:', error);
      this.emit('connection_error', { error: error.message });
    }
  }

  authenticate(token) {
    if (this.socket && this.isConnected) {
      console.log('🔐 Authenticating WebSocket...');
      this.socket.emit('authenticate', { token });
      
      // Join notification and message rooms
      this.socket.emit('join_notifications', { token });
      this.socket.emit('join_messages', { token });
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Event listener management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event listener for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  isWebSocketConnected() {
    return this.isConnected && this.socket && this.socket.connected;
  }

  getConnectionState() {
    return {
      connected: this.isConnected,
      socket: this.socket ? this.socket.connected : false,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create a singleton instance
const websocketService = new WebSocketService();

export default websocketService;
