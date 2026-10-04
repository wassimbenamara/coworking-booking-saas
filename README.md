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

Dependencies are installed from the project root:

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

Shared schemas currently include:

```text
auth.schema.ts
booking.schema.ts
coworking-resource.schema.ts
coworking-space.schema.ts
resource-availability.schema.ts
```

This avoids duplicating validation logic between the frontend and backend.

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

From the `backend` directory:

```bash
npx prisma validate
```

Create a migration:

```bash
npx prisma migrate dev --name <migration-name>
```

Generate the Prisma client:

```bash
npx prisma generate
```

Open Prisma Studio:

```bash
npx prisma studio
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

Example:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Passwords are hashed using Argon2 before being stored.

Possible responses:

```text
201 Created
400 Bad Request
409 Conflict
```

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

The same error is returned for unknown email addresses and incorrect passwords to reduce account enumeration risks.

---

## Current Authenticated User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

Missing, invalid, or expired JWTs return:

```text
401 Unauthorized
```

---

# Coworking Spaces

All coworking domain routes are protected by JWT authentication.

## List Coworking Spaces

```http
GET /api/coworking-spaces
```

---

## Get Coworking Space

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

Example:

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

A coworking space can contain multiple bookable resources.

Supported resource types:

```text
DESK
MEETING_ROOM
```

## List Resources for a Coworking Space

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

---

## Get Resource

```http
GET /api/coworking-resources/:id
```

---

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

Resource availability defines the time ranges during which a coworking resource can be booked.

All availability endpoints require JWT authentication.

## List Resource Availabilities

```http
GET /api/coworking-resources/:resourceId/availabilities
```

Example response:

```json
{
  "availabilities": [
    {
      "id": 1,
      "resourceId": 1,
      "startsAt": "2026-10-10T09:00:00.000Z",
      "endsAt": "2026-10-10T18:00:00.000Z",
      "createdAt": "2026-10-04T09:00:00.000Z",
      "updatedAt": "2026-10-04T09:00:00.000Z"
    }
  ]
}
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

- `resourceId` must be a positive integer
- `startsAt` must be a valid ISO datetime
- `endsAt` must be a valid ISO datetime
- `endsAt` must be after `startsAt`

---

## Availability Overlap Prevention

Availability ranges for the same resource cannot overlap.

Overlap rule:

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

```http
409 Conflict
```

---

# Booking

Authenticated users can create bookings for coworking resources.

A booking:

- belongs to the authenticated user
- belongs to one coworking resource
- must fit inside an existing availability window
- must not overlap another booking for the same resource

The authenticated user is derived from the JWT.

`userId` is never accepted from the request body.

---

## List My Bookings

```http
GET /api/bookings/me
```

Returns bookings belonging to the authenticated user.

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

Validation rules:

- `resourceId` must be a positive integer
- `startsAt` must be a valid ISO datetime
- `endsAt` must be a valid ISO datetime
- `endsAt` must be after `startsAt`

Business rules:

- the resource must exist
- the booking must fit entirely inside an availability window
- the booking must not overlap another booking for the same resource
- the user is determined from the authenticated JWT

---

## Booking Conflict Prevention

A booking overlaps another booking when:

```text
existing.startsAt < new.endsAt
AND
existing.endsAt > new.startsAt
```

Allowed:

```text
Booking A: 09:00 → 10:00
Booking B: 10:00 → 11:00
```

Rejected:

```text
Booking A: 09:00 → 11:00
Booking B: 10:00 → 12:00
```

Conflicts return:

```http
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

A coworking space can contain multiple resources.

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

Supported types:

```text
DESK
MEETING_ROOM
```

Relationships:

```text
CoworkingSpace
      1
      ↓
      *
CoworkingResource
```

A resource can have multiple availability ranges and bookings.

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

Each availability belongs to one coworking resource.

Deleting the resource also deletes its availability ranges.

Indexes are defined for:

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
User
  1
  ↓
  *
Booking
  *
  ↑
  1
CoworkingResource
```

Each booking belongs to one user and one coworking resource.

