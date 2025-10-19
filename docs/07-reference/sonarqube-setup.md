# SonarQube Local Setup - Complete Guide

## Overview
This document describes the complete SonarQube Docker setup for local code quality analysis of the Micro Frontend Single SPA project.

## What Has Been Configured

### 1. Docker Setup
- **File**: `docker-compose.sonar.yml`
- **Services**:
  - **SonarQube Server** (Port 9001) - Community Edition 10.7
  - **PostgreSQL Database** - For SonarQube data persistence
  - **Sonar Scanner** - CLI tool for code analysis

### 2. Configuration Files Created

#### Root Level:
- `sonar-project.properties` - Main project configuration
- `sonar-quality-gate.json` - Quality standards definition
- `.dockerignore` - Excludes unnecessary files from Docker context
- `.gitignore` - Git exclusions

#### Package Level:
Each package has its own `sonar-project.properties`:
- `packages/shell-app/sonar-project.properties`
- `packages/react-mfe/sonar-project.properties`
- `packages/vue-mfe/sonar-project.properties`
- `packages/angular-mfe/sonar-project.properties`
- `packages/shared-library/sonar-project.properties`

### 3. Helper Scripts Created

#### `scripts/wait-for-sonar.js`
Node.js script that waits for SonarQube to be fully operational before proceeding.

#### `scripts/sonar-setup.ps1`
PowerShell script to start SonarQube and display setup instructions.

#### `scripts/sonar-analyze.ps1`
PowerShell script to run SonarQube analysis with error checking.

#### `scripts/sonar-generate-token.ps1`
PowerShell script to generate authentication tokens.

### 4. Package.json Scripts

New npm scripts added to root `package.json`:
```json
{
  "sonar:start": "Start SonarQube containers",
  "sonar:stop": "Stop SonarQube containers",
  "sonar:scan": "Run full code analysis",
  "sonar:analyze": "Run scanner with Docker",
  "sonar:logs": "View SonarQube logs",
  "sonar:clean": "Remove all SonarQube data and volumes",
  "sonar:wait": "Wait for SonarQube to be ready",
  "test:coverage": "Run tests with coverage across all packages",
  "lint:all": "Run linting across all packages",
  "format:check": "Check code formatting",
  "format:write": "Auto-format code"
}
```

## Current Status

### ✅ What's Working:
1. **SonarQube Server** is running successfully on port 9001
2. **PostgreSQL Database** is operational
3. **Authentication** - Token generated: `squ_c19654950413c5126d7298682b4e338a63a0e90b`
4. **Docker Network** - All containers communicate properly
5. **File Indexing** - Scanner successfully indexes 70 files
6. **Quality Profiles** - Loaded for CSS, JS, JSON, TS, and Web
7. **Active Rules** - 1000+ rules loaded across languages

### ⚠️ Known Issues:
1. **TypeScript Configuration Resolution** - Scanner has trouble finding/parsing tsconfig files
   - The analysis starts but stops when trying to resolve TypeScript configurations
   - This prevents the full analysis from completing

### 📊 Analysis Progress:
- Files detected: 75 preprocessed files
- Files indexed: 70 files
- Files ignored: 649 files (node_modules, dist, coverage, etc.)
- Languages detected: 5 (CSS, JS, JSON, TS, HTML)

## How to Use

### Starting SonarQube
```powershell
# Option 1: Using npm script
npm run sonar:start

# Option 2: Direct Docker command
docker-compose -f docker-compose.sonar.yml up -d sonarqube sonarqube-db

# Wait for it to be ready
npm run sonar:wait
```

### Accessing SonarQube UI
1. Open browser to: http://localhost:9001
2. Default credentials:
   - Username: `admin`
   - Password: `admin`
3. **Important**: Change password on first login

### Generating Authentication Token
```powershell
# Using PowerShell directly
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("admin:YOUR_NEW_PASSWORD"))
$headers = @{Authorization = "Basic $base64Auth"}
$response = Invoke-RestMethod -Uri "http://localhost:9001/api/user_tokens/generate?name=local-analysis" -Method POST -Headers $headers
$response.token

# Set the token
$env:SONAR_TOKEN = "your-generated-token"
```

### Running Code Analysis

#### Method 1: Using npm script (recommended when fixed)
```powershell
npm run sonar:scan
```

#### Method 2: Direct Docker command
```powershell
docker run --rm --network micro-frontend-single-spa_sonarnet `
  -v "${PWD}:/usr/src" -w /usr/src `
  -e SONAR_HOST_URL=http://sonarqube:9000 `
  sonarsource/sonar-scanner-cli sonar-scanner `
  "-Dsonar.token=YOUR_TOKEN" `
  "-Dsonar.scm.disabled=true"
