from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import random

dashboard_routes = Blueprint('dashboard_routes', __name__)

@dashboard_routes.route('/profile/views', methods=['GET'])
@jwt_required()
def get_profile_views():
    """Get profile views for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_views = [
            {
                "id": 1,
                "viewerName": "Sarah Johnson",
                "viewerTitle": "HR Manager",
                "company": "TechCorp Solutions",
                "location": "New York, NY",
                "viewedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
                "viewerType": "recruiter",
                "avatar": None
            },
            {
                "id": 2,
                "viewerName": "Michael Chen",
                "viewerTitle": "Senior Developer",
                "company": "InnovateTech",
                "location": "San Francisco, CA",
                "viewedAt": (datetime.now() - timedelta(days=1)).isoformat(),
                "viewerType": "professional",
                "avatar": None
            },
            {
                "id": 3,
                "viewerName": "Emily Rodriguez",
                "viewerTitle": "Talent Acquisition Specialist",
                "company": "StartupXYZ",
                "location": "Austin, TX",
                "viewedAt": (datetime.now() - timedelta(days=2)).isoformat(),
                "viewerType": "recruiter",
                "avatar": None
            }
        ]
        
        return jsonify(mock_views), 200
        
    except Exception as e:
        print(f"Error fetching profile views: {e}")
        return jsonify({"error": "Failed to fetch profile views"}), 500

@dashboard_routes.route('/network/activity', methods=['GET'])
@jwt_required()
def get_network_activity():
    """Get network activity for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_activities = [
            {
                "id": 1,
                "type": "connection_request",
                "user": {
                    "name": "Alex Thompson",
                    "title": "Software Engineer",
                    "company": "Google",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(hours=1)).isoformat(),
                "status": "pending"
            },
            {
                "id": 2,
                "type": "profile_view",
                "user": {
                    "name": "Jessica Lee",
                    "title": "Product Manager",
                    "company": "Meta",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(hours=3)).isoformat(),
                "status": "completed"
            },
            {
                "id": 3,
                "type": "message",
                "user": {
                    "name": "David Kim",
                    "title": "Design Lead",
                    "company": "Apple",
                    "avatar": None
                },
                "timestamp": (datetime.now() - timedelta(days=1)).isoformat(),
                "status": "completed",
                "messagePreview": "Hi! I saw your profile and..."
            }
        ]
        
        return jsonify({
            "success": True,
            "activities": mock_activities,
            "totalActivities": len(mock_activities)
        }), 200
        
    except Exception as e:
        print(f"Error fetching network activity: {e}")
        return jsonify({"error": "Failed to fetch network activity"}), 500

@dashboard_routes.route('/recommendations/requests', methods=['GET'])
@jwt_required()
def get_recommendation_requests():
    """Get recommendation requests for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_requests = [
            {
                "id": 1,
                "requesterName": "Maria Garcia",
                "requesterTitle": "Data Scientist",
                "company": "Netflix",
                "requestDate": (datetime.now() - timedelta(days=2)).isoformat(),
                "status": "pending",
                "message": "Hi! I would be grateful if you could write me a recommendation..."
            },
            {
                "id": 2,
                "requesterName": "John Smith",
                "requesterTitle": "Frontend Developer",
                "company": "Microsoft",
                "requestDate": (datetime.now() - timedelta(days=5)).isoformat(),
                "status": "completed",
                "message": "Thank you for considering my request for a recommendation."
            }
        ]
        
        return jsonify({
            "success": True,
            "requests": mock_requests,
            "totalRequests": len(mock_requests)
        }), 200
        
    except Exception as e:
        print(f"Error fetching recommendation requests: {e}")
        return jsonify({"error": "Failed to fetch recommendation requests"}), 500

@dashboard_routes.route('/portfolio/items', methods=['GET'])
@jwt_required()
def get_portfolio_items():
    """Get portfolio items for the current user"""
    try:
        current_user_id = get_jwt_identity()
        
        # Mock data for now - replace with actual database query later
        mock_items = [
            {
                "id": 1,
                "title": "E-Commerce Platform",
                "description": "Full-stack e-commerce solution with React and Node.js",
                "imageUrl": "https://via.placeholder.com/400x250/3b82f6/ffffff?text=E-Commerce+Platform",
                "technologies": ["React", "Node.js", "MongoDB", "Stripe"],
                "githubUrl": "https://github.com/user/ecommerce-platform",
                "liveUrl": "https://ecommerce-demo.com",
                "createdAt": (datetime.now() - timedelta(days=30)).isoformat(),
                "category": "Web Application"
            },
            {
                "id": 2,
                "title": "Mobile Banking App",
                "description": "Cross-platform mobile banking application with secure transactions",
                "imageUrl": "https://via.placeholder.com/400x250/10b981/ffffff?text=Mobile+Banking+App",
                "technologies": ["React Native", "Firebase", "Redux"],
                "githubUrl": "https://github.com/user/banking-app",
                "liveUrl": "https://banking-app-demo.com",
                "createdAt": (datetime.now() - timedelta(days=45)).isoformat(),
                "category": "Mobile Application"
            },
            {
                "id": 3,
                "title": "Data Analytics Dashboard",
                "description": "Real-time analytics dashboard with interactive visualizations",
                "imageUrl": "https://via.placeholder.com/400x250/8b5cf6/ffffff?text=Data+Dashboard",
                "technologies": ["Python", "Django", "Chart.js", "PostgreSQL"],
                "githubUrl": "https://github.com/user/analytics-dashboard",
                "liveUrl": "https://analytics-demo.com",
                "createdAt": (datetime.now() - timedelta(days=60)).isoformat(),
                "category": "Data Visualization"
            },
            {
                "id": 4,
                "title": "AI Chatbot",
                "description": "Intelligent chatbot with natural language processing capabilities",
                "imageUrl": "https://via.placeholder.com/400x250/f59e0b/ffffff?text=AI+Chatbot",
                "technologies": ["Python", "TensorFlow", "Flask", "NLTK"],
                "githubUrl": "https://github.com/user/ai-chatbot",
                "liveUrl": "https://chatbot-demo.com",
                "createdAt": (datetime.now() - timedelta(days=75)).isoformat(),
                "category": "AI/ML"
            }
        ]
        
        return jsonify({
            "success": True,
            "items": mock_items,
            "totalItems": len(mock_items)
        }), 200
        
    except Exception as e:
        print(f"Error fetching portfolio items: {e}")
        return jsonify({"error": "Failed to fetch portfolio items"}), 500
