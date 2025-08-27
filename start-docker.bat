@echo off
echo Starting AksharJobs with Docker...
echo.

echo Building and starting services...
docker-compose up --build -d

echo.
echo Services are starting up...
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:8080
echo.

echo Waiting for services to be ready...
timeout /t 10 /nobreak > nul

echo.
echo Checking service status...
docker-compose ps

echo.
echo To view logs, run: docker-compose logs -f
echo To stop services, run: stop-docker.bat
echo.
pause
