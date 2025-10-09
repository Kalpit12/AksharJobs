@echo off
echo ====================================
echo MongoDB Local Database Export
echo ====================================
echo.

REM Create backup directory with timestamp
set timestamp=%date:~-4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set backup_dir=mongodb_backup_%timestamp%

echo Creating backup directory: %backup_dir%
mkdir %backup_dir% 2>nul

echo.
echo Exporting TalentMatchDB database...
echo This may take a few minutes depending on database size.
echo.

REM Export the database
mongodump --uri="mongodb://localhost:27017/TalentMatchDB" --out="./%backup_dir%"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Export successful!
    echo.
    echo Backup location: %cd%\%backup_dir%
    echo.
    echo Backup contents:
    dir /b "%backup_dir%\TalentMatchDB"
    echo.
    echo Next steps:
    echo 1. Review the exported files above
    echo 2. Create your MongoDB Atlas cluster
    echo 3. Run: import_to_atlas.bat
    echo.
) else (
    echo.
    echo ❌ Export failed!
    echo.
    echo Common issues:
    echo 1. MongoDB not running - Start MongoDB first
    echo 2. mongodump not installed - Download MongoDB Database Tools
    echo 3. Database name incorrect - Check .edn.local file
    echo.
)

pause

