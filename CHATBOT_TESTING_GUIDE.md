# Gemini AI Chatbot Testing Guide

## 🧪 Testing Checklist

### 1. Prerequisites Setup
- [ ] Gemini API key configured in backend `.env`
- [ ] Backend server running on port 3002
- [ ] Frontend server running on port 3003
- [ ] User logged in (for authentication)

### 2. Visual/UI Testing

#### Chatbot Appearance
- [ ] Chatbot toggle button appears in bottom-right corner
- [ ] Button has gradient background and robot icon
- [ ] Button has pulsing animation effect
- [ ] Button text shows "AI Assistant"

#### Chatbot Interface
- [ ] Clicking button opens chat window
- [ ] Chat window has proper header with robot avatar
- [ ] Header shows "Gemini AI Assistant" title
- [ ] Status indicator shows "Online" (green dot)
- [ ] Control buttons (refresh, minimize, close) work
- [ ] Welcome message appears on first open

#### Responsive Design
- [ ] Chatbot works on desktop (380px width)
- [ ] Chatbot works on mobile (full width)
- [ ] Messages scroll properly
- [ ] Input field is accessible and functional

### 3. Functionality Testing

#### Basic Chat Features
- [ ] Type message and press Enter to send
- [ ] Click send button to send message
- [ ] Messages appear in chat with proper styling
- [ ] User messages appear on right (blue gradient)
- [ ] Bot messages appear on left (white background)
- [ ] Timestamps display correctly
- [ ] Auto-scroll to bottom works

#### Quick Questions
- [ ] Quick question buttons appear below messages
- [ ] Clicking quick question populates input field
- [ ] Different questions for job seeker vs recruiter
- [ ] Questions are relevant to user type

#### Input Features
- [ ] Input field accepts text
- [ ] Placeholder text is appropriate for user type
- [ ] Send button is disabled when input is empty
- [ ] Send button shows spinner when AI is responding
- [ ] Input is disabled while AI is typing

### 4. AI Response Testing

#### Job Seeker Context
Test these questions:
- [ ] "How do I optimize my resume?"
- [ ] "What are common interview questions?"
- [ ] "How do I negotiate salary?"
- [ ] "Should I change careers?"
- [ ] "How do I write a cover letter?"

Expected: Career-focused, encouraging responses

#### Recruiter Context
Test these questions:
- [ ] "How do I write a job description?"
- [ ] "What interview questions should I ask?"
- [ ] "How do I assess cultural fit?"
- [ ] "What recruitment metrics should I track?"
- [ ] "How do I improve diversity in hiring?"

Expected: HR-focused, professional responses

#### AI Response Quality
- [ ] Responses are relevant to the question
- [ ] Responses are helpful and actionable
- [ ] Responses are appropriate length (not too short/long)
- [ ] Responses maintain conversation context
- [ ] Responses are professional and well-written

### 5. Error Handling Testing

#### Network Errors
- [ ] Disconnect internet and send message
- [ ] Should show error message gracefully
- [ ] Should not crash the application
- [ ] Should allow retry

#### API Errors
- [ ] Invalid API key should show error
- [ ] Server down should show error
- [ ] Rate limiting should be handled gracefully

#### Input Validation
- [ ] Empty messages should not be sent
- [ ] Very long messages should be handled
- [ ] Special characters should work properly

### 6. Performance Testing

#### Response Time
- [ ] AI responses appear within 3-5 seconds
- [ ] No significant delays or timeouts
- [ ] Multiple rapid messages handled properly

#### Memory Usage
- [ ] Chat history doesn't cause memory issues
- [ ] Long conversations remain responsive
- [ ] No memory leaks after extended use

### 7. Cross-Platform Testing

#### Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Devices
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

### 8. Integration Testing

#### Dashboard Integration
- [ ] Chatbot appears on Job Seeker Dashboard
- [ ] Chatbot appears on Recruiter Dashboard
- [ ] Chatbot appears on Home page
- [ ] User type is correctly detected
- [ ] Context switching works properly

#### Authentication
- [ ] Chatbot works when user is logged in
- [ ] API calls include proper authentication
- [ ] User context is passed correctly

## 🐛 Common Issues & Solutions

### Issue: Chatbot not appearing
**Solution**: Check browser console for errors, verify component imports

### Issue: AI responses not working
**Solution**: Check backend logs, verify Gemini API key, test API endpoint

### Issue: Styling problems
**Solution**: Check CSS file is loaded, verify class names

### Issue: Mobile responsiveness
**Solution**: Check CSS media queries, test on actual devices

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________
Device: ___________

UI/Visual Tests:
- [ ] Pass
- [ ] Pass
- [ ] Pass

Functionality Tests:
- [ ] Pass
- [ ] Pass
- [ ] Pass

AI Response Tests:
- [ ] Pass
- [ ] Pass
- [ ] Pass

Error Handling Tests:
- [ ] Pass
- [ ] Pass
- [ ] Pass

Performance Tests:
- [ ] Pass
- [ ] Pass
- [ ] Pass

Overall Status: ✅ PASS / ❌ FAIL

Notes:
- Issue 1: Description
- Issue 2: Description
- Issue 3: Description
```

## 🚀 Quick Test Commands

### Test API Endpoint
```bash
curl -X POST http://localhost:3002/api/chat/gemini \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello", "userType": "jobSeeker"}'
```

### Check Backend Logs
```bash
# In backend directory
tail -f app.log
# or check console output
```

### Check Frontend Console
```bash
# Open browser dev tools
# Check Console tab for errors
# Check Network tab for API calls
```

## ✅ Success Criteria

The chatbot passes testing if:
1. All UI elements render correctly
2. Messages send and receive properly
3. AI responses are relevant and helpful
4. Error handling works gracefully
5. Performance is acceptable (< 5s response time)
6. Works across all target browsers/devices
7. Integration with dashboards is seamless
