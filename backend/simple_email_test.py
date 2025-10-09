#!/usr/bin/env python3
"""
Simple email test - send a basic verification email
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_simple_test_email():
    """Send a simple test email"""
    
    # Email configuration
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    
    # You need to update these with your actual Gmail credentials
    sender_email = "hemant.patel@maxproinfotech.com"
    sender_password = "your-gmail-app-password"  # Use Gmail App Password, not regular password
    
    recipient_email = "hemant.patel@maxproinfotech.com"
    
    # Create message
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg['Subject'] = "🧪 Test Email - AksharJobs Community Verification"
    
    # Email body
    body = """
    <html>
    <body style="font-family: Arial, sans-serif;">
        <h2>🏢 AksharJobs - Community Verification Test</h2>
        
        <p>Hello Community Leader,</p>
        
        <p>This is a test email to verify that the community verification system is working.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>👤 Test User Information:</h3>
            <ul>
                <li><strong>Name:</strong> Rajesh Kumar</li>
                <li><strong>Email:</strong> rajesh.kumar@example.com</li>
                <li><strong>Phone:</strong> +91-9876543210</li>
                <li><strong>Community:</strong> Hindu</li>
                <li><strong>Request Date:</strong> """ + str(time.strftime('%B %d, %Y at %I:%M %p')) + """</li>
            </ul>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:3002/api/community-verification/verify-user?action=approve&userId=test123&token=test_token" 
               style="background-color: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
                ✅ Verify This User
            </a>
            <a href="http://localhost:3002/api/community-verification/verify-user?action=reject&userId=test123&token=test_token" 
               style="background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
                ❌ Reject Verification
            </a>
        </div>
        
        <p>If you can see this email, the verification system is working correctly!</p>
        
        <hr>
        <p style="color: #666; font-size: 12px;">
            This is a test email from AksharJobs Community Verification System.
        </p>
    </body>
    </html>
    """
    
    msg.attach(MIMEText(body, 'html'))
    
    try:
        print("📧 Attempting to send test email...")
        print(f"📬 From: {sender_email}")
        print(f"📬 To: {recipient_email}")
        
        # Connect to server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        
        # Login (this will fail without proper credentials)
        print("🔐 Attempting to login...")
        server.login(sender_email, sender_password)
        
        # Send email
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        
        print("✅ Email sent successfully!")
        print(f"📧 Check your inbox at {recipient_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed!")
        print("💡 You need to:")
        print("   1. Enable 2-factor authentication on your Gmail account")
        print("   2. Generate an App Password for this application")
        print("   3. Update the sender_password in this script with the App Password")
        return False
        
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        print("\n💡 Common issues:")
        print("   - Wrong email/password")
        print("   - Need to use Gmail App Password (not regular password)")
        print("   - 2-factor authentication not enabled")
        print("   - Network/firewall issues")
        return False

if __name__ == "__main__":
    import time
    print("📧 Simple Email Test for Community Verification")
    print("=" * 50)
    
    success = send_simple_test_email()
    
    if success:
        print("\n🎉 Email test successful!")
        print("📬 Check your inbox for the verification email")
    else:
        print("\n⚠️  Email test failed - check configuration")
    
    print("\n" + "=" * 50)
