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
│   │
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── generated/
│       ├── lib/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       └── types/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   │   └── ProtectedRoute.tsx
│       │   └── ui/
│       │
│       ├── contexts/
│       │   └── AuthContext.tsx
│       │
│       ├── pages/
│       │   ├── DashboardPage.tsx
│       │   ├── LoginPage.tsx
│       │   └── RegisterPage.tsx
│       │
│       ├── services/
│       └── types/
│
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas/
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

The following workspaces are available:

```text
frontend
backend
packages/shared
```

Dependencies are installed from the project root.

```bash
npm install
```

A single root `package-lock.json` is used for the whole repository.

---

## Shared Package

Shared validation schemas and TypeScript types are located in:

```text
packages/shared
```

The package is available as:

```ts
@coworking/shared
```

Example:

```ts
import {
  loginSchema,
  registerSchema,
  type LoginInput,
  type RegisterInput,
} from "@coworking/shared";
```

This avoids duplicating validation logic between the frontend and backend.

---

## Environment Variables

Environment files are not committed to Git.

Create the required `.env` files from the provided `.env.example` files.

### Root

Example:

```env
POSTGRES_USER=coworking_user
POSTGRES_PASSWORD=change_me
POSTGRES_DB=coworking_db
POSTGRES_PORT=5432
```

### Backend

Example:

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"

JWT_SECRET=change_me_with_a_long_random_secret
JWT_EXPIRES_IN=1h
```

### Frontend

Example:

```env
VITE_API_URL=http://localhost:3000
```

Only variables prefixed with `VITE_` are exposed to the Vite frontend.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd coworking-booking-saas
```

Install all workspace dependencies:

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

Start the database:

```bash
docker compose up -d
```

Check the containers:

```bash
docker compose ps
```

View PostgreSQL logs:

```bash
docker compose logs postgres
```

Stop the containers:

```bash
docker compose down
```

> `docker compose down -v` also deletes the PostgreSQL volume and stored database data.

---

## Prisma

The backend uses Prisma with PostgreSQL.

Generate the Prisma client:

```bash
npm run prisma:generate --workspace=backend
```

Create or apply a development migration:

```bash
npx prisma migrate dev --name <migration-name> --schema backend/prisma/schema.prisma
```

Prisma Studio can be used to inspect the database:

```bash
npx prisma studio --schema backend/prisma/schema.prisma
```

---

## Development

### Start the backend

```bash
npm run dev --workspace=backend
```

Default API URL:

```text
http://localhost:3000
```

### Start the frontend

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

## API

### API root

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

### Health Check

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

## Authentication

### Register

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

The password is hashed using Argon2 before being stored in the database.

Possible responses include:

```text
201 Created
400 Bad Request
409 Conflict
```

---

### Login

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

Invalid credentials return:

```text
401 Unauthorized
```

The API deliberately returns the same error for an unknown email address and an incorrect password to reduce account enumeration risks.

---

### Current Authenticated User

```http
GET /api/auth/me
```

This endpoint is protected and requires a valid JWT.

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

## JWT Authentication Middleware

Protected backend routes use JWT authentication middleware.

The authentication flow is:

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

The current middleware verifies the identity of a user.

Role-based authorization will be implemented separately.

---

## Frontend Authentication

The frontend uses React Context to centralize authentication state.

The `AuthContext` manages:

- authenticated user
- JWT access token
- login
- logout
- session restoration
- authentication loading state

The application avoids reading authentication state directly from `localStorage` throughout the component tree.

Instead, authentication logic is centralized in the context.

---

## Session Restoration

When the application starts, the frontend checks whether an access token exists.

If a token is available, it requests:

```http
GET /api/auth/me
```

The flow is:

```text
Application starts
    ↓
Access token available?
    ↓
GET /api/auth/me
    ↓
Valid token?
    ├── Yes → restore authenticated user
    └── No  → clear local authentication state
```

The backend remains the source of truth for authentication.

---

## Frontend Routes

### Login

```text
/login
```

Allows existing users to authenticate.

Successful authentication redirects the user to:

```text
/dashboard
```

---

### Registration

```text
/register
```

Allows a new user to create an account.

---

### Dashboard

```text
/dashboard
```

This route is protected.

Unauthenticated users are automatically redirected to:

```text
/login
```

The dashboard currently displays basic authenticated user information and provides a logout action.

---

## Protected Frontend Routes

Protected React routes use:

```text
ProtectedRoute
```

Example flow:

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

## Logout

Logging out clears the frontend authentication state and removes the stored access token.

After logout, protected pages are no longer accessible without authenticating again.

---

## Current Features

- npm workspaces monorepo
- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL database
- Docker development database
- Prisma ORM
- Shared TypeScript and Zod package
- Shared frontend/backend authentication schemas
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
- Tailwind CSS
- shadcn/ui with Base UI
- GitHub Actions CI
- Monorepo build pipeline

---

## Planned Features

- Improved authentication security using HTTP-only cookies
- Role-based authorization
- User roles
- Coworking space management
- Coworking resource management
- Desks and meeting rooms
- Resource availability
- Booking creation
- Booking cancellation
- Booking history
- Booking conflict prevention
- Admin dashboard
- User dashboard improvements
- API documentation with Swagger / OpenAPI
- Backend tests with Vitest and Supertest
- Frontend tests
- CI test pipeline
- Improved error handling
- Form validation UX improvements
- Deployment

---

## Authentication Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This simplifies the initial authentication implementation, but it is not intended to be the final production authentication architecture.

A future security improvement will migrate authentication toward HTTP-only cookies in order to reduce direct JavaScript access to authentication tokens and limit token exposure in case of XSS vulnerabilities.

---

## CI

GitHub Actions runs CI for pushes and pull requests targeting:

```text
develop
main
```

The CI pipeline:

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

The full monorepo should also build locally with:

```bash
npm run build
```

---

## Git Workflow

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

### Branches

`main`

Stable production-ready branch.

`develop`

Integration branch for completed features.

Feature branches:

```text
feature/<feature-name>
```

Examples:

```text
feature/user-registration
feature/user-login
feature/auth-middleware
feature/frontend-auth-state
```

Other branch prefixes may include:

```text
fix/
refactor/
chore/
```

---

## Commit Convention

The project follows Conventional Commit-style messages when practical.

Examples:

```text
feat: add user login
feat: add frontend authentication state
fix: handle invalid JWT
refactor: move schemas to shared package
chore: update CI configuration
docs: update authentication documentation
```

Commits should remain focused and small enough to clearly describe one logical change.

---

## Pull Requests

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

## Code Quality Principles

The project aims to follow these principles:

- separation of concerns
- reusable components
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

## License

A license has not been selected yet.

---

## Status

The project is currently under active development.

Current milestone:

```text
Authentication foundation
```

Completed authentication flow:

```text
Register
   ↓
Login
   ↓
JWT
   ↓
Backend authentication middleware
   ↓
Frontend AuthContext
   ↓
Session restoration
   ↓
Protected React routes
   ↓
Dashboard
   ↓
Logout
```

Next milestone:

```text
Coworking domain and booking MVP
```