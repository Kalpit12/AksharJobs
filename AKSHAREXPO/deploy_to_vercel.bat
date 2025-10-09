@echo off
echo ========================================
echo   Deploying AKSHAREXPO to Vercel
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI is not installed!
    echo.
    echo Install it with: npm install -g vercel
    echo.
    pause
    exit /b 1
)

echo [INFO] Vercel CLI found!
echo.

REM Navigate to AKSHAREXPO directory
cd /d "%~dp0"
echo Current directory: %CD%
echo.

REM Deploy to Vercel
echo [INFO] Starting deployment...
echo.
vercel --prod

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Test your deployment at:
echo - https://akjobs.vercel.app/referral
echo.
echo Login with: hemant.patel@maxproinfotech.com
echo Expected: 21 AksharCoins with proper emojis
echo.
pause

