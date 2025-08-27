@echo off
echo Starting AksharJobs Development Environment with Docker...
echo.

echo Building and starting development services...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo Development services are starting up...
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:3001
echo.

echo Waiting for services to be ready...
timeout /t 15 /nobreak > nul

echo.
echo Checking service status...
docker-compose -f docker-compose.dev.yml ps

echo.
echo To view logs, run: docker-compose -f docker-compose.dev.yml logs -f
echo To stop services, run: stop-dev.bat
echo.
echo NOTE: Changes to your code will automatically reload!
pause
