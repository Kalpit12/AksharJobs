@echo off
echo Starting Frontend in Network Mode (Alternative Method)...
cd /d "%~dp0frontend"

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    goto :found_ip
)
:found_ip

REM Set environment variables for network access
set PORT=3003
set BROWSER=none
set WDS_SOCKET_HOST=%ip%
set WDS_SOCKET_PORT=3003

echo 🌐 Starting React development server for network access...
echo 📍 Host: %ip%
echo 📍 Port: 3003
echo.

REM Start the React development server
npm start
