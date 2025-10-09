#!/usr/bin/env python3
"""
Network Agnostic Startup Script for AksharJobs
This script starts both frontend and backend with proper network configuration.
"""

import subprocess
import sys
import os
import socket
import time
import threading
from pathlib import Path

def get_local_ip():
    """Get the local IP address that other devices can reach"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def check_port_available(port):
    """Check if a port is available"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('', port))
        s.close()
        return True
    except OSError:
        return False

def start_backend():
    """Start the backend server"""
    print("🚀 Starting Backend Server...")
    
    # Change to backend directory
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("❌ Backend directory not found!")
        return False
    
    os.chdir(backend_dir)
    
    try:
        # Start the backend server
        subprocess.run([sys.executable, "start_backend.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start backend: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⏹️  Backend stopped by user")
        return False
    
    return True

def start_frontend():
    """Start the frontend server"""
    print("🎨 Starting Frontend Server...")
    
    # Change to frontend directory
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return False
    
    os.chdir(frontend_dir)
    
    try:
        # Start the frontend server
        subprocess.run(["npm", "start"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start frontend: {e}")
        return False
    except KeyboardInterrupt:
        print("\n⏹️  Frontend stopped by user")
        return False
    
    return True

def main():
    """Main function"""
    print("🌐 AksharJobs Network Agnostic Startup")
    print("=" * 50)
    
    local_ip = get_local_ip()
    print(f"📍 Local IP: {local_ip}")
    
    # Check if ports are available
    if not check_port_available(3002):
        print("❌ Port 3002 (backend) is already in use!")
        print("   Please stop any existing backend server first.")
        return
    
    if not check_port_available(3003):
        print("❌ Port 3003 (frontend) is already in use!")
        print("   Please stop any existing frontend server first.")
        return
    
    print("✅ Ports 3002 and 3003 are available")
    
    # Display access information
    print(f"\n🌍 Access Information:")
    print(f"   Backend API: http://{local_ip}:3002")
    print(f"   Frontend: http://{local_ip}:3003")
    print(f"   Local access: http://localhost:3003")
    print(f"\n📱 Share this URL with others: http://{local_ip}:3003")
    
    print(f"\n🚀 Starting servers...")
    print("   Press Ctrl+C to stop both servers")
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend, daemon=True)
    backend_thread.start()
    
    # Wait a moment for backend to start
    time.sleep(3)
    
    # Start frontend in the main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n⏹️  Shutting down servers...")
        print("✅ Servers stopped successfully")

if __name__ == "__main__":
    main()
