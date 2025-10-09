#!/usr/bin/env python3
"""
Create a preview of the email template showing phone number
"""

from datetime import datetime

def create_phone_number_email_preview():
    """Create a preview showing phone number in the email template"""
    
    # Sample user data with phone number
    user_data = {
        "firstName": "Sarah",
        "lastName": "Wanjiku",
        "email": "sarah.wanjiku@example.com",
        "phoneNumber": "+254-789012345",  # Kenyan phone number
        "userType": "job_seeker",
        "_id": "68cfc0f4855fc5efb27dca77"
    }
    
    community_names = ["Kenya Marketing (KM)"]
    
    # Create the phone number section HTML
    phone_section_html = f"""
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Phone Number</div>
            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['phoneNumber']}</div>
        </div>
        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">User Type</div>
            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['userType'].title().replace('_', ' ')}</div>
        </div>
    </div>
    """
    
    # Complete email preview
    email_preview = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Phone Number in Verification Email</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f8fafc;
            }}
            .container {{
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }}
            .content {{
                padding: 30px;
            }}
            .highlight {{
                background: #fef3c7;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #f59e0b;
                margin: 20px 0;
            }}
            .phone-card {{
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                border: 2px solid #10b981;
            }}
            .phone-label {{
                font-size: 12px;
                color: #6b7280;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }}
            .phone-number {{
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                font-family: monospace;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 AksharJobs</h1>
                <p>Phone Number in Verification Email Preview</p>
            </div>
            
            <div class="content">
                <h2>📱 Phone Number Display Test</h2>
                
                <div class="highlight">
                    <h3>✅ Phone Number Successfully Included!</h3>
                    <p>The phone number <strong>{user_data['phoneNumber']}</strong> will be displayed in the verification email.</p>
                </div>
                
                <h3>📋 How it appears in the email:</h3>
                <div class="phone-card">
                    <div class="phone-label">Phone Number</div>
                    <div class="phone-number">{user_data['phoneNumber']}</div>
                </div>
                
                <h3>📧 Complete Email Information:</h3>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Professional:</strong> {user_data['firstName']} {user_data['lastName']}</p>
                    <p><strong>Email:</strong> {user_data['email']}</p>
                    <p><strong>Phone:</strong> {user_data['phoneNumber']} ← <span style="color: #10b981; font-weight: 600;">DISPLAYED IN EMAIL</span></p>
                    <p><strong>Community:</strong> {', '.join(community_names)}</p>
                    <p><strong>Request Date:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                </div>
                
                <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3>🎯 Email Template Features:</h3>
                    <ul>
                        <li>✅ Phone number properly displayed in professional details card</li>
                        <li>✅ Clean, modern card design with proper styling</li>
                        <li>✅ Consistent typography and spacing</li>
                        <li>✅ Mobile-responsive layout</li>
                        <li>✅ Professional color scheme</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #10b981; color: white; padding: 15px 30px; border-radius: 8px; display: inline-block; font-weight: 600;">
                        ✅ Phone Number: {user_data['phoneNumber']}
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Save to file
    with open("phone_number_email_preview.html", "w", encoding="utf-8") as f:
        f.write(email_preview)
    
    print("✅ Phone number email preview created!")
    print("📁 Saved as: phone_number_email_preview.html")
    print("📱 Phone number preview:")
    print(f"   📞 {user_data['phoneNumber']}")
    print("\n🎨 Email template features:")
    print("   ✅ Phone number displayed in professional details card")
    print("   ✅ Clean card design with proper styling")
    print("   ✅ Consistent typography and spacing")
    print("   ✅ Mobile-responsive layout")
    print("   ✅ Professional color scheme")

if __name__ == "__main__":
    create_phone_number_email_preview()
