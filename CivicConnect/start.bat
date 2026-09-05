@echo off
TITLE CivicConnect - Jharkhand Societal Innovation Portal
echo ========================================================
echo  Starting CivicConnect (Frontend + Backend + AI Service)
echo  Government of Jharkhand Societal Innovation Portal
echo ========================================================
echo.

cd /d "%~dp0"

REM Check node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH! Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Run setup if node_modules missing
if not exist "node_modules" (
    echo [INFO] Installing root dependencies...
    call npm install
)

if not exist "client\node_modules" (
    echo [INFO] Installing client dependencies...
    call npm --prefix client install
)

if not exist "server\node_modules" (
    echo [INFO] Installing server dependencies...
    call npm --prefix server install
)

echo.
echo [INFO] Starting all services with single command: npm run dev
echo   - Backend Server:  http://localhost:5000
echo   - React Frontend:  http://localhost:5173
echo.
call npm run dev
pause
