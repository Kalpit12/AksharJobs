@echo off
echo ========================================
echo   Starting All Services for AI Testing
echo ========================================
echo.

echo Step 1: Starting MongoDB...
echo.
net start MongoDB
if %errorlevel% neq 0 (
    echo MongoDB service not found. Trying alternative method...
    echo Please start MongoDB manually or use Docker:
    echo   docker run -d -p 27017:27017 --name mongodb mongo:latest
    echo.
    pause
)

echo.
echo Step 2: Starting Backend Server...
echo.
cd backend
start "Backend Server" cmd /k python app.py

echo.
echo Step 3: Waiting for backend to start...
timeout /t 5 /nobreak

echo.
echo Step 4: Setting up test accounts...
echo.
python setup_ai_test_accounts.py

echo.
echo Step 5: Starting Frontend...
echo.
cd ..\frontend
start "Frontend Server" cmd /k npm start

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo Backend: http://localhost:3002
echo Frontend: http://localhost:3000
echo.
echo Test Accounts:
echo   Job Seeker: jobseeker@test.com / Test123!@#
echo   Intern: intern@test.com / Test123!@#
echo   Recruiter: recruiter@test.com / Test123!@#
echo.
echo To run AI features tests:
echo   cd backend
echo   python test_ai_features_complete.py
echo.
pause

