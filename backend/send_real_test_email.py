#!/usr/bin/env python3
"""
Send a real test email to the community leader
Note: You'll need to configure SMTP credentials for this to work
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def send_real_test_email():
    """Send a real test verification email"""
    
    # Test user data
    test_user = {
        "_id": "68cfb8e5ffcdeaed75d4b64c",
        "firstName": "Rajesh",
        "lastName": "Kumar",
        "email": "rajesh.kumar@example.com",
        "phoneNumber": "+91-9876543210",
        "userType": "job_seeker",
        "location": "Mumbai, Maharashtra"
    }
    
    community_name = "Hindu"
    community_leader_email = "hemant.patel@maxproinfotech.com"
    
    # Email configuration - UPDATE THESE WITH REAL CREDENTIALS
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "hemant.patel@maxproinfotech.com"  # Update with your email
    sender_password = "your-app-password"  # Update with Gmail App Password
    
    # Create verification links
    approve_link = f"http://localhost:3002/api/community-verification/verify-user?action=approve&userId={test_user['_id']}&token=test_approve_token"
    reject_link = f"http://localhost:3002/api/community-verification/verify-user?action=reject&userId={test_user['_id']}&token=test_reject_token"
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = community_leader_email
        msg['Subject'] = f"🏢 AksharJobs - Community Verification Request - {test_user['firstName']} {test_user['lastName']}"
        
        # Simple HTML email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #2563eb;">🏢 AksharJobs - Community Verification Request</h2>
                
                <p>Hello Community Leader,</p>
                
                <p>A new user has requested verification for the <strong>{community_name}</strong> community:</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #374151; margin-top: 0;">👤 User Information:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Name:</strong> {test_user['firstName']} {test_user['lastName']}</li>
                        <li><strong>Email:</strong> {test_user['email']}</li>
                        <li><strong>Phone:</strong> {test_user['phoneNumber']}</li>
                        <li><strong>User Type:</strong> {test_user['userType'].title()}</li>
                        <li><strong>Location:</strong> {test_user['location']}</li>
                        <li><strong>Requested Community:</strong> {community_name}</li>
                        <li><strong>Request Date:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</li>
                    </ul>
                </div>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #92400e; margin-top: 0;">⚠️ Action Required:</h3>
                    <p style="color: #92400e; margin: 0;">Please verify this user's community membership and click one of the buttons below:</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{approve_link}" 
                       style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
                        ✅ Verify This User
                    </a>
                    <a href="{reject_link}" 
                       style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
                        ❌ Reject Verification
                    </a>
                </div>
                
                <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #0277bd; margin-top: 0;">ℹ️ Verification Process:</h3>
                    <ul style="color: #0277bd; margin: 0; padding-left: 20px;">
                        <li>Verify the user's identity and community membership</li>
                        <li>Click "Verify This User" if they are a genuine member of the {community_name} community</li>
                        <li>Click "Reject Verification" if you cannot verify their membership</li>
                        <li>The user will be notified of your decision via email</li>
                    </ul>
                </div>
                
                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                
                <p style="color: #6b7280; font-size: 14px;">
                    This is an automated message from AksharJobs Community Verification System.<br>
                    If you have any questions, please contact support.
                </p>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        print("📧 Sending verification email...")
        print(f"📬 From: {sender_email}")
        print(f"📬 To: {community_leader_email}")
        print(f"📬 Subject: {msg['Subject']}")
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, community_leader_email, text)
        server.quit()
        
        print("✅ Email sent successfully!")
        print(f"📧 Verification email delivered to: {community_leader_email}")
        print(f"🔗 Approve link: {approve_link}")
        print(f"🔗 Reject link: {reject_link}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        print("\n💡 To fix this:")
        print("   1. Make sure you have Gmail App Password set up")
        print("   2. Update sender_email and sender_password in this script")
        print("   3. Check your internet connection")
        return False

if __name__ == "__main__":
    print("📧 Sending Real Test Email to Community Leader")
    print("=" * 60)
    
    success = send_real_test_email()
    
    if success:
        print("\n🎉 Email sent successfully!")
        print("📬 Check your inbox at hemant.patel@maxproinfotech.com")
        print("🔗 Click the verification links to test the flow")
    else:
        print("\n⚠️  Email sending failed - check SMTP configuration")
    
    print("\n" + "=" * 60)
