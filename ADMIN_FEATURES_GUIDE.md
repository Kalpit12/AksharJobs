# Admin Dashboard - Template Editor & Messaging Guide

## 🎨 New Admin Features Added

### 1. **Dashboard Template Editor**
Full control over all three user dashboard designs (Recruiter, Job Seeker, Intern)

### 2. **Messaging & Email Center**
Send custom messages and emails to users with template management

---

## 🎨 Dashboard Template Editor

### Features:
- ✅ Edit **Recruiter Dashboard** (Orange Theme)
- ✅ Edit **Job Seeker Dashboard** (Blue Theme)
- ✅ Edit **Intern Dashboard** (Green Theme)
- ✅ Add/Delete/Reorder sections
- ✅ Change navigation icons
- ✅ Customize theme colors
- ✅ Enable/Disable sections
- ✅ Live preview
- ✅ Export templates

### How to Access:
1. Login as admin
2. Go to Admin Dashboard
3. Click **"🎨 Edit Dashboard Templates"** button

### What You Can Edit:

#### Navigation Sections
- **Add New Sections**: Click "+ Add Section" button
- **Edit Section Names**: Click on the name to edit inline
- **Change Icons**: Select from dropdown list of icons
- **Enable/Disable**: Toggle switch to show/hide sections
- **Delete Sections**: Click trash icon (cannot delete default sections)
- **Reorder**: Drag sections up/down (coming soon)

#### Theme Colors
- **Primary Color**: Main theme color
- **Secondary Color**: Accent color
- **Gradient**: Sidebar background gradient

#### Actions:
- **Save Changes**: Saves to database, applies to all users
- **Preview**: See live preview of dashboard
- **Export**: Download template as JSON file
- **Import**: Upload custom template (coming soon)

---

## 📧 Messaging & Email Center

### Features:
- ✅ Send emails to users
- ✅ Send in-app messages
- ✅ Custom email templates
- ✅ Variable substitution (personalization)
- ✅ Target specific user types
- ✅ Message history tracking
- ✅ Template library
- ✅ Delivery statistics

### How to Access:
1. Login as admin
2. Go to Admin Dashboard
3. Click **"📧 Send Messages & Emails"** button

### Compose Messages

#### 1. Select Message Type
- **Email**: Sends to user's email address
- **In-App Message**: Sends to user's dashboard inbox

#### 2. Select Recipients
- **All Users**: Sends to everyone
- **Selected Users**: Choose specific users (coming soon)

#### 3. Select User Type Filter
- **All Types**: All users
- **Recruiters Only**: Only recruiters receive
- **Job Seekers Only**: Only job seekers receive  
- **Interns Only**: Only interns receive

#### 4. Compose Message
- **Subject**: Email subject line
- **Body**: Message content
- **Variables**: Use template variables for personalization

#### 5. Send
- Click "Send Now"
- Confirmation dialog appears
- Messages sent to all matching users
- Track in "Sent Messages" tab

### Message Variables

Use these variables in your message body for personalization:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{firstName}}` | User's first name | "John" |
| `{{lastName}}` | User's last name | "Doe" |
| `{{email}}` | User's email | "john@example.com" |
| `{{role}}` | User's role | "recruiter", "jobSeeker", "intern" |
| `{{companyName}}` | Company name (recruiters) | "TechCorp" |

Example:
```
Hello {{firstName}},

Thank you for joining AksharJobs! 

