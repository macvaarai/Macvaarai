# Backend startup script for Windows PowerShell

Write-Host "🚀 Starting MacvaarAI Backend Server..." -ForegroundColor Green
Write-Host "=" * 50

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Start FastAPI server
Write-Host "`n📡 Starting FastAPI server on http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API docs available at http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

uvicorn main:app --reload --host 0.0.0.0 --port 8000