```

### Viewing Results
After successful analysis:
- Dashboard: http://localhost:9001/dashboard?id=micro-frontend-single-spa
- Projects: http://localhost:9001/projects

### Stopping SonarQube
```powershell
# Stop containers (keeps data)
npm run sonar:stop

# Stop and remove all data
npm run sonar:clean
```

## Configuration Details

### Exclusions (from sonar-project.properties)
```properties
sonar.exclusions=**/node_modules/**,**/dist/**,**/.angular/**,**/coverage/**,
  **/*.spec.ts,**/*.spec.js,**/*.spec.tsx,**/*.spec.jsx,
  **/*.test.ts,**/*.test.js,**/*.test.tsx,**/*.test.jsx
```

### Quality Gate Conditions
- New Coverage: < 80% = Error
- Duplicated Lines: > 3% = Error
- Maintainability Rating: > A = Error
- Reliability Rating: > A = Error
- Security Rating: > A = Error
- Security Hotspots Reviewed: < 100% = Error

## Troubleshooting

### Port 9000 Already in Use
**Solution**: Changed to port 9001 in `docker-compose.sonar.yml`
```yaml
ports:
  - "9001:9000"  # External:Internal
```

### Scanner Can't Find Files
**Issue**: TypeScript configuration resolution fails
**Workaround**: Set empty tsconfig path:
```bash
-Dsonar.typescript.tsconfigPaths=
```

### Analysis Hangs or Stops
**Possible Causes**:
1. Large node_modules directory not excluded properly
2. TypeScript parser issues
3. Memory constraints

**Solutions**:
- Ensure `.gitignore` excludes node_modules
- Use `-Dsonar.scm.disabled=true` to skip SCM detection
- Increase Docker memory if needed

## Next Steps to Fix Analysis

### 1. Fix TypeScript Configuration
Create simplified tsconfig files or disable TypeScript-specific analysis:
```properties
sonar.typescript.tsconfigPaths=
sonar.javascript.lcov.reportPaths=
```

### 2. Alternative: Analyze Individual Packages
Instead of analyzing the entire monorepo at once, analyze each package separately:
```bash
cd packages/react-mfe
sonar-scanner -Dsonar.projectKey=react-mfe ...
```

### 3. Update TypeScript Configurations
Ensure all `tsconfig.json` files are valid and properly structured.

### 4. Add Test Coverage
Run tests with coverage before analysis:
```powershell
npm run test:coverage
```

## Project Structure for Analysis

```
Micro-Frontend-Single-SPA/
├── docker-compose.sonar.yml          # SonarQube services
├── sonar-project.properties          # Main configuration
├── sonar-quality-gate.json           # Quality standards
├── .dockerignore                     # Docker exclusions
├── .gitignore                        # Git exclusions
├── scripts/
│   ├── wait-for-sonar.js            # Wait script
│   ├── sonar-setup.ps1              # Setup automation
│   ├── sonar-analyze.ps1            # Analysis script
│   └── sonar-generate-token.ps1     # Token generator
└── packages/
    ├── shell-app/sonar-project.properties
    ├── react-mfe/sonar-project.properties
    ├── vue-mfe/sonar-project.properties
    ├── angular-mfe/sonar-project.properties
    └── shared-library/sonar-project.properties
```

## Benefits of This Setup

1. **Isolated Environment**: Docker containers provide consistent analysis environment
2. **Version Control**: All configuration is in source control
3. **Reproducible**: Anyone on the team can run the same analysis locally
4. **Quality Gates**: Automated quality standards enforcement
5. **Multi-Language**: Supports TypeScript, JavaScript, HTML, CSS, JSON
6. **Workspace Support**: Configured for monorepo structure
7. **CI/CD Ready**: Can be integrated into GitHub Actions or other CI systems

## Resources

- SonarQube Documentation: https://docs.sonarqube.org/
- SonarScanner CLI: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
- Quality Profiles: http://localhost:9001/profiles
- Quality Gates: http://localhost:9001/quality_gates

## Credentials

- **SonarQube URL**: http://localhost:9001
- **Default Username**: admin
- **Default Password**: admin (CHANGE THIS!)
- **Generated Token**: squ_c19654950413c5126d7298682b4e338a63a0e90b

## Support Commands

```powershell
# Check SonarQube status
Invoke-WebRequest -Uri "http://localhost:9001/api/system/status" -UseBasicParsing

# View logs
docker logs sonarqube --tail 50

# Check container status
docker ps | Select-String sonar

# Restart SonarQube
docker restart sonarqube

# Access container shell
docker exec -it sonarqube /bin/bash
```

---

**Created**: October 11, 2025
**Status**: Setup Complete - Analysis In Progress
**Next Action**: Fix TypeScript configuration resolution to complete full analysis