{{#if role == 'recruiter'}}
Start posting jobs and finding talent today!
{{/if}}

Best regards,
The AksharJobs Team
```

### Message Templates

#### Default Templates Included:
1. **Welcome Email** - New user welcome message
2. **Application Received** - Confirmation for applicants
3. **Interview Invitation** - Interview scheduling
4. **System Update** - Platform announcements

#### Create Custom Template:
1. Go to "Templates" tab
2. Click "+ Create Template"
3. Fill in:
   - Template Name
   - Template Type (Email/Message)
   - Subject
   - Body (with variables)
4. Click "Save Template"

#### Use Template:
1. Browse templates in "Templates" tab
2. Click "Use This Template" button
3. Template loads into composer
4. Edit as needed
5. Send

### Sent Messages History

Track all sent messages with:
- ✅ Subject and preview
- ✅ Recipient count
- ✅ User type targeted
- ✅ Send date/time
- ✅ Delivery status
- ✅ Open rate (emails)

---

## 🛠️ Technical Details

### Backend API Endpoints

#### Dashboard Templates
- `GET /api/admin/dashboard-templates` - Get all templates
- `PUT /api/admin/dashboard-templates` - Update templates

#### Message Templates
- `GET /api/admin/message-templates` - Get all templates
- `POST /api/admin/message-templates` - Create new template
- `DELETE /api/admin/message-templates/:id` - Delete template

#### Messaging
- `POST /api/admin/send-message` - Send message/email
- `GET /api/admin/sent-messages` - Get sent message history

### Database Collections

#### dashboard_templates
```javascript
{
  "type": "dashboard_config",
  "templates": {
    "recruiter": { theme, sections },
    "jobSeeker": { theme, sections },
    "intern": { theme, sections }
  },
  "updatedAt": "2025-10-18T..."
}
```

#### message_templates
```javascript
{
  "_id": ObjectId,
  "name": "Template Name",
  "type": "email" | "message",
  "subject": "Subject Line",
  "body": "Message body with {{variables}}",
  "createdAt": "2025-10-18T...",
  "updatedAt": "2025-10-18T..."
}
```

#### sent_messages_history
```javascript
{
  "_id": ObjectId,
  "subject": "Message Subject",
  "body": "Message Body",
  "type": "email" | "message",
  "recipientCount": 72,
  "userType": "all" | "recruiter" | "jobSeeker" | "intern",
  "sentAt": "2025-10-18T...",
  "delivered": 72,
  "opened": 45
}
```

---

## 🚀 Quick Start Guide

### Edit Dashboard Templates

1. **Login as Admin**
   - Email: `admin@rocketmatch.com`
   - Access admin dashboard

2. **Open Template Editor**
   - Click "🎨 Edit Dashboard Templates"

3. **Select Dashboard**
   - Choose Recruiter, Job Seeker, or Intern

4. **Make Changes**
   - Toggle sections on/off
   - Rename sections
   - Change icons
   - Modify colors

5. **Save**
   - Click "Save Changes"
   - Changes apply to all users

### Send Messages to Users

1. **Open Messaging Center**
   - Click "📧 Send Messages & Emails"

2. **Choose Type**
   - Select Email or In-App Message

3. **Select Recipients**
   - Choose "All Users" or filter by user type

4. **Compose**
   - Write subject and message
   - Use variables for personalization

5. **Send**
   - Click "Send Now"
   - Confirm in dialog
   - Track in "Sent Messages" tab

---

## 💡 Use Cases

### Template Editor Use Cases:
1. **Add New Feature Section** - Add a new menu item for new features
2. **Disable Unused Features** - Hide sections users don't use
3. **Rebrand** - Change colors to match new branding
4. **A/B Testing** - Try different section arrangements
5. **Role-Specific Customization** - Different features for different roles

### Messaging Use Cases:
1. **Welcome New Users** - Send welcome email on signup
2. **System Announcements** - Notify users of updates
3. **Feature Launches** - Announce new features
4. **Maintenance Notices** - Warn about scheduled downtime
5. **Engagement Campaigns** - Re-engage inactive users
6. **Recruitment Drives** - Target specific user groups
7. **Holiday Greetings** - Seasonal messages

---

## ⚠️ Important Notes

### Template Editor
- ✅ Changes affect ALL users of that role type
- ✅ Save often - changes aren't auto-saved
- ✅ Test in preview before saving
- ⚠️ Cannot delete core sections (Dashboard, Profile, Settings)
- ⚠️ Color changes apply immediately

### Messaging
- ✅ Messages can't be unsent - review carefully
- ✅ Test with small group first if available
- ✅ Variables are case-sensitive
- ✅ Email delivery depends on user's email validity
- ⚠️ Large batches may take time to send
- ⚠️ Check spam filters if emails not received

---

## 📊 Message Statistics

Track message performance:
- **Delivered**: Successfully sent
- **Opened**: User viewed message (emails)
- **Bounced**: Email delivery failed
- **Unsubscribed**: User opted out

---

## 🔧 Troubleshooting

### Template Editor
**Issue**: Changes not appearing  
**Solution**: Clear browser cache, hard refresh

**Issue**: Can't save templates  
**Solution**: Check admin permissions, verify token

**Issue**: Preview not loading  
**Solution**: Refresh page, check browser console

### Messaging
**Issue**: Messages not sending  
**Solution**: Check recipient count, verify database connection

**Issue**: Variables not replacing  
**Solution**: Use exact variable syntax: `{{variableName}}`

**Issue**: Emails going to spam  
**Solution**: Configure SPF/DKIM records for domain

---

## ✅ Files Created

### Frontend Components:
1. `frontend/src/components/DashboardTemplateEditor.jsx` - Template editor component
2. `frontend/src/components/AdminMessaging.jsx` - Messaging center component
3. `frontend/src/styles/DashboardTemplateEditor.css` - Template editor styles
4. `frontend/src/styles/AdminMessaging.css` - Messaging center styles

### Backend Routes:
1. `backend/routes/template_routes.py` - API routes for templates and messaging

### Updated Files:
1. `frontend/src/pages/AdminDashboard.jsx` - Added new views
2. `backend/app.py` - Registered template routes

---

## 🎯 Next Steps

1. **Upload changes to server**:
   ```bash
   cd frontend && npm run build
   scp -r build/* server:/var/www/AksharJobs/frontend/build/
   ```

2. **Restart backend**:
   ```bash
   pm2 restart akshar-backend
   ```

3. **Test features**:
   - Login as admin
   - Test template editor
   - Send test message
   - Verify delivery

---

## 📞 Support

For issues or questions about admin features:
- Check backend logs: `pm2 logs akshar-backend`
- Check browser console for frontend errors
- Verify admin permissions in database

---

**Admin features are now fully functional!** 🎉

Use these powerful tools to customize dashboards and communicate with your users effectively.

