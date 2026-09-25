# Coworking Booking SaaS

A full-stack SaaS application for booking coworking spaces.

The project is developed incrementally, with one feature added at a time.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- Node.js
- TypeScript
- Express

### Database

- PostgreSQL
- Prisma ORM

### DevOps & Tooling

- Docker
- GitHub Actions
- Swagger / OpenAPI
- Vitest
- Supertest

## Project Structure

```text
coworking-booking-saas/
├── frontend/
├── backend/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

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
```

Environment files are ignored by Git and must not be committed.

## Getting Started

### 1. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Check that the database is running:

```bash
docker compose ps
```

To stop the database:

```bash
docker compose down
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend API is available by default at:

```text
http://localhost:3000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is available by default at:

```text
http://localhost:5173
```

## Database

The project uses PostgreSQL with Prisma ORM.

Apply database migrations:

```bash
cd backend
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

## Current Features

- Frontend and backend initialization
- Health check endpoint
- Frontend-to-backend API communication
- Environment variable configuration
- PostgreSQL database with Docker
- Prisma ORM configuration
- Initial User database model
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
feature/booking-system
fix/booking-conflict
```

## Continuous Integration

The project uses GitHub Actions for continuous integration.

On pushes and pull requests targeting `main` or `develop`, the CI workflow:

- Installs frontend dependencies
- Builds the frontend
- Installs backend dependencies
- Builds the backend

## Planned Features

- User registration
- User authentication
- Role management
- Coworking space management
- Room and desk management
- Availability management
- Booking system
- Booking conflict prevention
- User reservations
- Admin dashboard
- Swagger API documentation
- Automated tests
- CI/CD improvements

## Documentation

More information is available in:

```text
frontend/README.md
backend/README.md
```

## Project Status

🚧 Work in progress.