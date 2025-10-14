@echo off
echo ================================================
echo   Deploy JobSeeker Dashboard to Server
echo ================================================
echo.

REM Get user inputs
set /p SERVER_IP="Enter your EC2 server IP (e.g., 13.61.35.12): "
set /p SSH_KEY="Enter path to your .pem file (e.g., C:\path\to\key.pem): "

echo.
echo ================================================
echo   Deployment Configuration
echo ================================================
echo Server: ubuntu@%SERVER_IP%
echo SSH Key: %SSH_KEY%
echo Remote Path: /var/www/AksharJobs/frontend/build/
echo.

REM Confirm deployment
set /p CONFIRM="Continue with deployment? (Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo Deployment cancelled.
    pause
    exit /b
)

echo.
echo ================================================
echo   Step 1: Preparing server directory
echo ================================================
echo Creating backup and cleaning old build...
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "cd /var/www/AksharJobs/frontend && sudo cp -r build build_backup_$(date +%%Y%%m%%d_%%H%%M%%S) 2>/dev/null || true && sudo rm -rf build/* 2>/dev/null || true && sudo mkdir -p build && sudo chown -R ubuntu:www-data build && sudo chmod -R 755 build"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to prepare server directory
    pause
    exit /b 1
)

echo [OK] Server directory prepared

echo.
echo ================================================
echo   Step 2: Uploading build files
echo ================================================
echo This may take a few minutes...
scp -i "%SSH_KEY%" -r frontend\build\* ubuntu@%SERVER_IP%:/var/www/AksharJobs/frontend/build/

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to upload files
    pause
    exit /b 1
)

echo [OK] Files uploaded successfully

echo.
echo ================================================
echo   Step 3: Setting permissions
echo ================================================
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "cd /var/www/AksharJobs/frontend/build && sudo chown -R ubuntu:www-data . && sudo chmod -R 755 . && sudo find . -type f -exec chmod 644 {} \;"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to set permissions
    pause
    exit /b 1
)

echo [OK] Permissions set correctly

echo.
echo ================================================
echo   Step 4: Verifying deployment
echo ================================================
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "ls -lah /var/www/AksharJobs/frontend/build/ && test -f /var/www/AksharJobs/frontend/build/index.html && echo '[OK] index.html exists' || echo '[ERROR] index.html not found'"

echo.
echo ================================================
echo   Step 5: Testing Nginx
echo ================================================
ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "sudo nginx -t"

if %ERRORLEVEL% EQU 0 (
    echo [OK] Nginx configuration is valid
    echo.
    echo Reloading Nginx...
    ssh -i "%SSH_KEY%" ubuntu@%SERVER_IP% "sudo systemctl reload nginx"
    echo [OK] Nginx reloaded
) else (
    echo [WARNING] Nginx configuration test failed
)

echo.
echo ================================================
echo   DEPLOYMENT COMPLETE!
echo ================================================
echo.
echo Your JobSeeker Dashboard is now live at:
echo   http://%SERVER_IP%/jobseeker-dashboard
echo.
echo Quick verification:
echo   1. Open: http://%SERVER_IP%
echo   2. Login as a job seeker
echo   3. Click "Go to Dashboard" button
echo   4. Explore the new dashboard!
echo.
echo [TIP] Clear your browser cache (Ctrl+Shift+Delete) if you see old content
echo.
pause

