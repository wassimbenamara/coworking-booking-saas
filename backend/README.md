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

The backend uses the internal workspace package:

```text
@coworking/shared
```

The shared package contains validation schemas and TypeScript types used by both the frontend and backend.

Example:

```ts
import {
  registerSchema,
  loginSchema,
  createCoworkingSpaceSchema,
  type RegisterInput,
  type LoginInput,
  type CreateCoworkingSpaceInput,
} from "@coworking/shared";
```

The backend remains the authoritative validation layer.

---

## Installation

Dependencies are installed from the monorepo root:

```bash
npm install
```

The project uses one root `package-lock.json`.

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

The `.env` file is ignored by Git and must not be committed.

---

## Development

From the repository root:

```bash
npm run dev --workspace=backend
```

The API is available by default at:

```text
http://localhost:3000
```

---

## Build

From the repository root:

```bash
npm run build:backend
```

The shared package must be built before the backend when its source has changed:

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

Prisma configuration is located in:

```text
backend/prisma.config.ts
```

Prisma schema:

```text
backend/prisma/schema.prisma
```

The recommended workflow is to run Prisma CLI commands from the backend directory.

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

## Apply Development Migrations

```bash
npx prisma migrate dev --name <migration-name>
```

Example:

```bash
npx prisma migrate dev --name add_coworking_space
```

## Open Prisma Studio

```bash
npx prisma studio
```

Return to the repository root:

```bash
cd ..
```

---

# Current Endpoints

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

## User Registration

```http
POST /api/auth/register
```

Request body:

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

Passwords are hashed with Argon2 before being stored.

---

## User Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "wassim@example.com",
  "password": "StrongPassword123!"
}
```

Successful response:

```http
200 OK
```

```json
{
  "user": {
    "id": 1,
    "firstName": "Wassim",
    "lastName": "Ben Amara",
    "email": "wassim@example.com"
  },
  "accessToken": "jwt-token"
}
```

Invalid request data:

```text
400 Bad Request
```

Invalid email or password:

```text
401 Unauthorized
```

Example:

```json
{
  "message": "Invalid email or password"
}
```

The same error is returned for an unknown email and an incorrect password to avoid exposing whether an account exists.

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

Successful response:

```http
200 OK
```

```json
{
  "user": {
    "id": 1,
    "email": "wassim@example.com"
  }
}
```

Missing, invalid, or expired token:

```text
401 Unauthorized
```

---

# Coworking Spaces

All coworking space routes are protected by the JWT authentication middleware.

Requests must include:

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

## Create Coworking Space

```http
POST /api/coworking-spaces
```

Possible responses:

```text
201 Created
400 Bad Request
401 Unauthorized
```

# Authentication Architecture

Passwords are hashed using Argon2.

On successful login, the API generates a JWT access token.

The token currently contains:

```text
sub
email
```

The `sub` claim contains the user's ID.

Sensitive information such as passwords is never stored inside the JWT.

Protected routes use the authentication middleware.

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

Authentication and authorization remain separate concerns.

Role-based authorization will be added later.

---

# Validation

Request validation uses Zod.

Schemas shared with the frontend live in:

```text
packages/shared/src/schemas/
```

Current schemas include:

```text
auth.schema.ts
coworking-space.schema.ts
```

Example:

```ts
const validation = createCoworkingSpaceSchema.safeParse(req.body);
```

The backend remains the final source of truth for request validation.

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
```

`description` is optional / nullable.

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
│   │   └── coworking-space.routes.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
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
└── coworking-space.schema.ts
```

---

# Architecture

Coworking features follow a separation of concerns:

```text
HTTP Request
    ↓
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
→ endpoint declaration and middleware

Controller
→ HTTP request / response handling

Service
→ business and persistence logic

Prisma
→ database access
```

The coworking router applies authentication to all routes:
```text
router.use(authenticate);
```


---

# Current Features

- Express REST API
- TypeScript configuration
- Health check endpoint
- PostgreSQL database
- Prisma ORM
- Database migrations
- User database model
- CoworkingSpace database model
- User registration
- User login
- Shared request validation with Zod
- Shared coworking space validation
- Password hashing with Argon2
- Duplicate email prevention
- JWT access token generation
- Invalid credentials protection
- JWT authentication middleware
- Protected routes
- Authenticated user endpoint
- Protected coworking space routes
- Authenticated coworking space listing
- Authenticated coworking space details
- Authenticated coworking space creation

---

# Planned Features

- Coworking space update
- Coworking space deletion
- Role management
- Role-based authorization
- Room and desk management
- Resource availability
- Booking system
- Booking conflict prevention
- Swagger / OpenAPI documentation
- Automated backend tests

---

# Status

🚧 Work in progress.

Current backend milestone:

```text
Coworking spaces API
```

Next:

```text
Coworking resources and booking domain
```