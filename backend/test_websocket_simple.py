#!/usr/bin/env python3
"""
Simple test script to verify WebSocket functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS

# Create a simple Flask app for testing
app = Flask(__name__)
CORS(app, origins="*")

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

@socketio.on('connect')
def handle_connect():
    print(f"✅ Client connected: {request.sid}")
    emit('connected', {'message': 'Connected to test WebSocket server'})

@socketio.on('disconnect')
def handle_disconnect():
    print(f"❌ Client disconnected: {request.sid}")

@socketio.on('test_message')
def handle_test_message(data):
    print(f"📨 Received test message: {data}")
    emit('test_response', {'message': 'Test message received successfully!'})

@app.route('/')
def index():
    return "WebSocket Test Server is running!"

if __name__ == "__main__":
    print("🧪 Starting WebSocket Test Server...")
    print("🔌 WebSocket will be available at: http://localhost:3002")
    print("📡 Test with: socket.emit('test_message', {'test': 'data'})")
    print()
    
    socketio.run(app, debug=True, host='0.0.0.0', port=3002)
