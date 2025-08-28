#!/bin/bash

echo "Starting ESL Management Platform Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/esl_management

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
EOF
    echo ".env file created successfully!"
    echo
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "Installing dependencies..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "Error installing dependencies"
        exit 1
    fi
    echo "Dependencies installed successfully!"
    echo
fi

echo "Starting server..."
echo "Server will be available at: http://localhost:8000"
echo "API docs will be available at: http://localhost:8000/docs"
echo "Press Ctrl+C to stop the server"
echo

python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
