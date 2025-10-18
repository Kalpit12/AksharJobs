# Get Local IP Address for Network Testing
# This script helps you find your local IP address to access the website from other devices

Write-Host "`n🌐 Local Network IP Address Finder" -ForegroundColor Cyan
Write-Host "=" -Repeat 50 -ForegroundColor Cyan

# Get all IPv4 addresses
$ipAddresses = Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.InterfaceAlias -notlike "*Loopback*" -and 
    $_.InterfaceAlias -notlike "*VirtualBox*" -and
    $_.InterfaceAlias -notlike "*VMware*" -and
    $_.AddressState -eq "Preferred"
}

# Filter for local network IPs
$localIPs = $ipAddresses | Where-Object {
    $_.IPAddress -like "192.168.*" -or 
    $_.IPAddress -like "10.*" -or 
    ($_.IPAddress -like "172.*" -and [int]($_.IPAddress.Split('.')[1]) -ge 16 -and [int]($_.IPAddress.Split('.')[1]) -le 31)
}

if ($localIPs) {
    Write-Host "`n✅ Found your local IP address(es):`n" -ForegroundColor Green
    
    foreach ($ip in $localIPs) {
        $interface = $ip.InterfaceAlias
        $address = $ip.IPAddress
        
        Write-Host "   Interface: " -NoNewline -ForegroundColor Yellow
        Write-Host "$interface" -ForegroundColor White
        Write-Host "   IP Address: " -NoNewline -ForegroundColor Yellow
        Write-Host "$address" -ForegroundColor Green -BackgroundColor DarkGray
        Write-Host ""
    }
    
    # Get the primary IP (usually the first one)
    $primaryIP = $localIPs[0].IPAddress
    
    Write-Host "📱 Access your website from other devices:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "   Frontend: " -NoNewline -ForegroundColor Yellow
    Write-Host "http://$primaryIP`:3003" -ForegroundColor Green
    Write-Host "   Backend:  " -NoNewline -ForegroundColor Yellow
    Write-Host "http://$primaryIP`:3002" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "📋 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. Start backend:  cd backend && python start_backend.py" -ForegroundColor White
    Write-Host "   2. Start frontend: cd frontend && npm run start:network" -ForegroundColor White
    Write-Host "   3. Open firewall:  Run setup_firewall.ps1 as Administrator" -ForegroundColor White
    Write-Host "   4. Visit http://$primaryIP`:3003 from your phone/tablet" -ForegroundColor White
    Write-Host ""
    
    # Copy to clipboard if possible
    try {
        $primaryIP | Set-Clipboard
        Write-Host "✅ Primary IP address copied to clipboard!" -ForegroundColor Green
    } catch {
        # Clipboard not available, that's okay
    }
    
} else {
    Write-Host "`n❌ No local network IP address found!" -ForegroundColor Red
    Write-Host "`nTroubleshooting:" -ForegroundColor Yellow
    Write-Host "   • Make sure you're connected to Wi-Fi or Ethernet" -ForegroundColor White
    Write-Host "   • Check your network adapter settings" -ForegroundColor White
    Write-Host "   • Try: ipconfig /all" -ForegroundColor White
}

Write-Host "`n" -NoNewline

