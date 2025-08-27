# 🔐 OAuth Authentication Setup Guide

This guide will help you set up Google and LinkedIn OAuth authentication for your RocketJobs application.

## 🚀 What's Been Implemented

- **Google OAuth**: Login and signup using Google accounts
- **LinkedIn OAuth**: Login and signup using LinkedIn accounts
- **Automatic User Creation**: New users are automatically created during OAuth signup
- **Seamless Integration**: Works with existing authentication system
- **User Type Selection**: Users can choose between Job Seeker and Recruiter roles

## 📋 Prerequisites

1. **Google Cloud Console Account** (for Google OAuth)
2. **LinkedIn Developer Account** (for LinkedIn OAuth)
3. **Environment Variables** configured in your `.env.local` file

## 🔧 Backend Setup

### 1. Install Required Packages

The following packages have been added to `requirements.txt`:
```bash
requests-oauthlib
authlib
```

### 2. Environment Variables

Add these variables to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_REDIRECT_URI=http://localhost:3002/api/auth/linkedin/callback

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

## 🌐 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: "RocketJobs"
   - User support email: Your email
   - Developer contact information: Your email

### 3. Create OAuth Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Set authorized redirect URIs:
   - `http://localhost:3002/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

### 4. Get Client ID and Secret

Copy the generated Client ID and Client Secret to your `.env.local` file.

## 💼 LinkedIn OAuth Setup

### 1. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create App**
3. Fill in app details:
   - App name: "RocketJobs"
   - LinkedIn Page: Your company page (optional)
   - App logo: Upload your logo

### 2. Configure OAuth Settings

1. Go to **Auth** tab
2. Add redirect URLs:
   - `http://localhost:3002/api/auth/linkedin/callback` (development)
   - `https://yourdomain.com/api/auth/linkedin/callback` (production)

### 3. Request API Access

1. Go to **Products** tab
2. Request access to:
   - **Sign In with LinkedIn**
   - **Marketing Developer Platform** (for email access)

### 4. Get Client ID and Secret

Copy the Client ID and Client Secret to your `.env.local` file.

## 🎯 Frontend Integration

### 1. OAuth API Service

The `oauthApi.js` file handles all OAuth-related API calls:
- `getGoogleAuthUrl()`: Gets Google OAuth URL
- `getLinkedInAuthUrl()`: Gets LinkedIn OAuth URL
- `completeOAuthSignup()`: Completes OAuth signup

### 2. OAuth Pages

- **`/oauth-success`**: Handles successful OAuth authentication
- **`/oauth-signup`**: Allows new users to complete their profile

### 3. Login Integration

The login page now includes working Google and LinkedIn buttons that:
- Redirect users to OAuth providers
- Handle authentication flow
- Automatically create accounts for new users

## 🔄 OAuth Flow

### For Existing Users (Login)
1. User clicks Google/LinkedIn button
2. Redirected to OAuth provider
3. User authorizes the app
4. Backend verifies user exists
5. User is logged in and redirected to dashboard

### For New Users (Signup)
1. User clicks Google/LinkedIn button
2. Redirected to OAuth provider
3. User authorizes the app
4. Backend creates new user account
5. User selects role (Job Seeker/Recruiter)
6. User is logged in and redirected to dashboard

## 🧪 Testing

### 1. Test OAuth Status

Check if OAuth is properly configured:
```bash
GET /api/auth/oauth/status
```

### 2. Test OAuth URLs

Get OAuth URLs:
```bash
GET /api/auth/google/auth
GET /api/auth/linkedin/auth
```

### 3. Test Complete Flow

1. Go to login page
2. Click Google or LinkedIn button
3. Complete OAuth flow
4. Verify user creation/login

## 🚨 Troubleshooting

### Common Issues

1. **"OAuth not configured" error**
   - Check environment variables are set correctly
   - Verify client IDs and secrets are valid

2. **Redirect URI mismatch**
   - Ensure redirect URIs in OAuth providers match your config
   - Check for trailing slashes or protocol mismatches

3. **CORS issues**
   - Verify CORS is properly configured in backend
   - Check frontend URL matches FRONTEND_URL environment variable

4. **User creation fails**
   - Check MongoDB connection
   - Verify user model schema matches OAuth data

### Debug Steps

1. Check backend logs for OAuth errors
2. Verify environment variables are loaded
3. Test OAuth endpoints individually
4. Check browser console for frontend errors

## 🔒 Security Considerations

1. **HTTPS in Production**: Always use HTTPS for OAuth in production
2. **State Parameter**: Consider implementing state parameter for CSRF protection
3. **Token Storage**: JWT tokens are stored securely in localStorage
4. **User Validation**: OAuth users are automatically email-verified

## 📱 Production Deployment

### 1. Update Environment Variables
```bash
# Production URLs
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
LINKEDIN_REDIRECT_URI=https://yourdomain.com/api/auth/linkedin/callback
FRONTEND_URL=https://yourdomain.com
```

### 2. Update OAuth Provider Settings
- Add production redirect URIs to Google Cloud Console
- Add production redirect URIs to LinkedIn App settings

### 3. SSL Certificate
- Ensure your domain has a valid SSL certificate
- OAuth providers require HTTPS in production

## 🎉 Success!

Once configured, users will be able to:
- **Login** with existing Google/LinkedIn accounts
- **Sign up** with new Google/LinkedIn accounts
- **Seamlessly access** all RocketJobs features
- **Choose their role** (Job Seeker or Recruiter) during signup

The OAuth system integrates perfectly with your existing authentication flow and provides a modern, user-friendly login experience!
