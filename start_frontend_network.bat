@echo off
echo Starting Frontend in Network Mode...
cd /d "%~dp0frontend"

REM Set environment variables for network access
set PORT=3003
set HOST=0.0.0.0
set BROWSER=none
set WDS_SOCKET_HOST=0.0.0.0
set WDS_SOCKET_PORT=3003

echo 🌐 Starting React development server for network access...
echo 📍 Host: 0.0.0.0
echo 📍 Port: 3003
echo.

REM Start the React development server
npm start
