@echo off
title VoltPath EV Intelligence Platform
echo ================================================================
echo  Starting VoltPath EV Intelligence Platform (NED CT-363 DAA)
echo ================================================================
echo.

:: 1. Start Python FastAPI Backend on Port 8000 using project venv
echo [1/2] Starting Python FastAPI Backend on http://127.0.0.1:8000 ...
start "VoltPath FastAPI Backend" cmd /k ".\venv\Scripts\python.exe -m uvicorn api.server:app --reload --port 8000"

:: 2. Wait 2 seconds
timeout /t 2 /nobreak >nul

:: 3. Start Vite React Frontend on Port 5173
echo [2/2] Starting Vite React Frontend on http://localhost:5173 ...
cd frontend
start "VoltPath React Frontend" cmd /k "npm run dev"

:: 4. Open default browser
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo ================================================================
echo  VoltPath is now running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://127.0.0.1:8000/docs
echo ================================================================
pause