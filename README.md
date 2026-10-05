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
│       │   ├── navigation/
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

The repository uses a single root `package-lock.json`.

---

## Shared Package

Shared validation schemas and TypeScript types are located in:

```text
packages/shared
```

The package is imported as:

```ts
@coworking/shared
```

Current shared schemas include:

```text
auth.schema.ts
booking.schema.ts
coworking-resource.schema.ts
coworking-space.schema.ts
resource-availability.schema.ts
```

This keeps frontend and backend validation contracts aligned.

---

## Environment Variables

Environment files are not committed to Git.

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

Only variables prefixed with `VITE_` are exposed to the frontend.

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

Start PostgreSQL:

```bash
docker compose up -d
```

Build the shared package:

```bash
npm run build:shared
```

---

## Database

PostgreSQL runs locally through Docker Compose.

Start:

```bash
docker compose up -d
```

Check status:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs postgres
```

Stop:

```bash
docker compose down
```

> `docker compose down -v` also removes the PostgreSQL volume and stored data.

---

## Prisma

Run Prisma commands from:

```text
backend/
```

Validate:

```bash
npx prisma validate
```

Create a migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Generate Prisma Client:

```bash
npx prisma generate
```

Open Prisma Studio:

```bash
npx prisma studio
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

Or individually:

```bash
npm run build:shared
npm run build:frontend
npm run build:backend
```

---

# API

## Health Check

```http
GET /api/health
```

Example:

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

Example:

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

Example:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Successful authentication returns a user and JWT access token.

Invalid credentials return:

```text
401 Unauthorized
```

The backend deliberately uses the same error response for unknown email addresses and incorrect passwords.

---

## Current User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

---

# Coworking Spaces

All coworking application endpoints require authentication.

## List

```http
GET /api/coworking-spaces
```

## Details

```http
GET /api/coworking-spaces/:id
```

## Create

```http
POST /api/coworking-spaces
```

Example:

```json
{
  "name": "WorkHub Paris",
  "description": "Modern coworking space",
  "address": "10 Rue de Rivoli",
  "city": "Paris",
  "country": "France"
}
```

---

# Coworking Resources

Resources represent desks or meeting rooms.

Supported resource types:

```text
DESK
MEETING_ROOM
```

## List Resources

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

## Resource Details

```http
GET /api/coworking-resources/:id
```

## Create Resource

```http
POST /api/coworking-resources
```

Example:

```json
{
  "name": "Meeting Room A",
  "type": "MEETING_ROOM",
  "capacity": 6,
  "coworkingSpaceId": 1
}
```

---

# Resource Availability

Availability defines the time ranges during which a resource may be booked.

## List Resource Availabilities

```http
GET /api/coworking-resources/:resourceId/availabilities
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
404 Not Found
```

---

## Create Resource Availability

```http
POST /api/resource-availabilities
```

Example:

```json
{
  "resourceId": 1,
  "startsAt": "2026-10-10T09:00:00.000Z",
  "endsAt": "2026-10-10T18:00:00.000Z"
}
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

Validation rules:

```text
resourceId > 0
startsAt = valid ISO datetime
endsAt = valid ISO datetime
endsAt > startsAt
```

---

## Availability Overlap Prevention

Availability ranges for the same resource cannot overlap.

Rule:

```text
existing.startsAt < new.endsAt
AND
existing.endsAt > new.startsAt
```

Allowed:

```text
09:00 → 12:00
12:00 → 18:00
```

Rejected:

```text
09:00 → 12:00
11:00 → 14:00
```

Conflicting availability returns:

```text
409 Conflict
```

---

# Booking

Authenticated users can book coworking resources.

A booking:

- belongs to the authenticated user
- belongs to one resource
- must fit inside an availability window
- cannot overlap another booking for the same resource

The authenticated user is obtained from the JWT.

`userId` is never accepted from the request body.

---

## List My Bookings

```http
GET /api/bookings/me
```

Possible responses:

```text
200 OK
401 Unauthorized
```

---

## Create Booking

```http
POST /api/bookings
```

Example:

```json
{
  "resourceId": 1,
  "startsAt": "2026-10-10T10:00:00.000Z",
  "endsAt": "2026-10-10T12:00:00.000Z"
}
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
409 Conflict
```

---

## Booking Availability Validation

A booking must fit entirely inside an availability range.

```text
availability.startsAt <= booking.startsAt
AND
availability.endsAt >= booking.endsAt
```

---

## Booking Conflict Prevention

Bookings cannot overlap for the same resource.

```text
existing.startsAt < new.endsAt
AND
existing.endsAt > new.startsAt
```

Allowed:

```text
09:00 → 10:00
10:00 → 11:00
```

Rejected:

```text
09:00 → 11:00
10:00 → 12:00
```

Conflicts return:

```text
409 Conflict
```

---

# Database Models

## User

```text
id
firstName
lastName
email
passwordHash
createdAt
updatedAt
```

A user can have multiple bookings.

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

Relationships:

```text
CoworkingSpace
      1
      ↓
      *
