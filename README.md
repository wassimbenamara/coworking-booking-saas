# Coworking Booking SaaS

A full-stack SaaS application for booking coworking spaces.

The project is developed incrementally, with one feature added at a time.

## Architecture

The project is organized as an npm workspaces monorepo.

```text
coworking-booking-saas/
├── frontend/
├── backend/
├── packages/
│   └── shared/
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI

### Backend

- Node.js
- TypeScript
- Express
- Zod
- Argon2
- JSON Web Token (JWT)

### Database

- PostgreSQL
- Prisma ORM

### Shared Package

- npm Workspaces
- TypeScript
- Zod

### DevOps & Tooling

- Docker
- GitHub Actions
- Swagger / OpenAPI
- Vitest
- Supertest

## Workspaces

The monorepo contains three main workspaces:

```text
frontend
backend
@coworking/shared
```

The shared package contains code used by both the frontend and backend.

Current shared resources include:

- Authentication validation schemas
- Shared TypeScript types

## Shared Package

The shared package is located at:

```text
packages/shared
```

It is imported by the frontend and backend through:

```ts
import {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from "@coworking/shared";
```

This avoids duplicating validation rules and shared types across applications.

## Installation

Install all workspace dependencies from the project root:

```bash
npm install
```

The project uses a single root `package-lock.json`.

## Environment Variables

### Root environment

Create a `.env` file at the project root based on `.env.example`.

Example:

```env
POSTGRES_USER=coworking_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=coworking_db
POSTGRES_PORT=5432
```

### Frontend environment

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000
```

### Backend environment

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

Environment files are ignored by Git and must not be committed.

## Getting Started

### 1. Install dependencies

From the project root:

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

Check the database status:

```bash
docker compose ps
```

Stop the database:

```bash
docker compose down
```

### 3. Build the shared package

```bash
npm run build:shared
```

### 4. Start the backend

```bash
npm run dev --workspace=backend
```

The backend API is available by default at:

```text
http://localhost:3000
```

### 5. Start the frontend

```bash
npm run dev --workspace=frontend
```

The frontend is available by default at:

```text
http://localhost:5173
```

## Build

Build the entire monorepo:

```bash
npm run build
```

You can also build workspaces separately:

```bash
npm run build:shared
npm run build:frontend
npm run build:backend
```

## Database

The backend uses PostgreSQL with Prisma ORM.

Generate the Prisma Client:

```bash
npm run prisma:generate --workspace=backend
```

Apply database migrations:

```bash
npm exec --workspace=backend prisma migrate dev
```

Open Prisma Studio:

```bash
npm exec --workspace=backend prisma studio
```

## Authentication

The authentication flow currently supports:

- User registration
- Password hashing with Argon2
- User login
- JWT access token generation
- Shared request validation with Zod

The access token is returned after a successful login.

## Current Features

- npm workspaces monorepo architecture
- Shared validation package
- Frontend and backend initialization
- Health check endpoint
- Frontend-to-backend API communication
- Environment variable configuration
- PostgreSQL database with Docker
- Prisma ORM configuration
- User database model
- User registration API
- Password hashing with Argon2
- Shared request validation with Zod
- User registration UI
- Registration API integration
- User login API
- JWT access token generation
- Invalid credentials handling
- Reusable frontend UI system with Tailwind CSS and shadcn/ui
- GitHub Actions CI workflow

## Development Workflow

The project follows a feature-based Git workflow:

```text
feature/*
    ↓
Pull Request
    ↓
develop
    ↓
Pull Request
    ↓
main
```

Example branch names:

```text
feature/database-setup
feature/user-registration
feature/user-registration-ui
feature/ui-system
feature/user-login

fix/booking-conflict

refactor/monorepo-shared
```

## Continuous Integration

The project uses GitHub Actions for continuous integration.

On pushes and pull requests targeting `main` or `develop`, the CI workflow:

- Installs monorepo dependencies from the root
- Builds the shared package
- Builds the frontend
- Generates the Prisma Client
- Builds the backend

## Planned Features

- Login UI
- Protected routes
- JWT authentication middleware
- Role management
- Coworking space management
- Room and desk management
- Availability management
- Booking system
- Booking conflict prevention
- User reservations
- Admin dashboard
- Swagger / OpenAPI documentation
- Automated tests
- CI/CD improvements

## Documentation

More information is available in:

```text
frontend/README.md
backend/README.md
packages/shared/
```

## Project Status

🚧 Work in progress.