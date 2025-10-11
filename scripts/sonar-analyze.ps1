param(
    [string]$Token = $env:SONAR_TOKEN
)

Write-Host "🔍 Running SonarQube Analysis" -ForegroundColor Green

# Check if token is provided
if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "❌ Error: SONAR_TOKEN not provided" -ForegroundColor Red
    Write-Host "Please set SONAR_TOKEN environment variable or pass it as parameter" -ForegroundColor Yellow
    Write-Host "Example: .\scripts\sonar-analyze.ps1 -Token YOUR_TOKEN" -ForegroundColor Yellow
    exit 1
}

# Check if SonarQube is running
Write-Host "`n🔍 Checking if SonarQube is running..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9001/api/system/status" -UseBasicParsing -ErrorAction Stop
    $status = ($response.Content | ConvertFrom-Json).status
    if ($status -ne "UP") {
        Write-Host "❌ SonarQube is not ready. Status: $status" -ForegroundColor Red
        Write-Host "Please run: npm run sonar:start" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ SonarQube is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Cannot connect to SonarQube at http://localhost:9001" -ForegroundColor Red
    Write-Host "Please run: npm run sonar:start" -ForegroundColor Yellow
    exit 1
}

# Run SonarQube analysis
Write-Host "`n🔍 Running SonarQube analysis..." -ForegroundColor Cyan
docker-compose -f docker-compose.sonar.yml run --rm `
    -e SONAR_TOKEN=$Token `
    sonar-scanner sonar-scanner `
    -Dsonar.login=$Token

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Analysis complete!" -ForegroundColor Green
    Write-Host "📊 View results at: http://localhost:9001/dashboard?id=micro-frontend-single-spa" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Analysis failed" -ForegroundColor Red
    exit 1
}
