Write-Host "🚀 Setting up SonarQube for Micro Frontend Project" -ForegroundColor Green

# Start SonarQube
Write-Host "`n📦 Starting SonarQube containers..." -ForegroundColor Cyan
docker-compose -f docker-compose.sonar.yml up -d sonarqube sonarqube-db

# Wait for SonarQube to be ready
Write-Host "`n⏳ Waiting for SonarQube to be ready..." -ForegroundColor Cyan
node scripts/wait-for-sonar.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ SonarQube failed to start" -ForegroundColor Red
    exit 1
}

# Display access information
Write-Host "`n✅ SonarQube is running!" -ForegroundColor Green
Write-Host "`n📍 Access SonarQube at: http://localhost:9001" -ForegroundColor Yellow
Write-Host "   Default credentials:" -ForegroundColor Yellow
Write-Host "   Username: admin" -ForegroundColor Yellow
Write-Host "   Password: admin" -ForegroundColor Yellow
Write-Host "`n⚠️  Please change the default password on first login!" -ForegroundColor Yellow

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:9001 in your browser" -ForegroundColor White
Write-Host "   2. Login with admin/admin" -ForegroundColor White
Write-Host "   3. Change your password" -ForegroundColor White
Write-Host "   4. Generate a token: My Account > Security > Generate Token" -ForegroundColor White
Write-Host "   5. Set token: `$env:SONAR_TOKEN = 'your-token'" -ForegroundColor White
Write-Host "   6. Run: npm run sonar:scan" -ForegroundColor White

Write-Host "`n🔑 To generate a token via CLI (after password change):" -ForegroundColor Cyan
Write-Host '   $headers = @{Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:YOUR_NEW_PASSWORD"))}' -ForegroundColor White
Write-Host '   Invoke-RestMethod -Uri "http://localhost:9001/api/user_tokens/generate?name=local-analysis" -Method POST -Headers $headers' -ForegroundColor White
