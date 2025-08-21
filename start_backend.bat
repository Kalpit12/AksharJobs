@echo off
echo Starting Resume Matcher Backend Server...
echo.

cd /d "%~dp0backend"

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing/updating requirements...
pip install -r requirements.txt

echo Starting Flask server...
echo Backend will be available at: http://localhost:5000
echo.
python app.py

pause
