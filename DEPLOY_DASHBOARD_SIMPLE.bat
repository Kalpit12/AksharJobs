@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

echo ================================================
echo   Quick Dashboard Deployment
echo ================================================
echo.

SET /P SERVER_IP="Enter your server IP (13.61.35.12): "
SET /P SSH_KEY="Enter your SSH key path (C:\Users\kalpi\key.pem): "

echo.
echo ================================================
echo   Uploading Dashboard Files
echo ================================================
echo.

echo [1/3] Uploading main files...
scp -i "%SSH_KEY%" -r frontend\build\* ubuntu@%SERVER_IP%:/var/www/AksharJobs/frontend/build/

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Upload failed! Trying alternative method...
    echo.
    echo Please try this manually:
    echo 1. Open WinSCP or FileZilla
    echo 2. Connect to %SERVER_IP% with your SSH key
    echo 3. Upload all files from: %CD%\frontend\build\
    echo 4. To: /var/www/AksharJobs/frontend/build/
    echo.
    pause
    exit /b 1
)

echo [2/3] Setting permissions...
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "sudo chown -R www-data:www-data /var/www/AksharJobs/frontend/build && sudo chmod -R 755 /var/www/AksharJobs/frontend/build"

echo [3/3] Reloading Nginx...
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "sudo systemctl reload nginx"

echo.
echo ================================================
echo   DASHBOARD DEPLOYED!
echo ================================================
echo.
echo Your new JobSeeker Dashboard is now live!
echo.
echo Access it at: http://%SERVER_IP%
echo.
echo Steps to see the new dashboard:
echo 1. Open http://%SERVER_IP%
echo 2. Login as a job seeker
echo 3. Click 'Go to Dashboard' button
echo 4. You'll see the new design!
echo.
echo [TIP] Clear browser cache (Ctrl+Shift+Delete) if needed
echo.
pause
