# Coworking Booking - Backend

REST API for the Coworking Booking SaaS project.

The backend is part of an npm workspaces monorepo.

## Tech Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Zod
- Argon2
- JSON Web Token (JWT)

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
  type RegisterInput,
  type LoginInput,
} from "@coworking/shared";
```

The backend remains the authoritative validation layer.

## Installation

Dependencies are installed from the monorepo root:

```bash
npm install
```

Avoid creating a separate backend `package-lock.json`.

## Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL="postgresql://coworking_user:change_me@localhost:5432/coworking_db?schema=public"

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
```

The `.env` file is ignored by Git and should not be committed.

## Development

From the project root:

```bash
npm run dev --workspace=backend
```

The API is available by default at:

```text
http://localhost:3000
```

## Build

From the project root:

```bash
npm run build:backend
```

The shared package must be built before the backend:

```bash
npm run build:shared
npm run build:backend
```

## Start

```bash
npm run start --workspace=backend
```

## Prisma

### Generate Prisma Client

```bash
npm run prisma:generate --workspace=backend
```

### Validate Prisma schema

```bash
npm exec --workspace=backend prisma validate
```

### Apply migrations

```bash
npm exec --workspace=backend prisma migrate dev
```

### Open Prisma Studio

```bash
npm exec --workspace=backend prisma studio
```

## Current Endpoints

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

### Health check

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

### User registration

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

Successful response:

```http
201 Created
```

```json
{
  "id": 1,
  "firstName": "Wassim",
  "lastName": "Ben Amara",
  "email": "wassim@example.com",
  "createdAt": "2026-09-26T00:00:00.000Z"
}
```

Invalid request data:

```http
400 Bad Request
```

Email already registered:

```http
409 Conflict
```

### User login

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

```http
400 Bad Request
```

Invalid email or password:

```http
401 Unauthorized
```

```json
{
  "message": "Invalid email or password"
}
```

The same error is returned for an unknown email and an incorrect password to avoid exposing whether an account exists.


### Current authenticated user

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

Missing, invalid or expired token:

```http
401 Unauthorized
```


## Authentication

Passwords are hashed using Argon2.

On successful login, the API generates a JWT access token.

The token currently contains:

```text
sub
email
```

The `sub` claim contains the user's ID.

Sensitive information such as passwords is never stored inside the JWT.

## Current Database Models

### User

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

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── auth.config.ts
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── generated/
│   │   └── prisma/
│   ├── lib/
│   │   └── prisma.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── services/
│   │   └── auth.service.ts
│   └── server.ts
|   ├── middlewares/
│       └── auth.middleware.ts
|   ├── types/
│       └── express.d.ts
├── .env.example
├── prisma7.config.ts
├── package.json
└── tsconfig.json
```

Shared authentication schemas are located in:

```text
packages/shared/src/schemas/auth.schema.ts
```

## Current Features

- Express REST API
- TypeScript configuration
- Health check endpoint
- PostgreSQL database connection
- Prisma ORM configuration
- Initial database migration
- User database model
- User registration
- User login
- Shared request validation with Zod
- Password hashing with Argon2
- Duplicate email prevention
- JWT access token generation
- Invalid credentials protection
- JWT authentication middleware
- Protected routes
- Authenticated user endpoint

## Planned Features

- Role management
- Coworking space management
- Room and desk management
- Booking system
- Booking conflict prevention
- Swagger / OpenAPI documentation
- Automated tests

## Status

🚧 Work in progress.