#!/usr/bin/env python3
"""
Test script to create sample notifications and messages for testing real-time functionality
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.notification_service import NotificationService
from services.message_service import MessageService
from utils.db import get_db
from bson import ObjectId
import json

def test_notifications_and_messages():
    """Test creating notifications and messages"""
    print("🧪 Testing Notifications and Messages System")
    print("=" * 50)
    
    # Get database connection
    db = get_db()
    if db is None:
        print("❌ Failed to connect to database")
        return
    
    # Find a test user (use the first user in the database)
    users = db["users"]
    test_user = users.find_one()
    
    if not test_user:
        print("❌ No users found in database")
        return
    
    user_id = str(test_user["_id"])
    print(f"✅ Using test user: {test_user.get('email', 'Unknown')} (ID: {user_id})")
    
    # Test creating notifications
    print("\n🔔 Testing Notifications...")
    
    # Create job notification
    job_result = NotificationService.create_job_notification(
        user_id=user_id,
        job_title="Senior Software Engineer",
        company_name="Tech Corp",
        action="posted"
    )
    print(f"Job notification: {'✅' if job_result['success'] else '❌'}")
    
    # Create application notification
    app_result = NotificationService.create_application_notification(
        user_id=user_id,
        job_title="Frontend Developer",
        company_name="StartupXYZ",
        status="shortlisted"
    )
    print(f"Application notification: {'✅' if app_result['success'] else '❌'}")
    
    # Create message notification
    msg_notif_result = NotificationService.create_message_notification(
        user_id=user_id,
        sender_name="Sarah Johnson",
        message_preview="Hi! I saw your profile and would like to discuss a job opportunity..."
    )
    print(f"Message notification: {'✅' if msg_notif_result['success'] else '❌'}")
    
    # Create system notification
    system_result = NotificationService.create_system_notification(
        user_id=user_id,
        title="Welcome to AksharJobs!",
        message="Your account has been successfully created. Start exploring job opportunities now!",
        data={"type": "welcome", "action": "account_created"}
    )
    print(f"System notification: {'✅' if system_result['success'] else '❌'}")
    
    # Test creating messages
    print("\n💬 Testing Messages...")
    
    # Create welcome message
    welcome_msg = MessageService.send_welcome_message(
        recipient_id=user_id,
        user_name=test_user.get('firstName', 'User')
    )
    print(f"Welcome message: {'✅' if welcome_msg['success'] else '❌'}")
    
    # Create job application message
    job_msg = MessageService.send_job_application_message(
        recipient_id=user_id,
        job_title="Full Stack Developer",
        company_name="Innovation Labs",
        action="applied"
    )
    print(f"Job application message: {'✅' if job_msg['success'] else '❌'}")
    
    # Create system message
    system_msg = MessageService.send_system_message(
        recipient_id=user_id,
        content="Your profile has been updated successfully. You're now visible to more recruiters!",
        message_type="profile_update",
        metadata={"action": "profile_updated", "visibility": "increased"}
    )
    print(f"System message: {'✅' if system_msg['success'] else '❌'}")
    
    # Get counts
    print("\n📊 Current Counts...")
    
    # Get notification count
    notifications = db["notifications"]
    notif_count = notifications.count_documents({"user_id": user_id})
    unread_notif_count = notifications.count_documents({"user_id": user_id, "is_read": False})
    print(f"Total notifications: {notif_count}")
    print(f"Unread notifications: {unread_notif_count}")
    
    # Get message count
    messages = db["messages"]
    msg_count = messages.count_documents({
        "$or": [
            {"sender_id": user_id},
            {"recipient_id": user_id}
        ]
    })
    unread_msg_count = messages.count_documents({"recipient_id": user_id, "is_read": False})
    print(f"Total messages: {msg_count}")
    print(f"Unread messages: {unread_msg_count}")
    
    print("\n✅ Test completed successfully!")
    print("\n💡 To test real-time updates:")
    print("1. Start the backend server with WebSocket support")
    print("2. Open the frontend and log in")
    print("3. Run this script again to create new notifications/messages")
    print("4. Watch the real-time updates in the frontend!")

if __name__ == "__main__":
    test_notifications_and_messages()
