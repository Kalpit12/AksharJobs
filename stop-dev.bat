@echo off
echo Stopping AksharJobs Development Docker services...
echo.

docker-compose -f docker-compose.dev.yml down

echo.
echo Development services stopped successfully!
echo.
pause
