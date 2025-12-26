# Script to restart the backend server
Write-Host "Stopping any existing backend processes on port 3000..." -ForegroundColor Yellow

# Find and stop processes using port 3000
$processes = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($processes) {
    foreach ($pid in $processes) {
        Write-Host "Stopping process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
}

Write-Host "Starting backend server..." -ForegroundColor Green
Set-Location $PSScriptRoot
npm run start:dev

