# ESL Management Platform - Frontend

## Setup Instructions

### Option 1: Quick Start (Recommended)

#### Windows Users
```bash
# Double-click the start_frontend.bat file
# OR run from command prompt:
start_frontend.bat
```

#### Unix/Linux/Mac Users
```bash
# Make the script executable (first time only)
chmod +x start_frontend.sh

# Run the script
./start_frontend.sh
```

### Option 2: Manual Setup

#### 1. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 2. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

### Authentication
- **Login Page** (`/login`) - Sign in with email and password
- **Register Page** (`/register`) - Create new account
- **Landing Page** (`/`) - Platform overview for unauthenticated users
- **Dashboard** (`/`) - Main application for authenticated users

### User Experience
- Modern, responsive UI with Tailwind CSS
- Form validation and error handling
- Loading states and success notifications
- Protected routes with automatic redirects
- JWT token management

### Navigation
- Sidebar navigation with collapsible menu
- User profile dropdown with logout functionality
- Responsive design for mobile and desktop

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context for authentication
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation

## Project Structure
```
frontend/
├── app/                    # Next.js app directory
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── landing/          # Landing page
│   └── layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   └── protected-route.tsx # Route protection component
├── contexts/             # React contexts
│   └── auth-context.tsx  # Authentication context
└── dashboard.tsx         # Main dashboard component
```

## Backend Integration
The frontend connects to the backend API at `http://localhost:8000`. Make sure the backend is running before testing the frontend.

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Kill any existing processes using port 3000
   - Change the port in next.config.mjs if needed

2. **Dependencies Error**
   - Delete node_modules and package-lock.json
   - Run `npm install` again

3. **Backend Connection Error**
   - Make sure the backend is running on port 8000
   - Check if CORS is properly configured

4. **Build Errors**
   - Clear Next.js cache: `rm -rf .next`
   - Restart the development server

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
The frontend automatically connects to `http://localhost:8000` for the backend API. To change this, modify the fetch URLs in the authentication context and API calls.
