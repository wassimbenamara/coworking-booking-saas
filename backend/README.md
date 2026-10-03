# Coworking Booking — Backend

REST API for the Coworking Booking SaaS project.

The backend is part of an npm workspaces monorepo.

---

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- Argon2
- JSON Web Tokens (JWT)

---

## Shared Package

The backend uses:

```text
@coworking/shared
```

Shared schemas and TypeScript types are reused across the frontend and backend.

Example:

```ts
import {
  registerSchema,
  loginSchema,
  createCoworkingSpaceSchema,
  createCoworkingResourceSchema,
  type RegisterInput,
  type LoginInput,
  type CreateCoworkingSpaceInput,
  type CreateCoworkingResourceInput,
} from "@coworking/shared";
```

The backend remains the authoritative validation layer.

---

## Installation

Install dependencies from the repository root:

```bash
npm install
```

The monorepo uses a single root:

```text
package-lock.json
```

Do not create a separate backend lockfile.

---

## Environment Variables

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

The `.env` file must not be committed.

---

## Development

From the project root:

```bash
npm run dev --workspace=backend
```

Default API URL:

```text
http://localhost:3000
```

---

## Build

Build the backend:

```bash
npm run build:backend
```

If the shared package changed:

```bash
npm run build:shared
npm run build:backend
```

Build the complete monorepo:

```bash
npm run build
```

---

## Start

```bash
npm run start --workspace=backend
```

---

# Prisma

Prisma configuration:

```text
backend/prisma.config.ts
```

Prisma schema:

```text
backend/prisma/schema.prisma
```

Run Prisma commands from the backend directory:

```bash
cd backend
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Validate Prisma Schema

```bash
npx prisma validate
```

## Apply Development Migration

```bash
npx prisma migrate dev --name <migration-name>
```

Example:

```bash
npx prisma migrate dev --name add_coworking_resources
```

## Prisma Studio

```bash
npx prisma studio
```

Return to the project root:

```bash
cd ..
```

---

# API Endpoints

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
  "firstName": "Wassim",
  "lastName": "Ben Amara",
  "email": "wassim@example.com",
  "password": "StrongPassword123!"
}
```

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

Example request:

```json
{
  "email": "wassim@example.com",
  "password": "StrongPassword123!"
}
```

Example response:

```json
{
  "user": {
    "id": 1,
    "firstName": "Wassim",
    "lastName": "Ben Amara",
    "email": "wassim@example.com"
  },
  "accessToken": "<jwt-token>"
}
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
```

The same credential error is returned for an unknown email and an incorrect password.

---

## Current Authenticated User

```http
GET /api/auth/me
```

Requires:

```http
Authorization: Bearer <access_token>
```

Possible responses:

```text
200 OK
401 Unauthorized
```

---

# Coworking Spaces

All coworking space routes are protected.

The router applies:

```ts
router.use(authenticate);
```

Requests require:

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

Example request:

```json
{
  "name": "WorkHub Paris",
  "description": "Modern coworking space",
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

Coworking resources are reservable entities that belong to a coworking space.

Supported resource types:

```text
DESK
MEETING_ROOM
```

All resource routes are protected by JWT authentication.

Requests require:

```http
Authorization: Bearer <access_token>
```

---

## List Resources for a Coworking Space

```http
GET /api/coworking-spaces/:coworkingSpaceId/resources
```

Example:

```http
GET /api/coworking-spaces/1/resources
```

Successful response:

```http
200 OK
```

Example response:

```json
{
  "resources": [
    {
      "id": 1,
      "name": "Desk A1",
      "type": "DESK",
      "capacity": 1,
      "coworkingSpaceId": 1,
      "createdAt": "2026-10-03T12:00:00.000Z",
      "updatedAt": "2026-10-03T12:00:00.000Z"
    }
  ]
}
```

Possible responses:

```text
200 OK
400 Bad Request
401 Unauthorized
```

---

## Get Coworking Resource by ID

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

Desk example:

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

Successful response:

```http
201 Created
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
404 Not Found
```

`404 Not Found` is returned when the referenced coworking space does not exist.

---

# Authentication Architecture

Passwords are hashed using Argon2.

Successful login generates a JWT access token.

Current JWT claims:

```text
sub
email
```

`sub` contains the user ID.

Passwords and other sensitive data are never stored in JWT payloads.

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

Authentication and authorization are treated as separate concerns.

---

# Validation

Request validation uses Zod.

Shared schemas live in:

```text
packages/shared/src/schemas/
```

Current schemas include:

```text
auth.schema.ts
coworking-space.schema.ts
coworking-resource.schema.ts
```

Current code uses non-deprecated Zod error APIs such as:

```ts
z.flattenError(validation.error)
```

The backend remains the final source of truth for validation.

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

Type:

```text
DESK
MEETING_ROOM
```

Relation:

```text
CoworkingSpace 1
      ↓
      *
CoworkingResource
```

Deleting a coworking space cascades to its resources.

---

# Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
│
├── src/
│   ├── config/
│   │   └── auth.config.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── coworking-resource.controller.ts
│   │   └── coworking-space.controller.ts
│   │
│   ├── generated/
│   │   └── prisma/
│   │
│   ├── lib/
│   │   └── prisma.ts
│   │
│   ├── middlewares/
│   │   └── auth.middleware.ts
│   │
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── coworking-resource.routes.ts
│   │   └── coworking-space.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── coworking-resource.service.ts
│   │   └── coworking-space.service.ts
│   │
│   ├── types/
│   │   └── express.d.ts
│   │
│   └── server.ts
│
├── .env.example
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

Shared schemas:

```text
packages/shared/src/schemas/
├── auth.schema.ts
├── coworking-resource.schema.ts
└── coworking-space.schema.ts
```

---

# Architecture

Backend features follow:

```text
Route
    ↓
Controller
    ↓
Service
    ↓
Prisma
    ↓
PostgreSQL
```

Responsibilities:

```text
Route
→ HTTP endpoint and middleware declaration

Controller
→ HTTP request/response handling and validation

Service
→ domain and persistence operations

Prisma
→ database access
```

---

# Current Features

- Express REST API
- TypeScript configuration
- PostgreSQL database
- Prisma ORM
- Database migrations
- Shared Zod validation
- User registration
- User login
- Argon2 password hashing
- JWT access tokens
- JWT authentication middleware
- Protected backend routes
- Authenticated current-user endpoint
- CoworkingSpace database model
- Protected coworking space listing
- Protected coworking space details
- Authenticated coworking space creation
- CoworkingResource database model
- Coworking resource enum
- Coworking resource listing
- Coworking resource details
- Authenticated coworking resource creation
- Parent coworking existence validation

---

# Planned Features

- Coworking resource frontend
- Coworking space update
- Coworking space deletion
- Coworking resource update
- Coworking resource deletion
- Role management
- Role-based authorization
- Resource availability
- Booking system
- Booking conflict prevention
- Swagger / OpenAPI documentation
- Backend tests with Vitest and Supertest

---

# Status

🚧 Work in progress.

Current backend milestone:

```text
Coworking resources API
```

Next:

```text
Coworking resources frontend
```