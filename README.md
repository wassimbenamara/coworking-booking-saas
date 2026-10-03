# Coworking Booking SaaS

A full-stack SaaS application for managing coworking spaces, resources, availability, and bookings.

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
│       │   └── ui/
│       ├── contexts/
│       ├── lib/
│       ├── pages/
│       ├── services/
│       └── types/
│
├── packages/
│   └── shared/
│       └── src/
│           ├── schemas/
│           │   ├── auth.schema.ts
│           │   ├── coworking-resource.schema.ts
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
  createCoworkingResourceSchema,
  type LoginInput,
  type RegisterInput,
  type CreateCoworkingSpaceInput,
  type CreateCoworkingResourceInput,
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

Only variables prefixed with `VITE_` are exposed to the frontend by Vite.

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

Run Prisma CLI commands from:

```text
backend/
```

Enter the backend directory:

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

Return to the project root:

```bash
cd ..
```

---

## Development

### Backend

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

Passwords are hashed using Argon2.

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

Requires a valid JWT.

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

Possible response:

```text
401 Unauthorized
```

---

# Coworking Spaces

All coworking space endpoints currently require authentication.

Request header:

```http
Authorization: Bearer <access_token>
```

## List Coworking Spaces

```http
GET /api/coworking-spaces
```

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

---

# Coworking Resources

Coworking resources represent reservable entities inside a coworking space.

Current resource types:

```text
DESK
MEETING_ROOM
```

All coworking resource endpoints currently require authentication.

Request header:

```http
Authorization: Bearer <access_token>
```

## List Resources for a Coworking Space

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

Example:

```http
GET /api/coworking-spaces/1/resources
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
```

---

## Get Resource by ID

```http
GET /api/coworking-resources/:id
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
404 Not Found
```

---

## Create Coworking Resource

```http
POST /api/coworking-resources
```

Example request:

```json
{
  "name": "Desk A1",
  "type": "DESK",
  "capacity": 1,
  "coworkingSpaceId": 1
}
```

Meeting room example:

```json
{
  "name": "Meeting Room Alpha",
  "type": "MEETING_ROOM",
  "capacity": 8,
  "coworkingSpaceId": 1
}
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
```

A `404 Not Found` is returned when the referenced coworking space does not exist.

---

# Authentication Middleware

Protected backend routes use JWT authentication middleware.

Flow:

```text
HTTP request
    ↓
Authorization: Bearer <token>
    ↓
authenticate middleware
    ↓
JWT verification
    ↓
req.user
    ↓
protected controller
```

Authentication and authorization are intentionally separated.

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

Authenticated API calls are centralized through:

```text
frontend/src/lib/api.ts
```

---

## Session Restoration

On application startup, the frontend restores the user session using:

```http
GET /api/auth/me
```

Flow:

```text
Application starts
    ↓
Stored access token?
    ↓
GET /api/auth/me
    ↓
Valid token?
    ├── Yes → restore user
    └── No  → clear authentication state
```

---

# Frontend Routes

## Login

```text
/login
```

## Registration

```text
/register
```

## Dashboard

```text
/dashboard
```

Protected route.

## Coworking Spaces

```text
/coworking-spaces
```

Protected route.

## Coworking Space Details

```text
/coworking-spaces/:id
```

Protected route.

## Create Coworking Space

```text
/coworking-spaces/new
```

Protected route.

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

---

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
resources[]
```

---

## CoworkingResource

```text
id
name
type
capacity
coworkingSpaceId
createdAt
updatedAt
```

Resource type:

```text
DESK
MEETING_ROOM
```

Each resource belongs to one coworking space.

A coworking space can contain multiple resources.

---

# Current Features

- npm workspaces monorepo
- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL database
- Docker development database
- Prisma ORM
- Shared TypeScript and Zod package
- Shared authentication schemas
- Shared coworking space validation schema
- Shared coworking resource validation schema
- User registration API
- User registration UI
- User login API
- User login UI
- Argon2 password hashing
- JWT access token generation
- JWT authentication middleware
- Protected backend routes
- React authentication context
- Session restoration
- Protected frontend routes
- Centralized authenticated API client
- Coworking space data model
- Protected coworking space listing
- Protected coworking space details
- Authenticated coworking space creation
- Coworking space frontend pages
- Coworking resource data model
- Coworking resource types
- Authenticated coworking resource listing
- Authenticated coworking resource details
- Authenticated coworking resource creation
- GitHub Actions CI
- Monorepo build pipeline

---

# Planned Features

- Coworking resources frontend
- Coworking space update and deletion
- Coworking resource update and deletion
- Role-based authorization
- User roles
- Resource availability
- Booking creation
- Booking cancellation
- Booking history
- Booking conflict prevention
- Admin dashboard
- Improved user dashboard
- Swagger / OpenAPI documentation
- Backend tests with Vitest and Supertest
- Frontend tests
- CI test pipeline
- Improved error handling
- Form validation UX improvements
- HTTP-only cookie authentication
- Deployment

---

# Authentication Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This is acceptable for the current development stage, but it is not intended to be the final production authentication architecture.

A future improvement will migrate authentication toward HTTP-only cookies.

---

# CI

GitHub Actions runs on pushes and pull requests targeting:

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

Run locally with:

```bash
npm run build
```

---

# Git Workflow

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

## Main Branch

```text
main
```

Stable branch.

## Integration Branch

```text
develop
```

Completed features are merged here first.

## Feature Branches

Examples:

```text
feature/user-registration
feature/user-login
feature/auth-middleware
feature/frontend-auth-state
feature/coworking-spaces
feature/coworking-spaces-ui
feature/coworking-resources
```

Other prefixes:

```text
fix/
refactor/
chore/
```

---

# Commit Convention

Examples:

```text
feat: add user login
feat: add coworking spaces API
feat: add protected coworking spaces frontend
feat: add coworking resources API
fix: handle invalid JWT
refactor: move schemas to shared package
chore: update CI configuration
docs: update project documentation
```

---

# Pull Requests

Feature branches are merged into:

```text
develop
```

The `main` branch remains stable.

The first MVP target includes:

- user registration
- user login
- coworking spaces
- coworking resources
- basic booking functionality

Once the first MVP is complete, `develop` will be merged into `main`.

---

# Code Quality Principles

- separation of concerns
- route / controller / service separation
- shared frontend/backend schemas
- centralized authentication logic
- centralized authenticated API client
- backend as the source of truth
- environment-based configuration
- no secrets committed to Git
- strict TypeScript
- explicit API error handling
- small feature branches
- descriptive commits
- pull requests before integration
- stable `main`

---

# Status

🚧 Work in progress.

Current milestone:

```text
Coworking resources
```

Completed:

```text
Authentication foundation
    ↓
Coworking spaces
    ↓
Coworking resources API
```

Next:

```text
Coworking resources frontend
```