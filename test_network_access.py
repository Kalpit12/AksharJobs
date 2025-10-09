#!/usr/bin/env python3
"""
Network Access Test Script for AksharJobs
This script tests if the website is accessible from the network.
"""

import requests
import socket
import subprocess
import sys
import time
from pathlib import Path

def get_local_ip():
    """Get the local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

def check_port_open(host, port):
    """Check if a port is open and accepting connections"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(5)
        result = s.connect_ex((host, port))
        s.close()
        return result == 0
    except Exception:
        return False

def test_backend_api(host, port):
    """Test backend API endpoints"""
    base_url = f"http://{host}:{port}"
    
    endpoints = [
        "/api/auth/get_user?userId=test",
        "/api/jobs/get_jobs",
        "/health"
    ]
    
    results = {}
    
    for endpoint in endpoints:
        try:
            url = f"{base_url}{endpoint}"
            response = requests.get(url, timeout=10)
            results[endpoint] = {
                "status_code": response.status_code,
                "accessible": True,
                "error": None
            }
        except requests.exceptions.RequestException as e:
            results[endpoint] = {
                "status_code": None,
                "accessible": False,
                "error": str(e)
            }
    
    return results

def test_frontend(host, port):
    """Test frontend accessibility"""
    try:
        url = f"http://{host}:{port}"
        response = requests.get(url, timeout=10)
        return {
            "status_code": response.status_code,
            "accessible": response.status_code == 200,
            "content_length": len(response.content),
            "error": None
        }
    except requests.exceptions.RequestException as e:
        return {
            "status_code": None,
            "accessible": False,
            "content_length": 0,
            "error": str(e)
        }

def main():
    """Main test function"""
    print("🌐 AksharJobs Network Access Test")
    print("=" * 50)
    
    local_ip = get_local_ip()
    print(f"📍 Local IP: {local_ip}")
    print()
    
    # Test backend (port 3002)
    print("🔧 Testing Backend Server (Port 3002)...")
    backend_port_open = check_port_open(local_ip, 3002)
    print(f"   Port 3002 open: {'✅ Yes' if backend_port_open else '❌ No'}")
    
    if backend_port_open:
        print("   Testing API endpoints...")
        api_results = test_backend_api(local_ip, 3002)
        for endpoint, result in api_results.items():
            status = "✅" if result["accessible"] else "❌"
            print(f"   {endpoint}: {status} (Status: {result['status_code']})")
    else:
        print("   ⚠️  Backend server is not running or not accessible")
    
    print()
    
    # Test frontend (port 3003)
    print("🎨 Testing Frontend Server (Port 3003)...")
    frontend_port_open = check_port_open(local_ip, 3003)
    print(f"   Port 3003 open: {'✅ Yes' if frontend_port_open else '❌ No'}")
    
    if frontend_port_open:
        print("   Testing frontend accessibility...")
        frontend_result = test_frontend(local_ip, 3003)
        status = "✅" if frontend_result["accessible"] else "❌"
        print(f"   Frontend accessible: {status} (Status: {frontend_result['status_code']})")
        print(f"   Content length: {frontend_result['content_length']} bytes")
    else:
        print("   ⚠️  Frontend server is not running or not accessible")
    
    print()
    
    # Summary
    print("📊 Test Summary:")
    print(f"   Backend (Port 3002): {'✅ Working' if backend_port_open else '❌ Not Working'}")
    print(f"   Frontend (Port 3003): {'✅ Working' if frontend_port_open else '❌ Not Working'}")
    
    if backend_port_open and frontend_port_open:
        print()
        print("🎉 Network access is working!")
        print(f"🌍 Share this URL with others: http://{local_ip}:3003")
        print()
        print("📱 Test from other devices:")
        print(f"   - Mobile: http://{local_ip}:3003")
        print(f"   - Other computers: http://{local_ip}:3003")
        print()
        print("✅ Ready for testing with other people on your WiFi!")
    else:
        print()
        print("❌ Network access is not working properly.")
        print("🔧 Troubleshooting steps:")
        if not backend_port_open:
            print("   - Start backend server: cd backend && python start_backend.py")
        if not frontend_port_open:
            print("   - Start frontend server: cd frontend && npm start")
        print("   - Configure firewall: configure_network_access.bat")
        print("   - Check if ports are being used by other applications")

if __name__ == "__main__":
    main()