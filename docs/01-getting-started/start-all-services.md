# Starting All Micro-Frontend Services

## Prerequisites
- Node.js installed
- All dependencies installed (`npm install` from root)
- Shared library built

## Quick Start (Recommended Order)

### 1. Build Shared Library (First Time Only)
```powershell
cd packages\shared-library
npm run build
cd ..\..
```

### 2. Start Shared Library Server (Terminal 1)
```powershell
cd packages\shared-library
npx serve dist -p 9000 --cors
```
**Port:** 9000  
**URL:** http://localhost:9000/shared-library.js

### 3. Start Shell App (Terminal 2)
```powershell
cd packages\shell-app
npm start
```
**Port:** 9999  
**URL:** http://localhost:9999

### 4. Start React MFE (Terminal 3)
```powershell
cd packages\react-mfe
npm start
```
**Port:** 3001  
**URL:** http://localhost:3001

### 5. Start Vue MFE (Terminal 4)
```powershell
cd packages\vue-mfe
npm start
```
**Port:** 3002  
**URL:** http://localhost:3002

### 6. Start Angular MFE (Terminal 5 - Optional)
```powershell
cd packages\angular-mfe
npm start
```
**Port:** 3003  
**URL:** http://localhost:3003

## Service Overview

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Shell App | 9999 | http://localhost:9999 | Main application container |
| Shared Library | 9000 | http://localhost:9000 | Shared utilities and state |
| React MFE | 3001 | http://localhost:3001 | User management module |
| Vue MFE | 3002 | http://localhost:3002 | Products catalog module |
| Angular MFE | 3003 | http://localhost:3003 | Dashboard module |

## Troubleshooting

### "System is not defined" Error
- **Cause:** Shell app HTML is missing SystemJS scripts
- **Solution:** Check that `packages/shell-app/src/index.html` includes SystemJS CDN scripts

### "performanceMonitor is undefined" Error
- **Cause:** Shared library server is not running
- **Solution:** Start the shared library server first (step 2)

### "Vue MFE module not found" Error
- **Cause:** Vue MFE server is not running
- **Solution:** Start the Vue MFE server (step 5)

### "api.createRecord is not a function" Error
- **Cause:** Vue HMR conflict
- **Solution:** Already fixed in webpack.config.js (HMR disabled)

### Shared Library Changes Not Reflecting
```powershell
# Rebuild the shared library
cd packages\shared-library
npm run build

# Restart the serve command
# Press Ctrl+C in the serve terminal, then:
npx serve dist -p 9000 --cors
```

## Development Workflow

### Making Changes to Shared Library
1. Stop the serve process (Ctrl+C)
2. Make your changes in `packages/shared-library/src`
3. Rebuild: `npm run build`
4. Restart serve: `npx serve dist -p 9000 --cors`
5. Refresh browser

### Making Changes to MFEs
- Changes auto-reload (live reload enabled)
- No need to restart the server

## Production Build

```powershell
# Build all packages
npm run build

# Individual builds
cd packages\shared-library && npm run build
cd packages\shell-app && npm run build
cd packages\react-mfe && npm run build
cd packages\vue-mfe && npm run build
cd packages\angular-mfe && npm run build
```

## One-Command Startup (Advanced)

Create a `start-all.ps1` script:
```powershell
# start-all.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages\shared-library; npx serve dist -p 9000 --cors"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages\shell-app; npm start"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages\react-mfe; npm start"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages\vue-mfe; npm start"
Start-Sleep -Seconds 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd packages\angular-mfe; npm start"
```

Run with:
```powershell
.\start-all.ps1
```

## Port Conflicts

If ports are already in use:
```powershell
# Check what's using a port
Get-NetTCPConnection -LocalPort 9000 | Select-Object OwningProcess
Get-Process -Id <OwningProcess>

# Kill the process
Stop-Process -Id <OwningProcess> -Force
```
