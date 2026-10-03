# Coworking Booking SaaS

A full-stack SaaS application for managing coworking spaces, users, resources, availability, and bookings.

The project is built as an npm workspaces monorepo with a React frontend, Node.js backend, PostgreSQL database, Prisma ORM, and shared TypeScript validation schemas.

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui
- Base UI
- Zod

### Backend

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- Zod
- Argon2
- JSON Web Tokens (JWT)

### Shared Package

- TypeScript
- Zod
- npm workspaces

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- npm workspaces

---

## Project Structure

```text
coworking-booking-saas/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── generated/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── types/
│   ├── prisma.config.ts
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   │   └── ProtectedRoute.tsx
│       │   └── ui/
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   └── RegisterPage.tsx
│       ├── services/
│       └── types/
│
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas/
│           │   ├── auth.schema.ts
│           │   └── coworking-space.schema.ts
│           └── index.ts
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── package.json
├── package-lock.json
├── .env.example
└── README.md
```

---

## Monorepo

The project uses npm workspaces.

Available workspaces:

```text
frontend
backend
packages/shared
```

Install dependencies from the project root:

```bash
npm install
```

A single root `package-lock.json` is used for the entire repository.

---

## Shared Package

Shared validation schemas and TypeScript types are located in:

```text
packages/shared
```

The package is exposed as:

```text
@coworking/shared
```

Example:

```ts
import {
  loginSchema,
  registerSchema,
  createCoworkingSpaceSchema,
  type LoginInput,
  type RegisterInput,
  type CreateCoworkingSpaceInput,
} from "@coworking/shared";
```

This avoids duplicating validation rules between the frontend and backend.

The backend remains the authoritative validation layer.

---

## Environment Variables

Environment files are not committed to Git.

Create the required `.env` files from the provided `.env.example` files.

### Root

```env
POSTGRES_USER=coworking_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=coworking_db
POSTGRES_PORT=5432
```

### Backend

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"

JWT_SECRET=change_me_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

### Frontend

```env
VITE_API_URL=http://localhost:3000
```

Only environment variables prefixed with `VITE_` are exposed to the frontend by Vite.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd coworking-booking-saas
```

Install dependencies:

```bash
npm install
```

Build the shared package:

```bash
npm run build:shared
```

---

## Database

PostgreSQL runs locally using Docker Compose.

Start PostgreSQL:

```bash
docker compose up -d
```

Check containers:

```bash
docker compose ps
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Stop containers:

```bash
docker compose down
```

> `docker compose down -v` also deletes the PostgreSQL volume and all stored database data.

---

## Prisma

Prisma is configured inside the backend workspace.

The recommended workflow is to run Prisma commands from:

```text
backend/
```

Enter the backend workspace:

```bash
cd backend
```

Generate Prisma Client:

```bash
npx prisma generate
```

Validate the Prisma schema:

```bash
npx prisma validate
```

Create or apply a development migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Open Prisma Studio:

```bash
npx prisma studio
```

Return to the repository root:

```bash
cd ..
```

---

## Development

### Backend

From the repository root:

```bash
npm run dev --workspace=backend
```

Default API URL:

```text
http://localhost:3000
```

### Frontend

```bash
npm run dev --workspace=frontend
```

Default frontend URL:

```text
http://localhost:5173
```

---

## Build

Build the complete monorepo:

```bash
npm run build
```

Or build individual workspaces:

```bash
npm run build:shared
npm run build:frontend
npm run build:backend
```

---

# API

## API Root

```http
GET /
```

Example response:

```json
{
  "message": "Coworking Booking API"
}
```

---

## Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "coworking-booking-api"
}
```

---

# Authentication

## Register

```http
POST /api/auth/register
```

Example request:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Possible responses:

```text
201 Created
400 Bad Request
409 Conflict
```

Passwords are hashed using Argon2 before being stored.

---

## Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Example response:

```json
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  },
  "accessToken": "<jwt-access-token>"
}
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
```

The API deliberately returns the same error for an unknown email and an incorrect password to reduce account enumeration risks.

---

## Current Authenticated User

```http
GET /api/auth/me
```

Requires a valid JWT access token.

Request header:

```http
Authorization: Bearer <access_token>
```

Example response:

```json
{
  "user": {
    "id": 1,
    "email": "john@example.com"
  }
}
```

Missing, invalid, or expired tokens return:

```text
401 Unauthorized
```

---

# Coworking Spaces

All coworking space endpoints currently require authentication.

Requests must include:

```http
Authorization: Bearer <access_token>
```

## List Coworking Spaces

```http
GET /api/coworking-spaces
```

Returns all coworking spaces.

Possible responses:

```text
200 OK
401 Unauthorized
```

---

## Get Coworking Space by ID

```http
GET /api/coworking-spaces/:id
```

Example:

```http
GET /api/coworking-spaces/1
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
404 Not Found
```

---

## Create Coworking Space

```http
POST /api/coworking-spaces
```

Example request:

```json
{
  "name": "WorkHub Paris",
  "description": "Modern coworking space in central Paris",
  "address": "10 Rue de Rivoli",
  "city": "Paris",
  "country": "France"
}
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
```


# JWT Authentication Middleware

Protected backend routes use JWT authentication middleware.

Flow:

```text
HTTP Request
    ↓
Authorization: Bearer <token>
    ↓
JWT authentication middleware
    ↓
jwt.verify(...)
    ↓
Authenticated user attached to req.user
    ↓
