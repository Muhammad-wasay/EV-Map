@echo off
title VoltPath EV Intelligence Platform
echo ================================================================
echo  Starting VoltPath EV Intelligence Platform (NED CT-363 DAA)
echo ================================================================
echo.

:: 1. Start Vite React Frontend on Port 5173
echo Starting Vite React Frontend on http://localhost:5173 ...
cd frontend
start "VoltPath React Frontend" cmd /k "npm run dev"

:: 2. Open default browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ================================================================
echo  VoltPath is now running!
echo  URL: http://localhost:5173
echo  Note: Decoupled client-side mode active. 
echo ================================================================
pause
