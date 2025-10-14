import io from 'socket.io-client';
import { buildApiUrl } from '../config/api';

class StatusService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.heartbeatInterval = null;
    this.activityTimeout = null;
    this.status = 'offline';
    this.callbacks = [];
    
    // Activity detection
    this.lastActivity = Date.now();
    this.activityThreshold = 30000; // 30 seconds
    this.heartbeatInterval = 60000; // 1 minute
    
    this.setupActivityListeners();
  }

  connect() {
    if (this.socket && this.isConnected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token');
      if (!token) {
        reject(new Error('No authentication token found'));
        return;
      }

      // Connect to WebSocket
      this.socket = io(process.env.REACT_APP_BACKEND_URL || '', {
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        
        // Authenticate with the server
        this.socket.emit('authenticate', { token });
      });

      this.socket.on('authenticated', (data) => {
        console.log('WebSocket authenticated:', data);
        this.setStatus('online');
        this.startHeartbeat();
        resolve();
      });

      this.socket.on('auth_error', (error) => {
        console.error('WebSocket authentication error:', error);
        reject(new Error('Authentication failed'));
      });

      this.socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.setStatus('offline');
        this.stopHeartbeat();
      });

      this.socket.on('user_status_changed', (data) => {
        console.log('User status changed:', data);
        this.notifyCallbacks('status_changed', data);
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

      // Set connection timeout
      setTimeout(() => {
        if (!this.isConnected) {
          reject(new Error('Connection timeout'));
        }
      }, 10000);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.setStatus('offline');
    this.stopHeartbeat();
  }

  setupActivityListeners() {
    // Listen for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, this.handleActivity.bind(this), true);
    });

    // Handle page visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Handle beforeunload
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  handleActivity() {
    this.lastActivity = Date.now();
    
    // If user was offline and becomes active, set online
    if (this.status === 'offline' && this.isConnected) {
      this.setStatus('online');
      this.sendHeartbeat();
    }
    
    // Clear existing timeout
    if (this.activityTimeout) {
      clearTimeout(this.activityTimeout);
    }
    
    // Set timeout to go offline if no activity
    this.activityTimeout = setTimeout(() => {
      if (this.isConnected) {
        this.setStatus('offline');
      }
    }, this.activityThreshold);
  }

  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden, set offline
      this.setStatus('offline');
    } else {
      // Page is visible, set online if connected
      if (this.isConnected) {
        this.setStatus('online');
        this.sendHeartbeat();
      }
    }
  }

  handleBeforeUnload() {
    // Set offline when leaving the page
    this.setStatus('offline');
  }

  startHeartbeat() {
    this.stopHeartbeat(); // Clear any existing heartbeat
    
    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected && this.status === 'online') {
        this.sendHeartbeat();
      }
    }, this.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  sendHeartbeat() {
    if (this.socket && this.isConnected) {
      const token = localStorage.getItem('token');
      this.socket.emit('heartbeat', { token });
    }
  }

  setStatus(status) {
    if (this.status !== status) {
      this.status = status;
      this.notifyCallbacks('status_changed', { status });
      
      // Update status via API
      this.updateStatusOnServer(status);
    }
  }

  async updateStatusOnServer(status) {
    try {
      const token = localStorage.getItem('token');
      const endpoint = status === 'online' ? '/api/status/online' : '/api/status/offline';
      
      await fetch(buildApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error updating status on server:', error);
    }
  }

  getStatus() {
    return this.status;
  }

  isOnline() {
    return this.status === 'online';
  }

  onStatusChange(callback) {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  notifyCallbacks(event, data) {
    this.callbacks.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in status callback:', error);
      }
    });
  }

  async checkUserStatus(userId) {
    try {
      const response = await fetch(buildApiUrl(`/api/status/check/${userId}`));
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking user status:', error);
      return { status: 'offline', last_seen: null };
    }
  }
}

// Create singleton instance
const statusService = new StatusService();

export default statusService;
