# ============================================================================
# VoltPath 1-Click Local Evaluation Launcher (FastAPI Backend + React Frontend)
# ============================================================================
Write-Host "Starting VoltPath FastAPI Backend (:8000) and React Frontend (:5173)..." -ForegroundColor Cyan

# 1. Start FastAPI Server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn api.server:app --host 127.0.0.1 --port 8000 --reload"

# 2. Install frontend packages if node_modules is missing, then launch Vite React dev server
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing React (Vite + Leaflet) dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host "✅ FastAPI running at http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "✅ React UI running at http://localhost:5173" -ForegroundColor Green
