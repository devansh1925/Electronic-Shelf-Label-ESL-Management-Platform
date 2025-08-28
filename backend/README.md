# ESL Management Platform - Backend

## Setup Instructions

### Option 1: Quick Start (Recommended)

#### Windows Users
```bash
# Double-click the start_backend.bat file
# OR run from command prompt:
start_backend.bat
```

#### Unix/Linux/Mac Users
```bash
# Make the script executable (first time only)
chmod +x start_backend.sh

# Run the script
./start_backend.sh
```

### Option 2: Manual Setup

#### 1. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Connection
MONGO_URL=mongodb://localhost:27017/esl_management

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60
```

#### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Start MongoDB
Make sure MongoDB is running on your system. You can use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### 4. Run the Backend
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Option 3: Python Setup Script
```bash
python setup.py
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user info

### Other endpoints will be added as the platform grows

## Features
- User authentication with JWT tokens
- Password hashing with bcrypt
- MongoDB integration
- FastAPI framework
- Automatic CORS configuration for frontend

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running on localhost:27017
   - Check if the MongoDB service is started

2. **Port Already in Use**
   - Change the port in the start script or command
   - Kill any existing processes using port 8000

3. **Python Dependencies Error**
   - Make sure you have Python 3.8+ installed
   - Try upgrading pip: `pip install --upgrade pip`

4. **JWT Secret Key Error**
   - Generate a new secret key for production
   - Use a strong, random string

## Development

### Running in Development Mode
The server runs with auto-reload enabled by default. Any changes to Python files will automatically restart the server.

### API Documentation
Once the server is running, visit:
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Testing the API
You can test the API endpoints using:
- The interactive Swagger UI at `/docs`
- Tools like Postman or Insomnia
- Command line tools like curl