CoworkingResource
```

---

## ResourceAvailability

```text
id
startsAt
endsAt
resourceId
createdAt
updatedAt
```

Relationship:

```text
CoworkingResource
      1
      ↓
      *
ResourceAvailability
```

Indexes:

```text
resourceId
resourceId + startsAt + endsAt
```

---

## Booking

```text
id
userId
resourceId
startsAt
endsAt
createdAt
updatedAt
```

Relationships:

```text
User 1
  ↓
  *
Booking
```

```text
CoworkingResource 1
        ↓
        *
Booking
```

Indexes:

```text
userId
resourceId
resourceId + startsAt + endsAt
```

---

# Frontend Routes

Public:

```text
/login
/register
```

Protected:

```text
/dashboard
/coworking-spaces
/coworking-spaces/new
/coworking-spaces/:id
/coworking-spaces/:id/resources/new
/coworking-resources/:id/availabilities/new
/coworking-resources/:id/book
/bookings
```

---

# Booking User Flow

```text
Register
    ↓
Login
    ↓
Dashboard
    ↓
Coworking spaces
    ↓
Coworking space details
    ↓
Resource
    ↓
Add availability
    ↓
Availability displayed
    ↓
Book resource
    ↓
Create booking
    ↓
My bookings
```

Reusable page navigation also allows users to return to the dashboard from application pages.

---

# Authentication Architecture

```text
Request
    ↓
Authorization: Bearer <token>
    ↓
JWT middleware
    ↓
jwt.verify(...)
    ↓
req.user
    ↓
Protected controller
```

Authentication and authorization are intentionally separate concerns.

---

# Frontend Authentication

Authentication state is centralized through `AuthContext`.

It manages:

- authenticated user
- JWT access token
- login
- logout
- session restoration
- authentication loading state

Protected React routes use `ProtectedRoute`.

---

# Current Features

- npm workspaces monorepo
- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL database
- Docker Compose development database
- Prisma ORM
- Shared TypeScript and Zod package
- Registration
- Login
- Argon2 password hashing
- JWT authentication
- Authentication middleware
- Session restoration
- Protected frontend routes
- Centralized API client
- Coworking space listing
- Coworking space details
- Coworking space creation
- Coworking resource creation
- Desk and meeting room resources
- Resource availability display
- Resource availability creation
- Availability overlap prevention
- Booking creation
- Booking availability validation
- Booking overlap prevention
- My bookings page
- Reusable page navigation
- Dashboard navigation
- GitHub Actions CI
- Monorepo build pipeline

---

# Planned Features

- Booking cancellation
- Booking status
- User roles
- Role-based authorization
- Admin dashboard
- Improved authentication using HTTP-only cookies
- API documentation with Swagger / OpenAPI
- Backend tests with Vitest and Supertest
- Frontend tests
- CI test pipeline
- Stronger concurrent booking protection
- Improved error handling
- Deployment

---

# Authentication Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This simplifies the MVP authentication flow but is not intended as the final production security architecture.

A future improvement can use HTTP-only cookies to reduce direct JavaScript access to authentication tokens.

---

# CI

GitHub Actions runs for pushes and pull requests targeting:

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

`main` remains stable.

`develop` is the integration branch.

Feature branches should be short-lived and focused.

---

## Commit Convention

Examples:

```text
feat: add booking API
feat: complete booking frontend flow
fix: handle invalid JWT
refactor: centralize API requests
docs: update MVP documentation
chore: update CI configuration
```

---

# Code Quality Principles

- separation of concerns
- reusable components
- strict TypeScript
- shared frontend/backend schemas
- centralized authentication
- centralized API calls
- backend as source of truth
- no secrets committed to Git
- explicit error handling
- small commits
- feature branches
- pull requests before integration
- stable `main`

---

# License

A license has not been selected yet.

---

# Status

✅ First MVP completed.

Completed flow:

```text
Authentication
    ↓
Coworking spaces
    ↓
Coworking resources
    ↓
Resource availability
    ↓
Booking
    ↓
My bookings
```

Next milestone:

```text
Testing
Authorization
Security hardening
Production readiness
```