@echo off
title NeuralMail - Deploy to Vercel (Team: shivaillps-projects)
color 0B
echo.
echo  ======================================================
echo   NeuralMail - Vercel Auto-Deployment
echo   Target Team: shivaillps-projects
echo  ======================================================
echo.

cd /d "%~dp0"

echo [1/3] Building production bundle locally...
call npm run build
if errorlevel 1 (
    echo.
    echo  ✗ Build failed! Please check code issues.
    pause
    exit /b 1
)
echo  ✓ Build succeeded! Production files ready in dist/

echo.
echo [2/3] Verifying / Installing Vercel CLI...
where vercel >nul 2>nul
if errorlevel 1 (
    echo  Installing Vercel globally via npm...
    call npm install -g vercel
) else (
    echo  ✓ Vercel CLI is already installed.
)

echo.
echo [3/3] Launching Vercel deployment under team: shivaillps-projects...
echo.
echo  ======================================================
echo  INSTRUCTIONS:
echo  1. If asked "Set up and deploy?", type 'y' and press Enter.
echo  2. If asked "Which scope should contain your project?", select 'shivaillps-projects'.
echo  3. If asked "Link to existing project?", type 'n' and press Enter.
echo  4. For project name, press Enter to keep 'NeuralMail'.
echo  5. Keep all default directory/build options (just press Enter).
echo  ======================================================
echo.

call vercel --scope shivaillps-projects --prod --yes

if errorlevel 1 (
    echo.
    echo  ✗ Vercel deployment encountered an error.
    echo  If you aren't logged into Vercel, run 'vercel login' first.
    echo.
) else (
    echo.
    echo  ======================================================
    echo   ✓ SUCCESS! NeuralMail has been deployed to Vercel!
    echo  ======================================================
    echo.
)

pause
