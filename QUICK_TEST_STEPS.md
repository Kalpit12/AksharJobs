# 🚀 Quick Chatbot Testing Steps

## Step 1: Backend Setup
```bash
# 1. Install Gemini dependency
cd backend
pip install google-generativeai

# 2. Add API key to .env file
echo "GEMINI_API_KEY=your_api_key_here" >> .env

# 3. Start backend server
python app.py
# Should show: Running on http://localhost:3002
```

## Step 2: Frontend Setup
```bash
# 1. Start frontend server
cd frontend
npm start
# Should open: http://localhost:3003
```

## Step 3: Test the Chatbot

### Visual Test
1. Open http://localhost:3003
2. Look for purple "AI Assistant" button in bottom-right
3. Click the button - chat window should open
4. Check if welcome message appears

### Functionality Test
1. Type a message: "How do I optimize my resume?"
2. Press Enter or click send button
3. Wait for AI response (should take 3-5 seconds)
4. Check if response is relevant and helpful

### API Test (Optional)
```bash
# Run the test script
python test_chatbot_api.py
```

## Step 4: Test Different Contexts

### Job Seeker Dashboard
1. Go to http://localhost:3003/jobseeker-dashboard
2. Click AI Assistant button
3. Ask: "What are common interview questions?"
4. Should get career-focused response

### Recruiter Dashboard  
1. Go to http://localhost:3003/recruiter-dashboard
2. Click AI Assistant button
3. Ask: "How do I write a job description?"
4. Should get HR-focused response

## Step 5: Use the Built-in Tester

The page now has a built-in tester in the top-left corner:
1. Click "Run All Tests" button
2. Watch the test results appear
3. Check if all tests pass (green checkmarks)

## Expected Results

### ✅ Success Indicators
- Chatbot button appears and opens
- Messages send and receive properly
- AI responses are relevant and helpful
- Different responses for job seeker vs recruiter
- No console errors
- All tests pass

### ❌ Common Issues
- **Chatbot not appearing**: Check console for import errors
- **No AI responses**: Check backend logs, verify API key
- **Authentication errors**: Make sure user is logged in
- **Slow responses**: Check internet connection, API limits

## Quick Fixes

### If API key is missing:
```bash
# Get API key from: https://makersuite.google.com/app/apikey
# Add to backend/.env:
GEMINI_API_KEY=your_actual_api_key_here
```

### If backend not running:
```bash
cd backend
python app.py
```

### If frontend not running:
```bash
cd frontend
npm start
```

### If tests fail:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify API key is correct
4. Make sure user is logged in

## Remove Tester After Testing

Once testing is complete, remove the tester:
1. Remove `import ChatbotTester` from Home.jsx
2. Remove `<ChatbotTester />` from Home.jsx
3. Delete `frontend/src/components/ChatbotTester.jsx`

## Test Questions to Try

### Job Seeker Questions:
- "How do I optimize my resume?"
- "What are common interview questions?"
- "How do I negotiate salary?"
- "Should I change careers?"
- "How do I write a cover letter?"

### Recruiter Questions:
- "How do I write a job description?"
- "What interview questions should I ask?"
- "How do I assess cultural fit?"
- "What recruitment metrics should I track?"
- "How do I improve diversity in hiring?"

## Success! 🎉

If everything works:
- Chatbot appears and functions properly
- AI responses are relevant and helpful
- Different contexts work correctly
- No errors in console or backend
- All tests pass

The Gemini AI chatbot is ready for production! 🚀
