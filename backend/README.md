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
  type RegisterInput,
} from "@coworking/shared";
```

The backend remains the authoritative validation layer even when the same schema is also used by the frontend.

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
```

The `.env` file is ignored by Git and should not be committed.

## Development

From the project root:

```bash
npm run dev --workspace=backend
```

Or from the backend directory:

```bash
npm run dev
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

Or from the backend directory:

```bash
npm run build
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

### Create a named migration

```bash
npm exec --workspace=backend prisma migrate dev -- --name migration_name
```

Example:

```bash
npm exec --workspace=backend prisma migrate dev -- --name init
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

Passwords are stored as Argon2 hashes and are never returned by the registration API.

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
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
├── .env.example
├── prisma7.config.ts
├── package.json
└── tsconfig.json
```

Shared validation schemas are located at:

```text
packages/shared/
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
- Shared request validation with Zod
- Password hashing with Argon2
- Duplicate email prevention

## Planned Features

- User login
- JWT authentication
- Role management
- Coworking space management
- Room and desk management
- Booking system
- Booking conflict prevention
- Swagger / OpenAPI documentation
- Automated tests

## Status

🚧 Work in progress.