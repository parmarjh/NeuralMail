@echo off
title NeuralMail - Deploy to Vercel
color 0A
echo.
echo  ========================================
echo   NeuralMail - Build and Deploy
echo  ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 ( echo FAILED: npm install & pause & exit /b 1 )

echo.
echo [2/4] Building production bundle...
call npm run build
if errorlevel 1 ( echo FAILED: build & pause & exit /b 1 )
echo  Build complete!

echo.
echo [3/4] Installing Vercel CLI...
call npm install -g vercel 2>nul

echo.
echo [4/4] Deploying to Vercel (production)...
echo  NOTE: Browser will open for login if first time.
call npx vercel --prod --yes

echo.
echo  ========================================
echo   Deployment complete! Check URL above.
echo  ========================================
pause
