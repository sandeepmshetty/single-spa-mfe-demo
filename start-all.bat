@echo off
echo.
echo ====================================================
echo 🚀 Single-SPA Micro-Frontend Development Launcher
echo ====================================================
echo.
echo Starting all micro-frontend development servers...
echo.

REM Check if we're in the correct directory
if not exist "packages\shell-app\package.json" (
    echo ❌ Error: Please run this script from the root project directory
    echo Expected: Micro-Frontend-Single-SPA\
    pause
    exit /b 1
)

echo 📚 Step 1: Starting Shared Library server...
start "Shared Library" cmd /c "cd packages\shared-library && http-server dist -p 3004 --cors"
timeout /t 2 /nobreak >nul

echo 🏠 Step 2: Starting Shell App (Main Orchestrator)...
start "Shell App" cmd /c "cd packages\shell-app && npm start"
timeout /t 3 /nobreak >nul

echo ⚛️ Step 3: Starting React MFE (User Management)...
start "React MFE" cmd /c "cd packages\react-mfe && npm start"
timeout /t 2 /nobreak >nul

echo 🍃 Step 4: Starting Vue MFE (Product Catalog)...
start "Vue MFE" cmd /c "cd packages\vue-mfe && npm run dev"
timeout /t 2 /nobreak >nul

echo 🅰️ Step 5: Starting Angular MFE (Analytics Dashboard)...
start "Angular MFE" cmd /c "cd packages\angular-mfe && npm start"

echo.
echo ====================================================
echo ✅ All servers are starting up!
echo ====================================================
echo.
echo 🌐 Application URLs:
echo   Main App (Shell):     http://localhost:3000
echo   React MFE (Users):    http://localhost:3001  
echo   Vue MFE (Products):   http://localhost:3002
echo   Angular MFE (Analytics): http://localhost:3003
echo   Shared Library:       http://localhost:3004
echo.
echo 📋 Available Routes:
echo   /           - Landing page
echo   /users      - User Management (React)
echo   /products   - Product Catalog (Vue)
echo   /dashboard  - Analytics Dashboard (Angular)
echo.
echo ⏳ Please wait 10-15 seconds for all servers to fully start
echo 🌐 Main application will be available at: http://localhost:3000
echo.
echo 🔧 To stop all servers: Close all terminal windows or press Ctrl+C in each
echo.
pause