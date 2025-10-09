@echo off
echo ========================================
echo    AksharJobs - Simple Network Access
echo ========================================
echo.

echo 🔍 Detecting network configuration...
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    goto :found_ip
)
:found_ip

echo 📍 Your local IP address: %ip%
echo.

echo 🌍 Network Access Information:
echo    Backend API: http://%ip%:3002
echo    Frontend: http://%ip%:3003
echo    Local access: http://localhost:3003
echo.
echo 📱 Share this URL with others: http://%ip%:3003
echo.
echo ⚠️  IMPORTANT: Use HTTP (not HTTPS) for local network access
echo    ✅ Correct: http://%ip%:3003
echo    ❌ Wrong: https://%ip%:3003
echo.

echo 🔧 Starting servers for network access...
echo.

REM Start backend in a new window
echo 🚀 Starting Backend Server...
start "AksharJobs Backend" cmd /k "cd /d "%~dp0backend" && python start_backend.py"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend normally (it will work with network access)
echo 🎨 Starting Frontend Server...
start "AksharJobs Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ✅ Both servers are starting...
echo.
echo 📋 Instructions for testing:
echo    1. Wait for both servers to fully start (about 30-60 seconds)
echo    2. Test locally: http://localhost:3003
echo    3. Test from other devices: http://%ip%:3003
echo    4. Share the network URL with others on your WiFi
echo.
echo 🔧 To stop servers: Close both command windows or run stop_network_access.bat
echo.
echo ⏹️  Press any key to exit this window (servers will keep running)...
pause >nul
