#!/bin/bash

echo "Starting ESL Management Platform Frontend..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found"
    echo "Please run this script from the frontend directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Error installing dependencies"
        exit 1
    fi
    echo "Dependencies installed successfully!"
    echo
fi

echo "Starting development server..."
echo "Frontend will be available at: http://localhost:3000"
echo "Backend should be running at: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo

npm run dev
