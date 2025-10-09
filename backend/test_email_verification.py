#!/usr/bin/env python3
"""
Test script to send a community verification email to the community leader
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def send_test_verification_email():
    """Send a test verification email to the community leader"""
    
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
    
    test_communities = ["68cfb561590068c36eb54d27"]  # Hindu community
    community_name = "Hindu"
    
    # Email configuration
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "hemant.patel@maxproinfotech.com"  # Using community leader email as sender for testing
    sender_password = "your-app-password"  # You'll need to set this
    
    # Community leader email
    community_leader_email = "hemant.patel@maxproinfotech.com"
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = community_leader_email
        msg['Subject'] = f"🏢 AksharJobs - Community Verification Request - {test_user['firstName']} {test_user['lastName']}"
        
        # Create verification links
        approve_link = f"http://localhost:3003/verify-user?action=approve&userId={test_user['_id']}&token=test_approve_token"
        reject_link = f"http://localhost:3003/verify-user?action=reject&userId={test_user['_id']}&token=test_reject_token"
        
        # Email body
        body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">🏢 AksharJobs</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Community Verification System</p>
            </div>
            
            <div style="padding: 30px; background: #f8fafc;">
                <h2 style="color: #2563eb; margin-top: 0;">📋 New Community Verification Request</h2>
                
                <p>Hello Community Leader,</p>
                
                <p>A new user has requested verification for the <strong>{community_name}</strong> community:</p>
                
                <div style="background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin: 25px 0;">
                    <h3 style="color: #374151; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                        👤 User Information
                    </h3>
                    
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151; width: 40%;">Full Name:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{test_user['firstName']} {test_user['lastName']}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">Email:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{test_user['email']}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">Phone:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{test_user['phoneNumber']}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">User Type:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{test_user['userType'].title().replace('_', ' ')}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">Location:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{test_user['location']}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e5e7eb;">
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">Requested Community:</td>
                            <td style="padding: 12px 0; color: #6b7280;">
                                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px;">
                                    🕉️ {community_name}
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; font-weight: 600; color: #374151;">Request Date:</td>
                            <td style="padding: 12px 0; color: #6b7280;">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</td>
                        </tr>
                    </table>
                </div>
                
                <div style="background: #fef3c7; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0;">
                    <h3 style="color: #92400e; margin-top: 0; display: flex; align-items: center; gap: 8px;">
                        ⚠️ Action Required
                    </h3>
                    <p style="color: #92400e; margin: 0;">
                        Please verify this user's community membership and click one of the buttons below:
                    </p>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                    <a href="{approve_link}" 
                       style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                              color: white; 
                              padding: 15px 30px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              margin: 0 10px; 
                              display: inline-block;
                              font-weight: 600;
                              font-size: 16px;
                              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                              transition: all 0.3s ease;">
                        ✅ Verify This User
                    </a>
                    
                    <a href="{reject_link}" 
                       style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                              color: white; 
                              padding: 15px 30px; 
                              text-decoration: none; 
                              border-radius: 8px; 
                              margin: 0 10px; 
                              display: inline-block;
                              font-weight: 600;
                              font-size: 16px;
                              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                              transition: all 0.3s ease;">
                        ❌ Reject Verification
                    </a>
                </div>
                
                <div style="background: #e0f2fe; padding: 20px; border-radius: 12px; margin: 25px 0;">
                    <h3 style="color: #0277bd; margin-top: 0; display: flex; align-items: center; gap: 8px;">
                        ℹ️ Verification Process
                    </h3>
                    <ul style="color: #0277bd; margin: 0; padding-left: 20px;">
                        <li>Verify the user's identity and community membership</li>
                        <li>Click <strong>"Verify This User"</strong> if they are a genuine member of the {community_name} community</li>
                        <li>Click <strong>"Reject Verification"</strong> if you cannot verify their membership</li>
                        <li>The user will be notified of your decision via email</li>
                        <li>Verified users will receive a green verification badge on their profile</li>
                    </ul>
                </div>
                
                <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin: 25px 0; text-align: center;">
                    <h3 style="color: #374151; margin-top: 0;">🔒 Security Note</h3>
                    <p style="color: #6b7280; margin: 0;">
                        This verification link is secure and will expire after 24 hours. 
                        If you didn't request this verification, please ignore this email.
                    </p>
                </div>
            </div>
            
            <div style="background: #1f2937; padding: 20px; text-align: center; color: white;">
                <p style="margin: 0; font-size: 14px; opacity: 0.8;">
                    This is an automated message from AksharJobs Community Verification System.<br>
                    For support, please contact our team.
                </p>
                <div style="margin-top: 15px;">
                    <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                    <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Terms of Service</a>
                    <a href="#" style="color: #60a5fa; text-decoration: none; margin: 0 10px;">Contact Support</a>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Try to send email (this will fail without proper SMTP credentials, but we can see the email content)
        print("📧 Attempting to send verification email...")
        print(f"📬 From: {sender_email}")
        print(f"📬 To: {community_leader_email}")
        print(f"📬 Subject: {msg['Subject']}")
        
        # For testing purposes, let's save the email content to a file
        with open("test_verification_email.html", "w", encoding="utf-8") as f:
            f.write(body)
        
        print("✅ Email content saved to 'test_verification_email.html'")
        print("📋 Email Preview:")
        print("=" * 60)
        print(f"To: {community_leader_email}")
        print(f"Subject: {msg['Subject']}")
        print("=" * 60)
        print("Email contains:")
        print(f"  - User: {test_user['firstName']} {test_user['lastName']}")
        print(f"  - Email: {test_user['email']}")
        print(f"  - Phone: {test_user['phoneNumber']}")
        print(f"  - Community: {community_name}")
        print(f"  - Approve Link: {approve_link}")
        print(f"  - Reject Link: {reject_link}")
        print("=" * 60)
        
        # Try to send via SMTP (will fail without credentials, but shows the attempt)
        try:
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            # server.login(sender_email, sender_password)  # Commented out - needs real credentials
            # text = msg.as_string()
            # server.sendmail(sender_email, community_leader_email, text)
            # server.quit()
            print("⚠️  SMTP connection test successful (login skipped for testing)")
            print("💡 To actually send emails, configure SMTP credentials in the environment")
        except Exception as smtp_error:
            print(f"⚠️  SMTP test failed (expected without credentials): {smtp_error}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating test email: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Community Verification Email System")
    print("=" * 60)
    
    success = send_test_verification_email()
    
    if success:
        print("\n✅ Test email created successfully!")
        print("📁 Check 'test_verification_email.html' to see the email content")
        print("📧 Email would be sent to: hemant.patel@maxproinfotech.com")
        print("\n💡 To actually send emails:")
        print("   1. Set up SMTP credentials (Gmail App Password)")
        print("   2. Update sender_password in the script")
        print("   3. Uncomment the SMTP login and send lines")
    else:
        print("\n❌ Test email creation failed!")
    
    print("\n" + "=" * 60)