Indexes are defined for:

```text
userId
resourceId
resourceId + startsAt + endsAt
```

---

# Authentication Architecture

Protected backend routes use JWT authentication middleware.

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

Role-based authorization can therefore be added independently later.

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

The application avoids accessing `localStorage` directly throughout the component tree.

---

## Session Restoration

At application startup:

```text
Application starts
    ↓
Access token available?
    ↓
GET /api/auth/me
    ↓
Valid token?
    ├── Yes → restore user
    └── No  → clear local authentication state
```

The backend remains the source of truth for authentication.

---

# Frontend Routes

```text
/login
/register
/dashboard
/coworking-spaces
/coworking-spaces/new
/coworking-spaces/:id
/coworking-spaces/:id/resources/new
```

Protected application routes redirect unauthenticated users to:

```text
/login
```

---

# Current Features

- npm workspaces monorepo
- React + TypeScript frontend
- Express + TypeScript backend
- PostgreSQL
- Docker development environment
- Prisma ORM
- Shared TypeScript and Zod package
- User registration
- User login
- Argon2 password hashing
- JWT authentication
- Authenticated user endpoint
- React authentication context
- Session restoration
- Protected frontend routes
- Centralized API client
- Coworking space model
- Coworking spaces API
- Coworking spaces frontend
- Coworking resource model
- Desk and meeting room resources
- Coworking resource API
- Coworking resource frontend
- Resource availability model
- Resource availability API
- Availability validation
- Availability overlap prevention
- Booking model
- Shared booking validation
- Booking creation API
- Authenticated user booking history API
- Availability-bound booking validation
- Booking overlap prevention
- GitHub Actions CI
- Monorepo build pipeline

---

# Planned Features

- Booking frontend
- Booking cancellation
- Booking status management
- Improved booking history UI
- Improved authentication security using HTTP-only cookies
- User roles
- Role-based authorization
- Admin dashboard
- API documentation with Swagger / OpenAPI
- Backend tests with Vitest and Supertest
- Frontend tests
- CI test pipeline
- Improved error handling
- Deployment

---

# Authentication Security Note

The current MVP stores the JWT access token in browser `localStorage`.

This simplifies the initial authentication implementation but is not intended to be the final production authentication architecture.

A future security improvement can migrate authentication to HTTP-only cookies to reduce direct JavaScript access to authentication tokens.

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

The complete monorepo should also build locally:

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

`main`

Stable production-ready branch.

`develop`

Integration branch for completed features.

Feature branches:

```text
feature/<feature-name>
```

Other prefixes:

```text
fix/
refactor/
chore/
```

---

# Commit Convention

Conventional Commit-style messages are used when practical.

Examples:

```text
feat: add booking API
feat: add coworking resources frontend
fix: handle invalid JWT
refactor: centralize API requests
chore: update CI configuration
docs: update booking documentation
```

Commits should remain focused and describe one logical change.

---

# Pull Requests

Feature branches should normally be merged into:

```text
develop
```

`main` remains stable.

The first MVP target includes:

- user registration
- user login
- coworking spaces
- coworking resources
- resource availability
- basic booking functionality

Once the booking frontend is completed and the MVP is verified, `develop` will be merged into `main`.

---

# Code Quality Principles

The project aims to follow:

- separation of concerns
- reusable components
- centralized authentication
- centralized API requests
- shared frontend/backend schemas
- backend as the source of truth
- environment variables for configuration
- no secrets committed to Git
- strict TypeScript
- explicit API error handling
- small feature branches
- focused commits
- pull requests before integration
- stable `main` branch

---

# License

A license has not been selected yet.

---

# Status

🚧 Work in progress.

Current milestone:

```text
Booking API
```

Completed:

```text
Authentication
    ↓
Coworking spaces API + frontend
    ↓
Coworking resources API + frontend
    ↓
Resource availability API
    ↓
Booking API
```

Next milestone:

```text
Booking frontend
```

After the booking frontend is complete and the MVP flow is validated:

```text
develop
    ↓
Pull Request
    ↓
main
```