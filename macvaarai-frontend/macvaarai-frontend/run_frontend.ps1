# Frontend startup script for Windows PowerShell

Write-Host "🚀 Starting MacvaarAI Frontend Server..." -ForegroundColor Green
Write-Host "=" * 50

Write-Host "`n🌐 Starting Vite development server" -ForegroundColor Cyan
Write-Host "📱 Frontend will be available at http://localhost:5173" -ForegroundColor Cyan
Write-Host "⚠️  Make sure the backend is running at http://localhost:8000" -ForegroundColor Yellow
Write-Host "`nPress Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev
