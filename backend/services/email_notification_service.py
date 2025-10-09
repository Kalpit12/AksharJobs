import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from config import Config

class EmailNotificationService:
    def __init__(self):
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email = os.getenv('GMAIL_EMAIL')
        self.password = os.getenv('GMAIL_APP_PASSWORD')
    
    def send_application_status_notification(self, recipient_email, recipient_name, job_title, company_name, status, notes=None):
        """Send email notification for application status change"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = recipient_email
            msg['Subject'] = f"Application Update: {job_title} at {company_name}"
            
            # Create email body
            body = self._create_status_notification_body(recipient_name, job_title, company_name, status, notes)
            msg.attach(MIMEText(body, 'html'))
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, recipient_email, text)
            server.quit()
            
            print(f"✅ Status notification sent to {recipient_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send email to {recipient_email}: {e}")
            return False
    
    def send_interview_notification(self, recipient_email, recipient_name, job_title, company_name, interview_date, interview_mode, notes=None):
        """Send email notification for interview scheduling"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = recipient_email
            msg['Subject'] = f"Interview Scheduled: {job_title} at {company_name}"
            
            body = self._create_interview_notification_body(recipient_name, job_title, company_name, interview_date, interview_mode, notes)
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, recipient_email, text)
            server.quit()
            
            print(f"✅ Interview notification sent to {recipient_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send interview email to {recipient_email}: {e}")
            return False
    
    def send_application_submitted_notification(self, recipient_email, recipient_name, job_title, company_name):
        """Send email notification when application is submitted"""
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email
            msg['To'] = recipient_email
            msg['Subject'] = f"Application Submitted: {job_title} at {company_name}"
            
            body = self._create_application_submitted_body(recipient_name, job_title, company_name)
            msg.attach(MIMEText(body, 'html'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            text = msg.as_string()
            server.sendmail(self.email, recipient_email, text)
            server.quit()
            
            print(f"✅ Application submitted notification sent to {recipient_email}")
            return True
            
        except Exception as e:
            print(f"❌ Failed to send application email to {recipient_email}: {e}")
            return False
    
    def _create_status_notification_body(self, name, job_title, company_name, status, notes):
        """Create HTML body for status notification"""
        status_messages = {
            'pending': 'Your application is being reviewed',
            'ai_screening': 'Your application is undergoing AI screening',
            'reviewing': 'Your application is being reviewed by our team',
            'shortlisted': 'Congratulations! You have been shortlisted',
            'interview': 'You have been selected for an interview',
            'rejected': 'Unfortunately, your application was not successful this time',
            'hired': 'Congratulations! You have been selected for the position'
        }
        
        status_colors = {
            'pending': '#3b82f6',
            'ai_screening': '#06b6d4',
            'reviewing': '#f59e0b',
            'shortlisted': '#10b981',
            'interview': '#8b5cf6',
            'rejected': '#ef4444',
            'hired': '#10b981'
        }
        
        message = status_messages.get(status, 'Your application status has been updated')
        color = status_colors.get(status, '#3b82f6')
        
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .status-badge {{ background: {color}; color: white; padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; }}
                .job-details {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid {color}; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 RocketJobs</h1>
                    <p>Application Status Update</p>
                </div>
                <div class="content">
                    <h2>Hello {name}!</h2>
                    <p>We have an update regarding your job application:</p>
                    
                    <div class="job-details">
                        <h3>{job_title}</h3>
                        <p><strong>Company:</strong> {company_name}</p>
                        <p><strong>Status:</strong> <span class="status-badge">{status.replace('_', ' ').title()}</span></p>
                        <p><strong>Message:</strong> {message}</p>
                        {f'<p><strong>Notes:</strong> {notes}</p>' if notes else ''}
                    </div>
                    
                    <p>You can track all your applications in your dashboard at <a href="http://localhost:3003">RocketJobs</a>.</p>
                    
                    <div class="footer">
                        <p>Best regards,<br>The RocketJobs Team</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html
    
    def _create_interview_notification_body(self, name, job_title, company_name, interview_date, interview_mode, notes):
        """Create HTML body for interview notification"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .interview-details {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #8b5cf6; }}
                .highlight {{ background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 RocketJobs</h1>
                    <p>Interview Scheduled</p>
                </div>
                <div class="content">
                    <h2>Congratulations {name}!</h2>
                    <p>Great news! You have been selected for an interview:</p>
                    
                    <div class="interview-details">
                        <h3>{job_title}</h3>
                        <p><strong>Company:</strong> {company_name}</p>
                        <div class="highlight">
                            <p><strong>📅 Interview Date:</strong> {interview_date}</p>
                            <p><strong>💻 Interview Mode:</strong> {interview_mode}</p>
                        </div>
                        {f'<p><strong>Additional Notes:</strong> {notes}</p>' if notes else ''}
                    </div>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ul>
                        <li>Prepare for the interview by reviewing the job description</li>
                        <li>Test your technology setup if it's an online interview</li>
                        <li>Prepare questions to ask about the role and company</li>
                    </ul>
                    
                    <p>Good luck with your interview! You can track all your applications in your dashboard at <a href="http://localhost:3003">RocketJobs</a>.</p>
                    
                    <div class="footer">
                        <p>Best regards,<br>The RocketJobs Team</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html
    
    def _create_application_submitted_body(self, name, job_title, company_name):
        """Create HTML body for application submitted notification"""
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }}
                .job-details {{ background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #10b981; }}
                .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎯 RocketJobs</h1>
                    <p>Application Submitted Successfully</p>
                </div>
                <div class="content">
                    <h2>Thank you {name}!</h2>
                    <p>Your application has been successfully submitted:</p>
                    
                    <div class="job-details">
                        <h3>{job_title}</h3>
                        <p><strong>Company:</strong> {company_name}</p>
                        <p><strong>Status:</strong> <span style="background: #3b82f6; color: white; padding: 5px 15px; border-radius: 15px; font-size: 12px;">Submitted</span></p>
                    </div>
                    
                    <p><strong>What happens next?</strong></p>
                    <ul>
                        <li>Your application will be reviewed by our AI system</li>
                        <li>The hiring team will evaluate your profile</li>
                        <li>You'll receive updates via email as your application progresses</li>
                    </ul>
                    
                    <p>You can track your application status in your dashboard at <a href="http://localhost:3003">RocketJobs</a>.</p>
                    
                    <div class="footer">
                        <p>Best regards,<br>The RocketJobs Team</p>
                        <p>This is an automated message. Please do not reply to this email.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        return html

# Global instance
email_service = EmailNotificationService()

def get_email_service():
    """Get the global email service instance"""
    return email_service
