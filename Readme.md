# ESL Management Platform

A full‑stack Electronic Shelf Label (ESL) Management Platform built with FastAPI (Python) and Next.js (React/TypeScript). It provides authentication, stores, products, gateways, ESL devices, and sync logs management with a modern UI.

## Tech Stack

- Backend: FastAPI, Uvicorn, Pydantic, MongoDB
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- Auth: JWT (backend), React Context (frontend)
- Tooling: ESLint, Prettier, TypeScript

## Repository Structure

```
backend/                 # FastAPI backend
  models/                # Data models (users, products, stores, etc.)
  routes/                # API endpoints
  schemas/               # Pydantic schemas
  utils/                 # Utilities (auth, logger)
  database/              # Mongo connection helpers
  config/                # Settings
  main.py                # FastAPI entrypoint
  requirements.txt       # Backend dependencies
frontend/                # Next.js frontend
  app/                   # App Router pages
  components/            # UI components (shadcn/ui)
  contexts/              # React contexts (auth)
  lib/                   # API client wrappers
  package.json           # Frontend scripts and deps
```

## Prerequisites

- Node.js 18+ (20+ recommended)
- Python 3.12+
- MongoDB 6+ (local or hosted)
- pnpm or npm (choose one)

## Quick Start

### 1) Install dependencies

```bash
# Frontend deps (choose one)
cd frontend
pnpm install  # or: npm install
cd ..

# Backend venv + deps
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2) Environment variables

Create a `.env` file for backend and `.env.local` for frontend.

Backend (`backend/.env`):

```bash
# Mongo
MONGO_URI=mongodb://localhost:27017/esl
DATABASE_NAME=esl

# JWT
JWT_SECRET=change_me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# App
APP_ENV=development
APP_DEBUG=true
CORS_ORIGINS=http://localhost:3000
```

Frontend (`frontend/.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3) Run locally

Backend:

```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Frontend:

```bash
cd frontend
pnpm dev  # or: npm run dev
```

- API: http://localhost:8000 (Open /docs for Swagger UI)
- Web: http://localhost:3000

## Scripts

Backend (from `backend/`):

```bash
source venv/bin/activate
python seed_data.py      # Seed sample data (if applicable)
```

Frontend (from `frontend/`):

```bash
pnpm dev            # Start dev server
pnpm build          # Production build
pnpm start          # Start built app
pnpm lint           # Lint
```

## Development Notes

- Auth: JWT in `backend/routes/auth.py` and `backend/utils/auth.py`. Frontend uses `contexts/auth-context.tsx` and `components/protected-route.tsx`.
- API clients: `frontend/lib/api/*.ts` used by pages in `frontend/app/*`.
- UI: shadcn/ui components under `frontend/components/ui` with Tailwind CSS.

## Testing

Backend:

```bash
# From backend/
pip install pytest
pytest -q
```

Frontend:

```bash
# From frontend/
pnpm test
```

## Deployment

- Backend: Deploy FastAPI with Uvicorn/Gunicorn behind a reverse proxy. Configure environment variables and CORS.
- Frontend: Deploy to Vercel/Netlify/Node host. Set `NEXT_PUBLIC_API_BASE_URL` to your backend URL.

## Git and Ignore Rules

Sensitive/local files are ignored by the included `.gitignore` (env files, build outputs, caches, `node_modules`, virtualenvs, `.next`, etc.). Commit only source code and safe configuration.
