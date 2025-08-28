# ESL Management Platform

A full‑stack Electronic Shelf Label (ESL) Management Platform built with FastAPI (Python) and Next.js (React/TypeScript). It provides authentication, stores, products, gateways, ESL devices, and sync logs management with a modern UI.

## What You Can Do With This Platform

- Manage organizations and retail entities end‑to‑end: stores, categories, products, gateways, and ESL devices
- Authenticate users and protect routes using JWT‑based sessions
- Create, read, update, and delete (CRUD) all core entities via a clean UI and REST API
- View and filter synchronization logs to audit ESL update operations
- Use a responsive, accessible UI built on Tailwind CSS and shadcn/ui

## Key Features

- Authentication and Authorization
  - Email/password login with JWT issuance on the backend
  - Protected routes and session handling on the frontend
  - Role‑aware guards ready for expansion (e.g., Admin/Manager/Staff)

- Stores Management
  - Create and manage store records and metadata
  - Associate gateways and ESL devices to specific stores

- Products and Categories
  - Full CRUD for products and categories
  - Designed to map products to ESL devices for label rendering

- Gateways and ESL Devices
  - Register and manage gateways
  - Track ESL devices, their metadata, and associations

- Sync Logs and Auditing
  - Inspect synchronization runs and outcomes
  - Filter and paginate historical logs for troubleshooting

- Developer‑Friendly Architecture
  - Typed API schemas with Pydantic
  - A small API client layer on the frontend (`frontend/lib/api/*.ts`)
  - Modern React patterns with the App Router and context providers

## Pages and Screens (Frontend)

- `landing/` – marketing/overview entry point
- `login/`, `register/` – authentication flow
- `dashboard.tsx` – top‑level dashboard shell
- `stores/` – stores listing and management
- `products/` – products listing and management
- `app/esl-management/` – ESL device management views
- `gateways/` – gateway listing and management
- `sync-logs/` – synchronization history and filtering
- `users/` – user listing and management (admin‑focused)

## Typical Workflows

1) Admin registers or logs in to receive a JWT session
2) Create one or more stores and register gateways for each store
3) Add categories and products
4) Register ESL devices and associate them to products/stores
5) Trigger or monitor sync operations; review `sync-logs` for results

## API Overview (Backend)

The backend exposes RESTful routes under `backend/routes/` for:

- `auth` – login/refresh and token handling
- `user` – user creation, listing, and details
- `store` – CRUD for store entities
- `category` – CRUD for categories
- `product` – CRUD for products
- `gateway` – CRUD for gateways
- `esl` – CRUD for ESL devices
- `sync_log` – read/filter synchronization history

All endpoints use Pydantic schemas under `backend/schemas/` and persist to MongoDB via models in `backend/models/`.

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
