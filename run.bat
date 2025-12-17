@echo off
REM Quick start script for Product Recommendation System

echo ===============================================
echo Product Recommendation System - Quick Start
echo ===============================================
echo.

REM Check if virtual environment exists
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements
echo Installing dependencies...
pip install -r requirements.txt -q

REM Run migrations
echo Running migrations...
python manage.py makemigrations
python manage.py migrate

REM Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput -q

echo.
echo ===============================================
echo Setup Complete!
echo ===============================================
echo.
echo Starting development server...
echo Server will be available at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start development server
python manage.py runserver
