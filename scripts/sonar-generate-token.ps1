Write-Host "🔑 Generating SonarQube Token" -ForegroundColor Green

# Default credentials
$username = "admin"
$password = "admin"

Write-Host "`n⏳ Attempting to generate token with default credentials..." -ForegroundColor Cyan

# Create auth header
$base64AuthInfo = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${username}:${password}"))
$headers = @{
    Authorization = "Basic $base64AuthInfo"
}

try {
    # Try to generate token
    $tokenName = "local-analysis-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    $response = Invoke-RestMethod -Uri "http://localhost:9001/api/user_tokens/generate?name=$tokenName" -Method POST -Headers $headers
    
    if ($response.token) {
        Write-Host "`n✅ Token generated successfully!" -ForegroundColor Green
        Write-Host "`n🔑 Your SonarQube Token:" -ForegroundColor Yellow
        Write-Host $response.token -ForegroundColor White
        
        Write-Host "`n📝 To use this token, run:" -ForegroundColor Cyan
        Write-Host "`$env:SONAR_TOKEN = '$($response.token)'" -ForegroundColor White
        
        # Set it for current session
        $env:SONAR_TOKEN = $response.token
        Write-Host "`n✅ Token has been set for this PowerShell session" -ForegroundColor Green
        
        # Save to a file for reference
        $response.token | Out-File -FilePath ".sonar-token" -NoNewline
        Write-Host "✅ Token saved to .sonar-token file" -ForegroundColor Green
    }
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`n⚠️  Default password has been changed" -ForegroundColor Yellow
        Write-Host "Please generate token manually:" -ForegroundColor Yellow
        Write-Host "1. Open http://localhost:9001" -ForegroundColor White
        Write-Host "2. Login with your credentials" -ForegroundColor White
        Write-Host "3. Go to: My Account > Security > Generate Token" -ForegroundColor White
        Write-Host "4. Set token: `$env:SONAR_TOKEN = 'your-token'" -ForegroundColor White
    }
    else {
        Write-Host "`n❌ Error generating token: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
}

