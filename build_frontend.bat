@echo off
echo Building Resume Matcher Frontend...
echo.

cd /d "%~dp0frontend"

echo Installing dependencies...
npm install

echo Building production version...
npm run build

echo.
echo Frontend built successfully!
echo Build files are in: frontend\build
echo.
pause
