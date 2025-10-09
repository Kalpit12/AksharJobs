# Email Notification System Setup

This document explains how to set up the automated email notification system for application status updates.

## Features

- **Automated Email Notifications**: Sends emails to applicants when their application status changes
- **Professional Email Templates**: Beautiful HTML email templates for each status
- **Multiple Status Support**: Covers all application statuses from review to hired
- **Interview Scheduling**: Special handling for interview invitations with date/time details

## Email Templates

The system includes professional email templates for the following statuses:

1. **Reviewed** - Application is under review
2. **Shortlisted** - Application has been shortlisted
3. **Interview Scheduled** - Interview invitation with details
4. **Accepted** - Job offer notification
5. **Rejected** - Application not selected (with encouragement)

## Setup Instructions

### 1. Environment Variables

Set the following environment variables in your `.env` file:

```bash
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
SENDER_NAME=AksharJobs Team
```

### 2. Gmail Setup (Recommended)

If using Gmail:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in `SENDER_PASSWORD`

### 3. Alternative Email Providers

You can use other SMTP providers by changing the configuration:

```bash
# For Outlook/Hotmail
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587

# For Yahoo
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587

# For custom SMTP
SMTP_SERVER=your-smtp-server.com
SMTP_PORT=587
```

## Usage

### Automatic Notifications

Email notifications are automatically sent when:

1. A recruiter updates an application status
2. The status changes to any of the supported statuses
3. Interview details are provided (for interview_scheduled status)

### Manual Testing

You can test the email system using the test endpoint:

```bash
POST /api/applications/test-email
Content-Type: application/json

{
    "email": "test@example.com",
    "name": "Test User",
    "job_title": "Software Engineer",
    "company_name": "Test Company"
}
```

### Frontend Integration

The frontend application tracker will automatically trigger emails when recruiters update application statuses. No additional frontend changes are required.

## Email Template Customization

To customize email templates, edit `backend/services/email_templates.py`:

1. Modify the HTML templates in the `get_status_email_template()` function
2. Update colors, fonts, and styling as needed
3. Add your company branding and logo
4. Customize the messaging for each status

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your email credentials
   - Ensure 2FA is enabled and app password is used
   - Verify SMTP server and port settings

2. **Emails Not Sending**
   - Check server logs for error messages
   - Verify network connectivity
   - Test with the `/test-email` endpoint

3. **Template Issues**
   - Check HTML syntax in templates
   - Verify all required fields are provided
   - Test with different status values

### Logs

Email sending attempts are logged with the following format:
- ✅ Success: `Email notification sent to {email} for status update: {status}`
- ❌ Failure: `Failed to send email notification to {email}`

## Security Considerations

1. **Environment Variables**: Never commit email credentials to version control
2. **App Passwords**: Use app-specific passwords instead of main account passwords
3. **Rate Limiting**: Consider implementing rate limiting for email sending
4. **Error Handling**: Email failures don't affect application status updates

## Future Enhancements

Potential improvements to consider:

1. **Email Queuing**: Implement a queue system for bulk email sending
2. **Template Management**: Create an admin interface for template editing
3. **Email Analytics**: Track email open rates and engagement
4. **Multi-language Support**: Add support for multiple languages
5. **Email Preferences**: Allow users to customize notification preferences

## Support

For issues or questions about the email system:

1. Check the server logs for error messages
2. Test with the `/test-email` endpoint
3. Verify your email configuration
4. Contact the development team for assistance
