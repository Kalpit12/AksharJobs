"""
Email templates for application status notifications
"""

def get_status_email_template(status, applicant_name, job_title, company_name, interview_date=None, interview_mode=None):
    """
    Get email template based on application status
    
    Args:
        status (str): Application status
        applicant_name (str): Name of the applicant
        job_title (str): Job title
        company_name (str): Company name
        interview_date (str, optional): Interview date
        interview_mode (str, optional): Interview mode (online/in-person)
    
    Returns:
        dict: Email template with subject and body
    """
    
    templates = {
        'reviewed': {
            'subject': f'Application Update: Your application for {job_title} at {company_name} is under review',
            'body': f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Application Status Update</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .status-badge {{ background: #fbbf24; color: #92400e; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 AksharJobs</h1>
                        <p>AI-Powered Job Matching</p>
                    </div>
                    <div class="content">
                        <h2>Hello {applicant_name}!</h2>
                        <p>We have an update regarding your job application.</p>
                        
                        <div class="status-badge">📋 UNDER REVIEW</div>
                        
                        <p><strong>Job Position:</strong> {job_title}</p>
                        <p><strong>Company:</strong> {company_name}</p>
                        
                        <p>Great news! Your application has been received and is currently being reviewed by our hiring team. Our AI-powered system has already analyzed your profile and found a strong match with this position.</p>
                        
                        <p>What happens next?</p>
                        <ul>
                            <li>Our team will carefully review your application and resume</li>
                            <li>We'll assess your qualifications against the job requirements</li>
                            <li>You'll receive another update within 3-5 business days</li>
                        </ul>
                        
                        <p>Thank you for your patience, and we appreciate your interest in joining our team!</p>
                        
                        <p>Best regards,<br>
                        <strong>The {company_name} Hiring Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This email was sent by AksharJobs - AI-Powered Job Matching Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """
        },
        
        'shortlisted': {
            'subject': f'Congratulations! You have been shortlisted for {job_title} at {company_name}',
            'body': f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Application Status Update</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .status-badge {{ background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 AksharJobs</h1>
                        <p>AI-Powered Job Matching</p>
                    </div>
                    <div class="content">
                        <h2>Congratulations {applicant_name}! 🎉</h2>
                        <p>We have excellent news about your job application!</p>
                        
                        <div class="status-badge">✅ SHORTLISTED</div>
                        
                        <p><strong>Job Position:</strong> {job_title}</p>
                        <p><strong>Company:</strong> {company_name}</p>
                        
                        <p>Congratulations! Your application has been shortlisted for the next stage of our hiring process. Our AI analysis showed a strong match between your profile and the job requirements, and our hiring team was impressed with your qualifications.</p>
                        
                        <p>What this means:</p>
                        <ul>
                            <li>You've successfully passed the initial screening</li>
                            <li>Your profile matches well with our requirements</li>
                            <li>You may be contacted for the next interview round</li>
                            <li>Keep an eye on your email for further updates</li>
                        </ul>
                        
                        <p>We're excited about the possibility of you joining our team!</p>
                        
                        <p>Best regards,<br>
                        <strong>The {company_name} Hiring Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This email was sent by AksharJobs - AI-Powered Job Matching Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """
        },
        
        'interview_scheduled': {
            'subject': f'Interview Invitation: {job_title} at {company_name}',
            'body': f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Interview Invitation</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .status-badge {{ background: #8b5cf6; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }}
                    .interview-details {{ background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #8b5cf6; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 AksharJobs</h1>
                        <p>AI-Powered Job Matching</p>
                    </div>
                    <div class="content">
                        <h2>Interview Invitation - {applicant_name}</h2>
                        <p>We're excited to invite you for an interview!</p>
                        
                        <div class="status-badge">🎤 INTERVIEW SCHEDULED</div>
                        
                        <p><strong>Job Position:</strong> {job_title}</p>
                        <p><strong>Company:</strong> {company_name}</p>
                        
                        <div class="interview-details">
                            <h3>📅 Interview Details</h3>
                            <p><strong>Date:</strong> {interview_date or 'To be confirmed'}</p>
                            <p><strong>Mode:</strong> {interview_mode or 'To be confirmed'}</p>
                        </div>
                        
                        <p>Congratulations on making it to the interview stage! Our team was impressed with your application and we're excited to learn more about you.</p>
                        
                        <p>Interview Preparation Tips:</p>
                        <ul>
                            <li>Review the job description and company information</li>
                            <li>Prepare examples of your relevant experience</li>
                            <li>Think of questions you'd like to ask about the role</li>
                            <li>Test your technology setup if it's an online interview</li>
                        </ul>
                        
                        <p>We look forward to speaking with you soon!</p>
                        
                        <p>Best regards,<br>
                        <strong>The {company_name} Hiring Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This email was sent by AksharJobs - AI-Powered Job Matching Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """
        },
        
        'accepted': {
            'subject': f'🎉 Congratulations! You have been selected for {job_title} at {company_name}',
            'body': f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Job Offer</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .status-badge {{ background: #059669; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }}
                    .celebration {{ text-align: center; font-size: 24px; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 AksharJobs</h1>
                        <p>AI-Powered Job Matching</p>
                    </div>
                    <div class="content">
                        <div class="celebration">🎉🎊🎉</div>
                        <h2>Congratulations {applicant_name}!</h2>
                        <p>We are thrilled to offer you the position!</p>
                        
                        <div class="status-badge">🏆 SELECTED</div>
                        
                        <p><strong>Job Position:</strong> {job_title}</p>
                        <p><strong>Company:</strong> {company_name}</p>
                        
                        <p>Congratulations! After careful consideration, we are delighted to offer you the position of {job_title} at {company_name}. Your qualifications, experience, and enthusiasm during the interview process made you the perfect candidate for this role.</p>
                        
                        <p>What happens next?</p>
                        <ul>
                            <li>You will receive a formal offer letter with detailed terms</li>
                            <li>Our HR team will contact you to discuss next steps</li>
                            <li>We'll provide you with all necessary onboarding information</li>
                            <li>Welcome to the team!</li>
                        </ul>
                        
                        <p>We're excited to have you join our team and look forward to working with you!</p>
                        
                        <p>Welcome aboard!<br>
                        <strong>The {company_name} Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This email was sent by AksharJobs - AI-Powered Job Matching Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """
        },
        
        'rejected': {
            'subject': f'Application Update: {job_title} at {company_name}',
            'body': f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Application Status Update</title>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                    .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                    .header {{ background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                    .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                    .status-badge {{ background: #ef4444; color: white; padding: 8px 16px; border-radius: 20px; font-weight: bold; display: inline-block; margin: 10px 0; }}
                    .encouragement {{ background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }}
                    .footer {{ text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎯 AksharJobs</h1>
                        <p>AI-Powered Job Matching</p>
                    </div>
                    <div class="content">
                        <h2>Hello {applicant_name},</h2>
                        <p>Thank you for your interest in joining our team.</p>
                        
                        <div class="status-badge">❌ NOT SELECTED</div>
                        
                        <p><strong>Job Position:</strong> {job_title}</p>
                        <p><strong>Company:</strong> {company_name}</p>
                        
                        <p>After careful consideration, we have decided to move forward with other candidates for this position. This decision was not easy, as we received many qualified applications.</p>
                        
                        <div class="encouragement">
                            <h3>💪 Keep Going!</h3>
                            <p>Don't be discouraged! This is just one opportunity, and there are many more out there. Your skills and experience are valuable, and the right opportunity will come along.</p>
                        </div>
                        
                        <p>We encourage you to:</p>
                        <ul>
                            <li>Continue applying to other positions that match your skills</li>
                            <li>Keep your profile updated on AksharJobs</li>
                            <li>Consider our other job openings</li>
                            <li>Stay connected with us for future opportunities</li>
                        </ul>
                        
                        <p>Thank you for taking the time to apply, and we wish you the best in your job search!</p>
                        
                        <p>Best regards,<br>
                        <strong>The {company_name} Hiring Team</strong></p>
                    </div>
                    <div class="footer">
                        <p>This email was sent by AksharJobs - AI-Powered Job Matching Platform</p>
                    </div>
                </div>
            </body>
            </html>
            """
        }
    }
    
    return templates.get(status, templates['reviewed'])
