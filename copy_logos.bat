@echo off
echo Copying company logos to the project...
echo.

set "source_dir=%USERPROFILE%\Desktop"
set "target_dir=frontend\public\assets\logos"

echo Source: %source_dir%
echo Target: %target_dir%
echo.

if not exist "%target_dir%" (
    echo Creating target directory...
    mkdir "%target_dir%"
)

echo Copying logos...
copy "%source_dir%\SAF-MAIN-LOGO.png" "%target_dir%\" 2>nul && echo ✓ Safaricom logo copied || echo ✗ SAF-MAIN-LOGO.png not found
copy "%source_dir%\KENYA AIRWAYSS.png" "%target_dir%\" 2>nul && echo ✓ Kenya Airways logo copied || echo ✗ KENYA AIRWAYSS.png not found
copy "%source_dir%\KCB.png" "%target_dir%\" 2>nul && echo ✓ KCB logo copied || echo ✗ KCB.png not found
copy "%source_dir%\Equity_Group_Logo.png" "%target_dir%\" 2>nul && echo ✓ Equity Bank logo copied || echo ✗ Equity_Group_Logo.png not found
copy "%source_dir%\c-operative_bank_logo.png" "%target_dir%\" 2>nul && echo ✓ Co-op Bank logo copied || echo ✗ c-operative_bank_logo.png not found

echo.
echo Logo copying complete!
echo Check the %target_dir% folder to verify all logos are there.
pause
