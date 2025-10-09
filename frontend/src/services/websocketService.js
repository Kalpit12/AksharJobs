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
        // Only log WebSocket errors in development if they're not 404s
        if (process.env.NODE_ENV === 'development' && !error.message.includes('404')) {
          console.warn('🔌 WebSocket connection error (Socket.IO not configured):', error.message);
        }
        this.isConnected = false;
        // Don't emit error for Socket.IO 404 - it's expected
        if (!error.message.includes('404')) {
          this.emit('connection_error', { error: error.message });
        }
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
