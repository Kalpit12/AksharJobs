@echo off
echo ========================================
echo RESTARTING BACKEND SERVER
echo ========================================
echo.

echo Step 1: Stopping old backend process...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') do (
    echo Killing process: %%a
    taskkill /PID %%a /F
)
echo.

echo Step 2: Waiting 2 seconds...
timeout /t 2 /nobreak > nul
echo.

echo Step 3: Starting fresh backend...
cd backend
echo Starting: python app.py
echo.
echo ========================================
echo Backend will start in a new window
echo Keep that window open!
echo ========================================
echo.
start cmd /k "python app.py"

echo.
echo ========================================
echo DONE!
echo ========================================
echo.
echo The backend is starting in a new window.
echo Wait for "Running on http://0.0.0.0:3002" message.
echo Then try logging in again!
echo.
pause

