# Gemini AI Chatbot Setup Guide

## Overview
This guide will help you set up the new Gemini AI-powered chatbot for both job seekers and recruiters.

## Features
- 🤖 **AI-Powered**: Uses Google Gemini Pro for intelligent responses
- 👥 **User-Specific**: Different contexts for job seekers vs recruiters
- 💬 **Modern UI**: Clean, responsive chat interface
- 🎯 **Context-Aware**: Remembers conversation history
- 📱 **Mobile-Friendly**: Works on all devices
- ⚡ **Real-time**: Instant AI responses

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements_gemini.txt
```

### 2. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 3. Set Environment Variable
Add to your `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Update Flask App
The chatbot API endpoint has been added to `backend/app.py`:
- Route: `POST /api/chat/gemini`
- Handles both job seeker and recruiter contexts
- Uses conversation history for better responses

## Frontend Setup

### 1. Components Added
- `frontend/src/components/GeminiChatbot.jsx` - Main chatbot component
- `frontend/src/styles/GeminiChatbot.css` - Modern styling

### 2. Integration
- Added to Job Seeker Dashboard
- Added to Recruiter Dashboard
- User type detection for context-aware responses

## Usage

### For Job Seekers
The chatbot helps with:
- Resume optimization
- Interview preparation
- Career advice
- Job search strategies
- Salary negotiation

### For Recruiters
The chatbot helps with:
- Writing job descriptions
- Interview questions
- Candidate screening
- Recruitment strategies
- HR best practices

## API Endpoints

### POST /api/chat/gemini
**Request Body:**
```json
{
  "message": "How do I optimize my resume?",
  "userType": "jobSeeker",
  "userId": "user123",
  "conversationHistory": [
    {
      "type": "user",
      "text": "Hello",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Here are some tips to optimize your resume...",
  "timestamp": "2024-01-01T10:01:00Z",
  "model": "gemini-pro"
}
```

## Customization

### Styling
Edit `frontend/src/styles/GeminiChatbot.css` to customize:
- Colors and gradients
- Animations
- Layout and spacing
- Mobile responsiveness

### AI Behavior
Modify the context prompts in `backend/app.py`:
- Job seeker context (line ~15)
- Recruiter context (line ~30)

### Quick Questions
Update the quick question arrays in `GeminiChatbot.jsx`:
- `getQuickQuestions()` function
- Different questions for each user type

## Troubleshooting

### Common Issues
1. **API Key Not Working**
   - Verify the key is correct
   - Check environment variable is loaded
   - Ensure API key has proper permissions

2. **Chatbot Not Appearing**
   - Check browser console for errors
   - Verify component imports
   - Ensure CSS is loaded

3. **AI Responses Not Working**
   - Check backend logs
   - Verify API endpoint is accessible
   - Test with curl or Postman

### Testing
```bash
# Test the API endpoint
curl -X POST http://localhost:3002/api/chat/gemini \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello", "userType": "jobSeeker"}'
```

## Security Notes
- API key is stored server-side only
- User authentication required
- Rate limiting recommended for production
- Input validation implemented

## Performance
- Conversation history limited to last 10 messages
- Response caching can be added
- Error handling for API failures
- Loading states for better UX
