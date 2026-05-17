@echo off
title NeuralMail - Setup & Run
color 0B
echo.
echo  ========================================
echo   NeuralMail - Installing and Starting
echo  ========================================
echo.

cd /d "%~dp0"

echo [1/3] Installing npm packages...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed. Is Node.js installed?
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)
echo  Done!

echo.
echo [2/3] Running type check...
call npx tsc --noEmit 2>nul
echo  Done!

echo.
echo [3/3] Starting dev server at http://localhost:5173
echo  Press Ctrl+C to stop.
echo.
start "" http://localhost:5173
call npm run dev

pause
