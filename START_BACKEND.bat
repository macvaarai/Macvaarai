@echo off
echo ========================================
echo    MACVAARAI BACKEND STARTUP
echo ========================================
echo.
echo Starting backend server...
echo Server will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
cd /d "c:\bhai health\macvaarai-backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