Protected controller
```

Authentication and authorization are intentionally separated.

The current middleware verifies the user's identity.

Role-based authorization will be implemented separately.

---

# Frontend Authentication

The frontend uses React Context to centralize authentication state.

`AuthContext` manages:

- authenticated user
- JWT access token
- login
- logout
- session restoration
- authentication loading state

Authentication logic is centralized instead of accessing browser storage directly from multiple components.

---

## Session Restoration

When the frontend starts, it checks whether an access token exists.

If one exists, it calls:

```http
GET /api/auth/me
```

Flow:

```text
Application starts
    ↓
Access token available?
    ↓
GET /api/auth/me
    ↓
Valid token?
    ├── Yes → restore authenticated user
    └── No  → clear authentication state
```

The backend remains the source of truth for authentication.

---

# Frontend Routes

## Login

```text
/login
```

Successful authentication redirects the user to:

```text
/dashboard
```

## Registration

```text
/register
```

Allows a new user to create an account.

## Dashboard

```text
/dashboard
```

This route is protected.

Unauthenticated users are redirected to:

```text
/login
```

## Coworking Spaces

```text
/coworking-spaces
```

Protected route.

Displays all coworking spaces available to authenticated users.

## Coworking Space Details

```text
/coworking-spaces/:id
```

Protected route.

Displays details for a selected coworking space.

## Create Coworking Space

```text
/coworking-spaces/new
```

Protected route.

Allows authenticated users to create a new coworking space.
---

# Protected Frontend Routes

Protected React routes use:

```text
ProtectedRoute
```

Flow:

```text
/dashboard
    ↓
ProtectedRoute
    ↓
Authentication loading?
    ↓
Authenticated user?
    ├── Yes → render protected page
    └── No  → redirect to /login
```

---

# Logout

Logging out:

```text
Remove stored access token
    ↓
Clear authenticated user
    ↓
Protected routes become inaccessible
```

---

# Database Models

## User

```text
id
email
firstName
lastName
password
createdAt
updatedAt
```

Passwords are stored as Argon2 hashes.

## CoworkingSpace

```text
id
name
description
address
city
country
createdAt
updatedAt
```

`description` is optional.

---

# Current Features

- npm workspaces monorepo
- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL database
- Docker development database
- Prisma ORM
- Shared TypeScript and Zod package
- Shared frontend/backend authentication schemas
- Shared coworking space validation schema
- User registration API
- User registration UI
- Argon2 password hashing
- User login API
- User login UI
- JWT access token generation
- JWT authentication middleware
- Protected backend routes
- Authenticated user endpoint
- React authentication context
- Centralized frontend authentication state
- Session restoration using `/api/auth/me`
- Protected frontend routes
- Authenticated dashboard
- Logout flow
- Coworking space data model
- Coworking space listing API
- Coworking space details API
- Authenticated coworking space creation
- Tailwind CSS
- shadcn/ui with Base UI
- GitHub Actions CI
- Monorepo build pipeline
- Protected coworking space listing
- Protected coworking space details
- Coworking space frontend pages
- Centralized authenticated API client

---

# Planned Features

- Improved authentication security using HTTP-only cookies
- Role-based authorization
- User roles
- Coworking space update and deletion
- Coworking resource management
- Desks and meeting rooms
- Resource availability
- Booking creation
- Booking cancellation
- Booking history
- Booking conflict prevention
- Admin dashboard
- User dashboard improvements
- Swagger / OpenAPI documentation
- Backend tests with Vitest and Supertest
- Frontend tests
- CI test pipeline
- Improved error handling
- Form validation UX improvements
- Deployment

---

# Authentication Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This simplifies the initial authentication implementation, but it is not intended to be the final production authentication architecture.

A future improvement will migrate authentication toward HTTP-only cookies to reduce direct JavaScript access to authentication tokens and limit token exposure in case of XSS vulnerabilities.

---

# CI

GitHub Actions runs CI for pushes and pull requests targeting:

```text
develop
main
```

Pipeline:

```text
Install dependencies
    ↓
Build shared package
    ↓
Build frontend
    ↓
Generate Prisma Client
    ↓
Build backend
```

Run the same build locally with:

```bash
npm run build
```

---

# Git Workflow

Development follows a feature-branch workflow.

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

## Branches

### `main`

Stable production-ready branch.

### `develop`

Integration branch for completed features.

### Feature branches

```text
feature/<feature-name>
```

Examples:

```text
feature/user-registration
feature/user-login
feature/auth-middleware
feature/frontend-auth-state
feature/coworking-spaces
```

Other prefixes:

```text
fix/
refactor/
chore/
```

---

# Commit Convention

The project follows Conventional Commit-style messages when practical.

Examples:

```text
feat: add user login
feat: add frontend authentication state
feat: add coworking spaces API
fix: handle invalid JWT
refactor: move schemas to shared package
chore: update CI configuration
docs: update project documentation
```

Commits should remain focused and describe one logical change.

---

# Pull Requests

Feature branches should normally be merged into:

```text
develop
```

The `main` branch remains stable.

The `develop` branch will be merged into `main` when the first MVP is complete.

The initial MVP target includes:

- user registration
- user login
- coworking spaces
- basic booking functionality

---

# Code Quality Principles

The project aims to follow these principles:

- separation of concerns
- reusable components
- service / controller / route separation
- centralized authentication logic
- shared frontend/backend schemas
- backend as the source of truth
- environment variables for configuration
- no secrets committed to Git
- small feature branches
- small and descriptive commits
- pull requests before integration
- stable `main` branch
- strict TypeScript
- explicit API error handling

---

# License

A license has not been selected yet.

---

# Status

🚧 Work in progress.

Current milestone:

```text
Coworking domain and booking MVP
```

Completed:

```text
Authentication foundation
    ↓
CoworkingSpace database model
    ↓
CoworkingSpace validation
    ↓
CoworkingSpace API
```

Next milestone:

```text
Coworking spaces frontend
```