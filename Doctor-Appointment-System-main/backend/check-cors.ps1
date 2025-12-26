# Script to check if CORS is enabled on the backend
Write-Host "Testing backend CORS configuration..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/users" -Method OPTIONS -Headers @{
        'Origin' = 'http://localhost:3001'
        'Access-Control-Request-Method' = 'POST'
        'Access-Control-Request-Headers' = 'Content-Type'
    } -UseBasicParsing -ErrorAction Stop
    
    Write-Host "`nResponse Status: $($response.StatusCode)" -ForegroundColor Green
    
    $corsOrigin = $response.Headers['Access-Control-Allow-Origin']
    $corsMethods = $response.Headers['Access-Control-Allow-Methods']
    $corsHeaders = $response.Headers['Access-Control-Allow-Headers']
    
    if ($corsOrigin) {
        Write-Host "✅ CORS is ENABLED" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Origin: $corsOrigin" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Methods: $corsMethods" -ForegroundColor Green
        Write-Host "   Access-Control-Allow-Headers: $corsHeaders" -ForegroundColor Green
    } else {
        Write-Host "❌ CORS is NOT enabled - backend needs to be restarted!" -ForegroundColor Red
        Write-Host "   Please stop the backend (Ctrl+C) and restart it with: npm run start:dev" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error connecting to backend: $_" -ForegroundColor Red
    Write-Host "   Is the backend running on port 3000?" -ForegroundColor Yellow
}

