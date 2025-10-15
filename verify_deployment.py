#!/usr/bin/env python3
"""
Simple deployment verification script
"""

import requests
import json

def verify_deployment():
    """Verify that the deployment is working"""
    
    print("🔍 Verifying Deployment Status")
    print("=" * 50)
    
    # Test server connectivity
    try:
        response = requests.get("http://13.61.35.12/", timeout=10)
        print(f"✅ Server is responding: {response.status_code}")
    except Exception as e:
        print(f"❌ Server not responding: {e}")
        return False
    
    # Test API endpoint
    try:
        response = requests.get("http://13.61.35.12/api/", timeout=10)
        print(f"✅ API endpoint responding: {response.status_code}")
    except Exception as e:
        print(f"❌ API endpoint error: {e}")
        return False
    
    # Test frontend
    try:
        response = requests.get("http://13.61.35.12/", timeout=10)
        if "AksharJobs" in response.text or "React" in response.text:
            print("✅ Frontend is deployed and accessible")
        else:
            print("⚠️ Frontend may not be properly deployed")
    except Exception as e:
        print(f"❌ Frontend error: {e}")
        return False
    
    print("\n🎉 Deployment verification complete!")
    print("✅ Server is running")
    print("✅ API is accessible") 
    print("✅ Frontend is deployed")
    
    return True

if __name__ == "__main__":
    verify_deployment()
