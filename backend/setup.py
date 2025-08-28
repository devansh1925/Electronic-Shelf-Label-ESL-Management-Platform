#!/usr/bin/env python3
"""
Setup script for ESL Management Platform Backend
This script helps you create the necessary environment file and start the server.
"""

import os
import subprocess
import sys

def create_env_file():
    """Create a .env file with default values"""
    env_content = """# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/esl_management

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
"""
    
    env_file_path = os.path.join(os.path.dirname(__file__), '.env')
    
    if os.path.exists(env_file_path):
        print(f"⚠️  .env file already exists at {env_file_path}")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled.")
            return False
    
    try:
        with open(env_file_path, 'w') as f:
            f.write(env_content)
        print(f"✅ Created .env file at {env_file_path}")
        print("⚠️  Remember to change the JWT_SECRET_KEY in production!")
        return True
    except Exception as e:
        print(f"❌ Error creating .env file: {e}")
        return False

def install_dependencies():
    """Install Python dependencies"""
    print("📦 Installing Python dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Dependencies installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def check_mongodb():
    """Check if MongoDB is running"""
    print("🔍 Checking MongoDB connection...")
    try:
        import pymongo
        client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
        client.server_info()
        print("✅ MongoDB is running and accessible!")
        return True
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("💡 Make sure MongoDB is running on localhost:27017")
        print("   You can start it with: docker run -d -p 27017:27017 --name mongodb mongo:latest")
        return False

def start_server():
    """Start the FastAPI server"""
    print("🚀 Starting FastAPI server...")
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")

def main():
    print("🚀 ESL Management Platform Backend Setup")
    print("=" * 50)
    
    # Step 1: Create environment file
    if not create_env_file():
        return
    
    # Step 2: Install dependencies
    if not install_dependencies():
        return
    
    # Step 3: Check MongoDB
    if not check_mongodb():
        print("\n💡 Please start MongoDB and run this script again.")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. The server will start automatically")
    print("2. Open http://localhost:8000 in your browser")
    print("3. API documentation: http://localhost:8000/docs")
    print("4. Frontend should connect to http://localhost:8000")
    
    response = input("\n🚀 Start the server now? (Y/n): ")
    if response.lower() != 'n':
        start_server()

if __name__ == "__main__":
    main()
