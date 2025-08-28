@echo off
echo Starting ESL Management Platform Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file...
    echo # MongoDB Connection > .env
    echo MONGO_URL=mongodb://localhost:27017/esl_management >> .env
    echo. >> .env
    echo # JWT Configuration >> .env
    echo JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production >> .env
    echo JWT_ALGORITHM=HS256 >> .env
    echo JWT_EXPIRE_MINUTES=60 >> .env
    echo .env file created successfully!
    echo.
)

REM Install dependencies if requirements.txt exists
if exist "requirements.txt" (
    echo Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo Error installing dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Starting server...
echo Server will be available at: http://localhost:8000
echo API docs will be available at: http://localhost:8000/docs
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

pause
