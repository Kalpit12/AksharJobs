@echo off
echo ========================================
echo    AksharJobs - Stop Network Access
echo ========================================
echo.

echo 🛑 Stopping AksharJobs servers...
echo.

REM Kill processes on port 3002 (Backend)
echo Stopping Backend Server (Port 3002)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3002') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo ✅ Backend server stopped

REM Kill processes on port 3003 (Frontend)
echo Stopping Frontend Server (Port 3003)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3003') do (
    taskkill /f /pid %%a >nul 2>&1
)
echo ✅ Frontend server stopped

echo.
echo ✅ All servers stopped successfully!
echo.
pause
