#!/usr/bin/env python3
"""
Create a preview of the new premium email template
"""

from datetime import datetime

def create_email_preview():
    """Create a preview of the new premium email template"""
    
    # Sample user data
    user_data = {
        "firstName": "John",
        "lastName": "Mwangi",
        "email": "john.mwangi@example.com",
        "phone": "+254-712345678",
        "userType": "job_seeker",
        "_id": "68cfbfeda10196b81e162a0d"
    }
    
    community_names = ["Kenya Marketing (KM)", "UAB (United African Business)"]
    
    # Premium email template
    email_html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AksharJobs Community Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <!-- Main Container -->
        <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);">
            
            <!-- Premium Header with Gradient -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); padding: 40px 30px; text-align: center; position: relative; overflow: hidden;">
                <!-- Decorative Elements -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                <div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border-radius: 50%;"></div>
                
                <!-- Logo and Title -->
                <div style="position: relative; z-index: 2;">
                    <h1 style="margin: 0; font-size: 36px; font-weight: 700; color: #ffffff; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); letter-spacing: -1px;">
                        🚀 AksharJobs
                    </h1>
                    <p style="margin: 10px 0 0 0; font-size: 18px; color: rgba(255, 255, 255, 0.9); font-weight: 300;">
                        Kenya's Premier Job Platform
                    </p>
                    <div style="margin-top: 20px; padding: 12px 24px; background: rgba(255, 255, 255, 0.2); border-radius: 25px; display: inline-block; backdrop-filter: blur(10px);">
                        <span style="color: #ffffff; font-weight: 600; font-size: 16px;">Community Verification System</span>
                    </div>
                </div>
            </div>
            
            <!-- Content Section -->
            <div style="padding: 40px 30px;">
                <!-- Greeting -->
                <div style="text-align: center; margin-bottom: 35px;">
                    <h2 style="margin: 0; font-size: 28px; font-weight: 600; color: #1f2937; margin-bottom: 10px;">
                        🔐 New Verification Request
                    </h2>
                    <p style="margin: 0; font-size: 16px; color: #6b7280; line-height: 1.6;">
                        A professional has requested access to your exclusive community
                    </p>
                </div>
                
                <!-- User Information Card -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 16px; padding: 30px; margin: 30px 0; border-left: 5px solid #667eea; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #667eea; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">👤</span>
                        Professional Details
                    </h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Full Name</div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['firstName']} {user_data['lastName']}</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Email Address</div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['email']}</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Phone Number</div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['phone']}</div>
                        </div>
                        <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                            <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">User Type</div>
                            <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{user_data['userType'].title().replace('_', ' ')}</div>
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                        <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">Requested Communities</div>
                        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                            {''.join([f'<span style="background: #667eea; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 500;">{name}</span>' for name in community_names])}
                        </div>
                    </div>
                    
                    <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); margin-top: 20px;">
                        <div style="font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">Request Date</div>
                        <div style="font-size: 16px; font-weight: 600; color: #1f2937;">{datetime.now().strftime('%B %d, %Y at %I:%M %p')}</div>
                    </div>
                </div>
                
                <!-- Action Required Alert -->
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin: 30px 0; border-left: 5px solid #f59e0b; position: relative;">
                    <div style="position: absolute; top: 20px; right: 20px; font-size: 24px;">⚠️</div>
                    <h3 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #92400e;">
                        Action Required - Community Leader Approval
                    </h3>
                    <p style="margin: 0; font-size: 16px; color: #92400e; line-height: 1.6;">
                        Please review this professional's credentials and verify their membership to the requested communities. 
                        Your approval ensures the integrity of our exclusive community network.
                    </p>
                </div>
                
                <!-- Verification Buttons -->
                <div style="text-align: center; margin: 40px 0;">
                    <div style="display: inline-block; margin: 0 15px;">
                        <a href="#" 
                           style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                                  color: white; 
                                  padding: 18px 40px; 
                                  text-decoration: none; 
                                  border-radius: 12px; 
                                  display: inline-block;
                                  font-weight: 700;
                                  font-size: 16px;
                                  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
                                  transition: all 0.3s ease;
                                  border: none;
                                  cursor: pointer;">
                            ✅ Approve Professional
                        </a>
                    </div>
                    <div style="display: inline-block; margin: 0 15px;">
                        <a href="#" 
                           style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
                                  color: white; 
                                  padding: 18px 40px; 
                                  text-decoration: none; 
                                  border-radius: 12px; 
                                  display: inline-block;
                                  font-weight: 700;
                                  font-size: 16px;
                                  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
                                  transition: all 0.3s ease;
                                  border: none;
                                  cursor: pointer;">
                            ❌ Reject Request
                        </a>
                    </div>
                </div>
                
                <!-- Verification Process Info -->
                <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); border-radius: 16px; padding: 30px; margin: 30px 0;">
                    <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 600; color: #0277bd; display: flex; align-items: center; gap: 10px;">
                        <span style="background: #0277bd; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px;">ℹ️</span>
                        Verification Process
                    </h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">✅ Approval Process</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                <li>Verify professional credentials</li>
                                <li>Confirm community membership</li>
                                <li>Click "Approve Professional"</li>
                                <li>User gains exclusive access</li>
                            </ul>
                        </div>
                        <div>
                            <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #0277bd;">❌ Rejection Process</h4>
                            <ul style="margin: 0; padding-left: 20px; color: #0277bd;">
                                <li>Unable to verify membership</li>
                                <li>Click "Reject Request"</li>
                                <li>User notified via email</li>
                                <li>Can reapply later</li>
                            </ul>
                        </div>
                    </div>
                </div>
                
                <!-- Security Notice -->
                <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center; border: 2px solid #e5e7eb;">
                    <div style="font-size: 24px; margin-bottom: 10px;">🔒</div>
                    <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 600; color: #374151;">Secure Verification</h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                        This verification link is secure and expires after 24 hours. 
                        If you didn't request this verification, please ignore this email.
                    </p>
                </div>
            </div>
            
            <!-- Premium Footer -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 40px 30px; text-align: center; color: white;">
                <div style="margin-bottom: 25px;">
                    <h3 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff;">
                        🚀 AksharJobs
                    </h3>
                    <p style="margin: 10px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.8);">
                        Connecting Kenya's Top Talent with Premium Opportunities
                    </p>
                </div>
                
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.2); padding-top: 25px; margin-top: 25px;">
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: rgba(255, 255, 255, 0.7);">
                        This is an automated message from AksharJobs Community Verification System.
                    </p>
                    <div style="display: flex; justify-content: center; gap: 30px; flex-wrap: wrap;">
                        <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Privacy Policy</a>
                        <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Terms of Service</a>
                        <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Contact Support</a>
                        <a href="#" style="color: #60a5fa; text-decoration: none; font-size: 14px; font-weight: 500;">Help Center</a>
                    </div>
                    <p style="margin: 20px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.5);">
                        © 2025 AksharJobs. All rights reserved. | Nairobi, Kenya
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Save to file
    with open("premium_email_template_preview.html", "w", encoding="utf-8") as f:
        f.write(email_html)
    
    print("✅ Premium email template preview created!")
    print("📁 Saved as: premium_email_template_preview.html")
    print("🎨 Features:")
    print("   ✨ Premium gradient header with AksharJobs branding")
    print("   🚀 'Kenya's Premier Job Platform' tagline")
    print("   📊 Professional user information cards")
    print("   🏷️ Community badges for Kenya Marketing (KM) and UAB")
    print("   ⚠️ Action required alert with professional styling")
    print("   ✅ Premium verification buttons with gradients")
    print("   ℹ️ Detailed verification process information")
    print("   🔒 Security notice with professional design")
    print("   🎯 Premium footer with AksharJobs branding")
    print("   📱 Mobile-responsive design")

if __name__ == "__main__":
    create_email_preview()
