# Verification Script for Referral Page Fixes
# Run this before deploying to ensure all fixes are in place

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Verifying Referral Page Fixes" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$filePath = "referral.html"
$allChecks = $true

# Check 1: File exists
Write-Host "[CHECK 1] Verifying file exists..." -ForegroundColor Yellow
if (Test-Path $filePath) {
    Write-Host "✅ File found: $filePath" -ForegroundColor Green
} else {
    Write-Host "❌ File not found: $filePath" -ForegroundColor Red
    $allChecks = $false
    exit 1
}

# Check 2: Read file content
$content = Get-Content $filePath -Raw -Encoding UTF8

# Check 3: Verify proper emojis (not corrupted)
Write-Host "`n[CHECK 2] Verifying emoji encoding..." -ForegroundColor Yellow
$emojiTests = @(
    @{ emoji = "🎉"; name = "Party Popper" },
    @{ emoji = "🪙"; name = "Coin" },
    @{ emoji = "👥"; name = "People" },
    @{ emoji = "📊"; name = "Chart" },
    @{ emoji = "💡"; name = "Bulb" },
    @{ emoji = "💰"; name = "Money Bag" }
)

$emojiPass = $true
foreach ($test in $emojiTests) {
    if ($content -match [regex]::Escape($test.emoji)) {
        Write-Host "  ✅ $($test.name) emoji ($($test.emoji)) found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $($test.name) emoji ($($test.emoji)) NOT found" -ForegroundColor Red
        $emojiPass = $false
    }
}

if (-not $emojiPass) {
    Write-Host "`n⚠️  Some emojis are missing or corrupted!" -ForegroundColor Red
    $allChecks = $false
}

# Check 4: Verify Google Sheets sync fix
Write-Host "`n[CHECK 3] Verifying Google Sheets sync fix..." -ForegroundColor Yellow
if ($content -match "Directly update displays with synced data") {
    Write-Host "  ✅ Google Sheets sync fix present" -ForegroundColor Green
} else {
    Write-Host "  ❌ Google Sheets sync fix NOT found" -ForegroundColor Red
    $allChecks = $false
}

# Check 5: Verify accurate coin calculation fix
Write-Host "`n[CHECK 4] Verifying coin calculation fix..." -ForegroundColor Yellow
if ($content -match "referralData\.totalCoinsEarned \|\| shareCoins") {
    Write-Host "  ✅ Coin calculation prioritizes Google Sheets data" -ForegroundColor Green
} else {
    Write-Host "  ❌ Coin calculation fix NOT found" -ForegroundColor Red
    $allChecks = $false
}

# Check 6: Verify no duplicate HTML documents
Write-Host "`n[CHECK 5] Verifying no duplicate HTML documents..." -ForegroundColor Yellow
$htmlCount = ([regex]::Matches($content, "<!DOCTYPE html>")).Count
if ($htmlCount -eq 1) {
    Write-Host "  ✅ Single HTML document found" -ForegroundColor Green
} else {
    Write-Host "  ❌ Found $htmlCount HTML documents (should be 1)" -ForegroundColor Red
    $allChecks = $false
}

# Check 7: File size check
Write-Host "`n[CHECK 6] Verifying file size..." -ForegroundColor Yellow
$fileSize = (Get-Item $filePath).Length
$fileSizeKB = [math]::Round($fileSize / 1KB, 2)
Write-Host "  📊 File size: $fileSizeKB KB" -ForegroundColor Cyan
if ($fileSize -lt 500KB) {
    Write-Host "  ✅ File size looks good" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  File is unusually large (might contain duplicates)" -ForegroundColor Yellow
}

# Final summary
Write-Host "`n========================================" -ForegroundColor Cyan
if ($allChecks) {
    Write-Host "✅ ALL CHECKS PASSED!" -ForegroundColor Green
    Write-Host "`nYour referral.html file is ready for deployment!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy to Vercel: Run deploy_to_vercel.bat" -ForegroundColor White
    Write-Host "2. Deploy to www.aksharjobs.com: Upload via FTP/cPanel" -ForegroundColor White
    Write-Host "3. Test both sites after deployment" -ForegroundColor White
} else {
    Write-Host "❌ SOME CHECKS FAILED!" -ForegroundColor Red
    Write-Host "`nPlease review the errors above before deploying." -ForegroundColor Red
}
Write-Host "========================================`n" -ForegroundColor Cyan

# Pause at the end
Read-Host -Prompt "Press Enter to exit"

