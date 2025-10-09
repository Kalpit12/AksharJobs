@echo off
echo ====================================
echo MongoDB Atlas Import Tool
echo ====================================
echo.

REM Find the most recent backup directory
for /f "delims=" %%i in ('dir /b /ad /o-d mongodb_backup_*') do (
    set latest_backup=%%i
    goto :found
)

:found
if "%latest_backup%"=="" (
    echo ❌ No backup directory found!
    echo.
    echo Please run export_local_mongodb.bat first.
    pause
    exit /b 1
)

echo Latest backup found: %latest_backup%
echo.

REM Prompt for Atlas connection string
echo Please enter your MongoDB Atlas connection string:
echo Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
echo.
set /p ATLAS_URI="Atlas URI: "

if "%ATLAS_URI%"=="" (
    echo ❌ No URI provided. Exiting.
    pause
    exit /b 1
)

echo.
echo Importing to MongoDB Atlas...
echo This may take several minutes depending on database size.
echo.

REM Import to Atlas
mongorestore --uri="%ATLAS_URI%" --db="TalentMatchDB" "./%latest_backup%/TalentMatchDB"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Import successful!
    echo.
    echo Next steps:
    echo 1. Update .edn.local with your Atlas connection string
    echo 2. Run: python test_atlas_connection.py
    echo 3. Start your backend and test the application
    echo.
) else (
    echo.
    echo ❌ Import failed!
    echo.
    echo Common issues:
    echo 1. Invalid connection string format
    echo 2. Authentication failed - Check username/password
    echo 3. IP not whitelisted in Atlas Network Access
    echo 4. Special characters in password need URL encoding
    echo.
    echo See MONGODB_ATLAS_MIGRATION_GUIDE.md for help
    echo.
)

pause

